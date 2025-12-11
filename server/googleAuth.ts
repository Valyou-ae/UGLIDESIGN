/**
 * Secure Google JWT Token Verification
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

let cachedKeys: GoogleJWKS | null = null;
let keysCacheTime: number = 0;
const KEYS_CACHE_DURATION = 60 * 60 * 1000;

const GOOGLE_JWKS_URL = 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_ISSUERS = ['https://accounts.google.com', 'accounts.google.com'];

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
    if (cachedKeys) {
      authLogger.warn('Failed to refresh Google keys, using cached keys');
      return cachedKeys;
    }
    throw error;
  }
}

function jwkToPem(jwk: GoogleJWK): string {
  const n = Buffer.from(jwk.n, 'base64url');
  const e = Buffer.from(jwk.e, 'base64url');

  const nLen = n.length;
  const eLen = e.length;

  const nEncoded = Buffer.concat([
    Buffer.from([0x02]),
    encodeLength(nLen + (n[0] & 0x80 ? 1 : 0)),
    n[0] & 0x80 ? Buffer.from([0x00]) : Buffer.alloc(0),
    n
  ]);

  const eEncoded = Buffer.concat([
    Buffer.from([0x02]),
    encodeLength(eLen + (e[0] & 0x80 ? 1 : 0)),
    e[0] & 0x80 ? Buffer.from([0x00]) : Buffer.alloc(0),
    e
  ]);

  const rsaKey = Buffer.concat([
    Buffer.from([0x30]),
    encodeLength(nEncoded.length + eEncoded.length),
    nEncoded,
    eEncoded
  ]);

  const rsaOid = Buffer.from([
    0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86,
    0xf7, 0x0d, 0x01, 0x01, 0x01, 0x05, 0x00
  ]);

  const bitString = Buffer.concat([
    Buffer.from([0x03]),
    encodeLength(rsaKey.length + 1),
    Buffer.from([0x00]),
    rsaKey
  ]);

  const der = Buffer.concat([
    Buffer.from([0x30]),
    encodeLength(rsaOid.length + bitString.length),
    rsaOid,
    bitString
  ]);

  const base64 = der.toString('base64');
  const lines = base64.match(/.{1,64}/g) || [];
  
  return `-----BEGIN PUBLIC KEY-----\n${lines.join('\n')}\n-----END PUBLIC KEY-----`;
}

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

function base64UrlDecode(str: string): Buffer {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64');
}

export async function verifyGoogleToken(
  token: string, 
  clientId: string
): Promise<GoogleTokenPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      authLogger.warn('Invalid JWT format: expected 3 parts');
      return null;
    }

    const [headerB64, payloadB64, signatureB64] = parts;

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

    const keys = await getGooglePublicKeys();
    const key = keys.keys.find(k => k.kid === kid);

    if (!key) {
      authLogger.warn(`Key not found for kid: ${kid}`);
      return null;
    }

    const pem = jwkToPem(key);

    const signedData = `${headerB64}.${payloadB64}`;
    const signature = base64UrlDecode(signatureB64);

    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(signedData);

    const isValid = verifier.verify(pem, signature);

    if (!isValid) {
      authLogger.warn('JWT signature verification failed');
      return null;
    }

    const payload = JSON.parse(base64UrlDecode(payloadB64).toString('utf-8')) as GoogleTokenPayload;

    if (!GOOGLE_ISSUERS.includes(payload.iss)) {
      authLogger.warn(`Invalid issuer: ${payload.iss}`);
      return null;
    }

    if (payload.aud !== clientId) {
      authLogger.warn(`Invalid audience: ${payload.aud}, expected: ${clientId}`);
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      authLogger.warn('Token has expired');
      return null;
    }

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

export function isValidGooglePayload(payload: GoogleTokenPayload | null): payload is GoogleTokenPayload {
  return payload !== null && 
         typeof payload.email === 'string' && 
         typeof payload.sub === 'string';
}
