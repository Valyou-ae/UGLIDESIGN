import { Request, Response, NextFunction } from "express";

/**
 * OpenID Connect claims from authentication
 */
export interface AuthClaims {
  sub: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  exp?: number;
}

/**
 * Authenticated user session data
 */
export interface AuthUser {
  claims: AuthClaims;
  access_token?: string;
  refresh_token?: string;
  expires_at?: number;
}

/**
 * Express Request with authenticated user
 */
export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

/**
 * Express middleware function type
 */
export type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void | Promise<void>;

/**
 * SSE event sender function type
 */
export type SSEEventSender = (event: string, data: unknown) => void;
