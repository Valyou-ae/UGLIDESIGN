import type { Request, Response, NextFunction } from "express";
import { logger } from './logger';

interface LockoutEntry {
  attempts: number;
  lockedUntil?: number;
  lastAttempt: number;
}

const lockoutStore = new Map<string, LockoutEntry>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_LOCKOUT_ENTRIES = 10000;

/**
 * Track failed login attempt for an identifier (email or IP)
 */
export function recordFailedAttempt(identifier: string): void {
  const now = Date.now();
  const entry = lockoutStore.get(identifier);

  // Enforce max size to prevent memory exhaustion
  if (lockoutStore.size >= MAX_LOCKOUT_ENTRIES && !entry) {
    // Evict oldest 10% of entries
    const sortedEntries = Array.from(lockoutStore.entries())
      .sort((a, b) => a[1].lastAttempt - b[1].lastAttempt);
    const evictCount = Math.floor(MAX_LOCKOUT_ENTRIES * 0.1);
    for (let i = 0; i < evictCount && i < sortedEntries.length; i++) {
      lockoutStore.delete(sortedEntries[i][0]);
    }
  }

  if (!entry || now - entry.lastAttempt > ATTEMPT_WINDOW) {
    // First attempt or window expired - reset
    lockoutStore.set(identifier, {
      attempts: 1,
      lastAttempt: now,
    });
    return;
  }

  entry.attempts++;
  entry.lastAttempt = now;

  if (entry.attempts >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_DURATION;
    logger.warn('Account locked due to failed login attempts', undefined, {
      source: 'security',
      identifier: identifier.includes('@') ? 'email' : 'ip',
      attempts: entry.attempts,
    });
  }

  lockoutStore.set(identifier, entry);
}

/**
 * Clear failed attempts for an identifier (call on successful login)
 */
export function clearFailedAttempts(identifier: string): void {
  lockoutStore.delete(identifier);
}

/**
 * Check if an identifier is currently locked out
 */
export function isLockedOut(identifier: string): { locked: boolean; retryAfter?: number } {
  const entry = lockoutStore.get(identifier);
  
  if (!entry || !entry.lockedUntil) {
    return { locked: false };
  }

  const now = Date.now();
  
  if (now >= entry.lockedUntil) {
    // Lockout expired
    lockoutStore.delete(identifier);
    return { locked: false };
  }

  const retryAfter = Math.ceil((entry.lockedUntil - now) / 1000);
  return { locked: true, retryAfter };
}

/**
 * Middleware to check account lockout before login attempts
 */
export function checkAccountLockout(req: Request, res: Response, next: NextFunction): void {
  const email = req.body.email?.toLowerCase();
  const ip = req.ip || req.socket?.remoteAddress || 'unknown';
  
  // Check both email and IP lockout
  const identifiers = [email, `ip:${ip}`].filter(Boolean);
  
  for (const identifier of identifiers) {
    const lockout = isLockedOut(identifier);
    if (lockout.locked) {
      res.set('Retry-After', String(lockout.retryAfter));
      return res.status(429).json({
        message: `Account temporarily locked due to too many failed login attempts. Please try again in ${lockout.retryAfter} seconds.`,
        retryAfter: lockout.retryAfter,
      }) as any;
    }
  }
  
  next();
}

/**
 * Get lockout statistics (for monitoring)
 */
export function getLockoutStats() {
  const now = Date.now();
  let totalLocked = 0;
  let totalAttempts = 0;

  for (const entry of lockoutStore.values()) {
    if (entry.lockedUntil && now < entry.lockedUntil) {
      totalLocked++;
    }
    totalAttempts += entry.attempts;
  }

  return {
    totalEntries: lockoutStore.size,
    totalLocked,
    totalAttempts,
  };
}

// Cleanup expired entries every 5 minutes
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  const entries = Array.from(lockoutStore.entries());
  
  for (const [key, entry] of entries) {
    // Remove if lockout expired and no recent attempts
    if (
      (!entry.lockedUntil || now >= entry.lockedUntil) &&
      now - entry.lastAttempt > ATTEMPT_WINDOW
    ) {
      lockoutStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Stop the lockout cleanup interval (call during graceful shutdown)
 */
export function stopLockoutCleanup(): void {
  clearInterval(cleanupInterval);
}
