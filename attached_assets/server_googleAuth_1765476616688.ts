/**
 * Secure Google JWT Token Verification
 * 
 * This module properly verifies Google OAuth tokens by:
 * 1. Fetching Google's public keys (JWKS)
 * 2. Verifying the JWT signature cryptographically
 * 3. Validating all required claims (iss, aud, exp)
 */

import crypto from 'crypto';
import { logger } from './logger';

const authLogger = logger.child({ source: 'google-auth' });

interface GoogleJWK {
  kid: string;
  kty: string;
  alg: string;
  use: string;
  n: string;
  e: string;
}

interface GoogleJWKS {
  keys: GoogleJWK[];
}

interface GoogleTokenPayload {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  iat: number;
  exp: number;
}

// Cache for Google's public keys (refreshed every hour)
let cachedKeys: GoogleJWKS | null = null;
let keysCacheTime: number = 0;
const KEYS_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];

/**
 * Fetch Google's public keys for JWT verification
 */
async function getGooglePublicKeys(): Promise<GoogleJWKS> {
  const now = Date.now();
  
  if (cachedKeys && (now - keysCacheTime) < KEYS_CACHE_DURATION) {
    return cachedKeys;
  }

  try {
    const response = await fetch(GOOGLE_JWKS_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch Google keys: ${response.status}`);
    }
    
    cachedKeys = await response.json() as GoogleJWKS;
    keysCacheTime = now;
    return cachedKeys;
  } catch (error) {
    // If we have cached keys, use them even if expired (better than failing)
    if (cachedKeys) {
      console.warn('Failed to refresh Google keys, using cached keys');
      return cachedKeys;
    }
    throw error;
  }
}

/**
 * Convert a JWK RSA key to PEM format
 */
function jwkToPem(jwk: GoogleJWK): string {
  const n = Buffer.from(jwk.n, 'base64url');
  const e = Buffer.from(jwk.e, 'base64url');

  // Build the RSA public key in DER format
  const nLen = n.length;
  const eLen = e.length;

  // Integer encoding for n
  const nEncoded = Buffer.concat([
    Buffer.from([0x02]), // INTEGER tag
    encodeLength(nLen + (n[0] & 0x80 ? 1 : 0)),
    n[0] & 0x80 ? Buffer.from([0x00]) : Buffer.alloc(0),
    n
  ]);

  // Integer encoding for e
  const eEncoded = Buffer.concat([
    Buffer.from([0x02]), // INTEGER tag
    encodeLength(eLen + (e[0] & 0x80 ? 1 : 0)),
    e[0] & 0x80 ? Buffer.from([0x00]) : Buffer.alloc(0),
    e
  ]);

  // SEQUENCE containing n and e
  const rsaKey = Buffer.concat([
    Buffer.from([0x30]), // SEQUENCE tag
    encodeLength(nEncoded.length + eEncoded.length),
    nEncoded,
    eEncoded
  ]);

  // RSA OID: 1.2.840.113549.1.1.1
  const rsaOid = Buffer.from([
    0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86,
    0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00
  ]);

  // BIT STRING wrapper for the key
  const bitString = Buffer.concat([
    Buffer.from([0x03]), // BIT STRING tag
    encodeLength(rsaKey.length + 1),
    Buffer.from([0x00]), // unused bits
    rsaKey
  ]);

  // Final SEQUENCE
  const der = Buffer.concat([
    Buffer.from([0x30]), // SEQUENCE tag
    encodeLength(rsaOid.length + bitString.length),
    rsaOid,
    bitString
  ]);

  const base64 = der.toString('base64');
  const lines = base64.match(/.{1,64}/g) || [];
  
  return `-----BEGIN PUBLIC KEY-----\n${lines.join('\n')}\n-----END PUBLIC KEY-----`;
}

/**
 * Encode length in ASN.1 DER format
 */
function encodeLength(len: number): Buffer {
  if (len < 128) {
    return Buffer.from([len]);
  }
  
  const bytes: number[] = [];
  let temp = len;
  while (temp > 0) {
    bytes.unshift(temp & 0xff);
    temp >>= 8;
  }
  
  return Buffer.from([0x80 | bytes.length, ...bytes]);
}

/**
 * Base64URL decode
 */
function base64UrlDecode(str: string): Buffer {
  // Add padding if needed
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64');
}

/**
 * Verify a Google ID token
 * 
 * @param token - The JWT token from Google Sign-In
 * @param clientId - Your Google OAuth client ID
 * @returns The verified token payload, or null if verification fails
 */
export async function verifyGoogleToken(
  token: string, 
  clientId: string
): Promise<GoogleTokenPayload | null> {
  try {
    // Split the JWT
    const parts = token.split('.');
    if (parts.length !== 3) {
      authLogger.warn('Invalid JWT format: expected 3 parts');
      return null;
    }

    const [headerB64, payloadB64, signatureB64] = parts;

    // Decode header to get key ID
    const header = JSON.parse(base64UrlDecode(headerB64).toString('utf-8'));
    const { kid, alg } = header;

    if (!kid) {
      authLogger.warn('Missing key ID in JWT header');
      return null;
    }

    if (alg !== 'RS256') {
      authLogger.warn(`Unsupported algorithm: ${alg}`);
      return null;
    }

    // Get Google's public keys
    const keys = await getGooglePublicKeys();
    const key = keys.keys.find(k => k.kid === kid);

    if (!key) {
      authLogger.warn(`Key not found for kid: ${kid}`);
      return null;
    }

    // Convert JWK to PEM
    const pem = jwkToPem(key);

    // Verify signature
    const signedData = `${headerB64}.${payloadB64}`;
    const signature = base64UrlDecode(signatureB64);

    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(signedData);

    const isValid = verifier.verify(pem, signature);

    if (!isValid) {
      authLogger.warn('JWT signature verification failed');
      return null;
    }

    // Decode and validate payload
    const payload = JSON.parse(base64UrlDecode(payloadB64).toString('utf-8')) as GoogleTokenPayload;

    // Verify issuer
    if (!GOOGLE_ISSUERS.includes(payload.iss)) {
      authLogger.warn(`Invalid issuer: ${payload.iss}`);
      return null;
    }

    // Verify audience (must match our client ID)
    if (payload.aud !== clientId) {
      authLogger.warn(`Invalid audience: ${payload.aud}, expected: ${clientId}`);
      return null;
    }

    // Verify expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      authLogger.warn('Token has expired');
      return null;
    }

    // Verify not issued in the future (with 5 minute clock skew tolerance)
    if (payload.iat > now + 300) {
      authLogger.warn('Token issued in the future');
      return null;
    }

    return payload;
  } catch (error) {
    authLogger.error('Google token verification error', error as Error);
    return null;
  }
}

/**
 * Type guard to check if payload has required fields
 */
export function isValidGooglePayload(payload: GoogleTokenPayload | null): payload is GoogleTokenPayload {
  return payload !== null && 
         typeof payload.email === 'string' && 
         typeof payload.sub === 'string';
}
