import type { Request, Response, NextFunction } from 'express';

/**
 * Cache header middleware for CDN optimization
 * Sets appropriate Cache-Control headers based on content type
 */

/**
 * Cache static assets (images, CSS, JS, fonts) for 1 year
 * These assets should have versioned URLs or content hashes
 */
export function cacheStaticAssets(req: Request, res: Response, next: NextFunction): void {
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.set('CDN-Cache-Control', 'public, max-age=31536000');
  next();
}

/**
 * Cache public images for 1 hour (browser) and 1 day (CDN)
 * Allows for faster updates while still benefiting from CDN caching
 */
export function cachePublicImages(req: Request, res: Response, next: NextFunction): void {
  res.set('Cache-Control', 'public, max-age=3600');
  res.set('CDN-Cache-Control', 'public, max-age=86400');
  next();
}

/**
 * Cache public API responses for 5 minutes
 * Useful for gallery, leaderboard, and other public data
 */
export function cachePublicAPI(req: Request, res: Response, next: NextFunction): void {
  res.set('Cache-Control', 'public, max-age=300, s-maxage=300');
  res.set('CDN-Cache-Control', 'public, max-age=300');
  next();
}

/**
 * Do not cache private/dynamic content
 * For authenticated endpoints and user-specific data
 */
export function noCache(req: Request, res: Response, next: NextFunction): void {
  res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
}

/**
 * Cache with revalidation
 * For content that changes occasionally but needs freshness checks
 */
export function cacheWithRevalidation(maxAge: number) {
  return (req: Request, res: Response, next: NextFunction): void => {
    res.set('Cache-Control', `public, max-age=${maxAge}, must-revalidate`);
    res.set('CDN-Cache-Control', `public, max-age=${maxAge}`);
    next();
  };
}

/**
 * Vary header for authenticated content
 * Ensures CDN caches different versions for different users
 */
export function varyByCookie(req: Request, res: Response, next: NextFunction): void {
  res.set('Vary', 'Cookie');
  next();
}
