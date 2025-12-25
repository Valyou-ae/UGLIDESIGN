# CDN Setup Guide for UGLI.design

This guide explains how to configure Cloudflare CDN for optimal performance with 1000+ concurrent users.

## Why CDN is Critical

- **Reduced Server Load**: Static assets served from edge locations
- **Faster Load Times**: Content delivered from nearest geographic location
- **DDoS Protection**: Built-in protection against attacks
- **SSL/TLS**: Free SSL certificates with automatic renewal
- **Bandwidth Savings**: Reduces origin server bandwidth usage

## Cloudflare Setup Steps

### 1. Add Domain to Cloudflare

1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your domain (e.g., `ugli.design`)
3. Update nameservers at your domain registrar to Cloudflare's nameservers
4. Wait for DNS propagation (usually 24-48 hours)

### 2. Configure DNS Records

Add these DNS records in Cloudflare dashboard:

```
Type    Name    Content                 Proxy Status
A       @       <your-server-ip>       Proxied (orange cloud)
A       www     <your-server-ip>       Proxied (orange cloud)
CNAME   api     <your-domain>          Proxied (orange cloud)
```

### 3. Enable Performance Features

In Cloudflare dashboard:

**Speed → Optimization**
- ✅ Auto Minify: JavaScript, CSS, HTML
- ✅ Brotli compression
- ✅ Early Hints
- ✅ HTTP/2 to Origin
- ✅ HTTP/3 (with QUIC)

**Caching → Configuration**
- Browser Cache TTL: 4 hours
- Caching Level: Standard
- Always Online: ON

**SSL/TLS**
- Encryption mode: Full (strict)
- Always Use HTTPS: ON
- Automatic HTTPS Rewrites: ON
- Minimum TLS Version: 1.2

### 4. Create Page Rules

Add these page rules (in order):

**Rule 1: Cache Static Assets**
```
URL: *ugli.design/*.{jpg,jpeg,png,gif,webp,svg,css,js,woff,woff2,ttf}
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 1 month
  - Browser Cache TTL: 1 week
```

**Rule 2: Cache API Responses (selective)**
```
URL: *ugli.design/api/gallery*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 5 minutes
  - Browser Cache TTL: 1 minute
```

**Rule 3: Bypass Cache for Dynamic Content**
```
URL: *ugli.design/api/*
Settings:
  - Cache Level: Bypass
```

### 5. Configure Workers (Optional - Advanced)

For more control, use Cloudflare Workers:

```javascript
// worker.js - Image optimization and caching
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Cache images for 1 hour
  if (url.pathname.startsWith('/api/images/')) {
    const cache = caches.default
    let response = await cache.match(request)
    
    if (!response) {
      response = await fetch(request)
      response = new Response(response.body, response)
      response.headers.set('Cache-Control', 'public, max-age=3600')
      event.waitUntil(cache.put(request, response.clone()))
    }
    
    return response
  }
  
  return fetch(request)
}
```

### 6. Configure Cache Headers in Backend

Update server responses to work with CDN:

```typescript
// For static assets
res.set('Cache-Control', 'public, max-age=31536000, immutable');

// For API responses (cacheable)
res.set('Cache-Control', 'public, max-age=300, s-maxage=300');

// For API responses (not cacheable)
res.set('Cache-Control', 'private, no-cache, no-store, must-revalidate');

// For images
res.set('Cache-Control', 'public, max-age=3600');
res.set('CDN-Cache-Control', 'public, max-age=86400');
```

### 7. Purge Cache When Needed

Use Cloudflare API to purge cache:

```bash
curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/purge_cache" \
  -H "Authorization: Bearer {api_token}" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://ugli.design/api/images/123"]}'
```

## Performance Monitoring

After CDN setup, monitor these metrics:

1. **Cache Hit Ratio**: Should be >80% for static assets
2. **Bandwidth Savings**: Should see 60-80% reduction in origin bandwidth
3. **Response Time**: Should see 30-50% improvement in TTFB
4. **Origin Requests**: Should see 70-90% reduction

## Troubleshooting

### Images not loading
- Check if Cloudflare is caching too aggressively
- Verify Cache-Control headers are correct
- Check Page Rules order (more specific rules first)

### Stale content after updates
- Purge cache via Cloudflare dashboard
- Use versioned URLs for assets (e.g., `style.css?v=1.2.3`)
- Set appropriate cache TTLs

### API responses cached incorrectly
- Verify Cache-Control headers include `private` for user-specific data
- Use `Vary: Cookie` header for authenticated endpoints
- Add cache bypass rules for dynamic endpoints

## Cost Estimate

**Cloudflare Free Plan** (sufficient for launch):
- Unlimited bandwidth
- Basic DDoS protection
- Shared SSL certificate
- 3 Page Rules

**Cloudflare Pro Plan** ($20/month):
- Advanced DDoS protection
- 20 Page Rules
- Image optimization
- Mobile optimization
- Priority support

## Next Steps

1. Set up Cloudflare account
2. Configure DNS and wait for propagation
3. Enable performance features
4. Create page rules
5. Test cache hit ratios
6. Monitor performance metrics
7. Optimize based on analytics

## Additional Resources

- [Cloudflare Documentation](https://developers.cloudflare.com/)
- [Cache Best Practices](https://developers.cloudflare.com/cache/best-practices/)
- [Page Rules Guide](https://support.cloudflare.com/hc/en-us/articles/218411427)
