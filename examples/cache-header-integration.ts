/**
 * Example: How to integrate cache headers into Express routes
 * 
 * This file shows examples of how to use the cacheHeaders middleware
 * in different routes for optimal CDN performance.
 */

import type { Express } from 'express';
import { 
  cacheStaticAssets, 
  cachePublicImages, 
  cachePublicAPI, 
  noCache,
  cacheWithRevalidation,
  varyByCookie
} from '../server/cacheHeaders';

export function exampleCacheHeaderIntegration(app: Express) {
  
  // ============== STATIC ASSETS ==============
  // Cache CSS, JS, fonts for 1 year (use versioned URLs)
  app.get('/assets/*', cacheStaticAssets, (req, res) => {
    // Serve static file
    // Cache-Control: public, max-age=31536000, immutable
  });
  
  // ============== PUBLIC IMAGES ==============
  // Cache public images for 1 hour (browser) and 1 day (CDN)
  app.get('/api/images/:id', cachePublicImages, async (req, res) => {
    const imageId = parseInt(req.params.id);
    // Serve image
    // Cache-Control: public, max-age=3600
    // CDN-Cache-Control: public, max-age=86400
  });
  
  // ============== PUBLIC API ENDPOINTS ==============
  // Cache public gallery for 5 minutes
  app.get('/api/gallery', cachePublicAPI, async (req, res) => {
    // Return public images
    // Cache-Control: public, max-age=300, s-maxage=300
  });
  
  // Cache leaderboard for 1 minute
  app.get('/api/leaderboard', cacheWithRevalidation(60), async (req, res) => {
    // Return leaderboard data
    // Cache-Control: public, max-age=60, must-revalidate
  });
  
  // ============== PRIVATE/AUTHENTICATED ENDPOINTS ==============
  // Do not cache user-specific data
  app.get('/api/user/images', noCache, varyByCookie, async (req, res) => {
    // Return user's private images
    // Cache-Control: private, no-cache, no-store, must-revalidate
    // Vary: Cookie
  });
  
  // Do not cache credit balance
  app.get('/api/user/credits', noCache, varyByCookie, async (req, res) => {
    // Return user's credit balance
    // Cache-Control: private, no-cache, no-store, must-revalidate
  });
  
  // ============== DYNAMIC CONTENT ==============
  // Cache homepage for 5 minutes
  app.get('/', cacheWithRevalidation(300), (req, res) => {
    // Render homepage
    // Cache-Control: public, max-age=300, must-revalidate
  });
  
  // Do not cache authenticated pages
  app.get('/dashboard', noCache, varyByCookie, (req, res) => {
    // Render user dashboard
    // Cache-Control: private, no-cache, no-store, must-revalidate
  });
}

/**
 * CLOUDFLARE PAGE RULES CONFIGURATION
 * 
 * Create these Page Rules in Cloudflare dashboard (in order):
 * 
 * Rule 1: Cache Static Assets
 * URL: *ugli.design/assets/*
 * Settings:
 *   - Cache Level: Cache Everything
 *   - Edge Cache TTL: 1 month
 *   - Browser Cache TTL: 1 week
 * 
 * Rule 2: Cache Public Images
 * URL: *ugli.design/api/images/*
 * Settings:
 *   - Cache Level: Cache Everything
 *   - Edge Cache TTL: 1 day
 *   - Browser Cache TTL: 1 hour
 * 
 * Rule 3: Cache Public API
 * URL: *ugli.design/api/gallery*
 * Settings:
 *   - Cache Level: Cache Everything
 *   - Edge Cache TTL: 5 minutes
 *   - Browser Cache TTL: 5 minutes
 * 
 * Rule 4: Bypass Cache for User-Specific API
 * URL: *ugli.design/api/user/*
 * Settings:
 *   - Cache Level: Bypass
 * 
 * Rule 5: Bypass Cache for Generation API
 * URL: *ugli.design/api/generate*
 * Settings:
 *   - Cache Level: Bypass
 */
