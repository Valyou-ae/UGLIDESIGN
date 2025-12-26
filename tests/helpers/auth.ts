/**
 * Authentication test helpers
 */

import type { Request } from 'express';
import type { users } from '@/shared/schema';

/**
 * Create a mock authenticated request
 */
export function createAuthenticatedRequest(user: typeof users.$inferSelect): Partial<Request> {
  return {
    isAuthenticated: () => true,
    user: user,
    session: {
      cookie: {
        maxAge: 86400000,
        originalMaxAge: 86400000,
      },
      regenerate: (callback: (err?: any) => void) => callback(),
      destroy: (callback: (err?: any) => void) => callback(),
      reload: (callback: (err?: any) => void) => callback(),
      save: (callback: (err?: any) => void) => callback(),
      touch: () => {},
      resetMaxAge: () => {},
      id: 'test-session-id',
    } as any,
  };
}

/**
 * Create a mock unauthenticated request
 */
export function createUnauthenticatedRequest(): Partial<Request> {
  return {
    isAuthenticated: () => false,
    user: undefined,
    session: {
      cookie: {
        maxAge: 86400000,
        originalMaxAge: 86400000,
      },
      regenerate: (callback: (err?: any) => void) => callback(),
      destroy: (callback: (err?: any) => void) => callback(),
      reload: (callback: (err?: any) => void) => callback(),
      save: (callback: (err?: any) => void) => callback(),
      touch: () => {},
      resetMaxAge: () => {},
      id: 'test-session-id',
    } as any,
  };
}

/**
 * Create a session cookie string for testing
 */
export function createSessionCookie(sessionId: string): string {
  return `connect.sid=s%3A${sessionId}.signature; Path=/; HttpOnly`;
}

/**
 * Extract session ID from cookie string
 */
export function extractSessionId(cookieString: string): string | null {
  const match = cookieString.match(/connect\.sid=s%3A([^.]+)/);
  return match ? match[1] : null;
}
