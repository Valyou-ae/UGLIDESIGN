# API Authentication Patterns

This document describes the authentication patterns used in the UGLI API.

## Authentication Middleware

### `requireAuth`
Standard user authentication. Requires a valid session.

```typescript
app.get("/api/user/profile", requireAuth, async (req, res) => {
  const userId = getUserId(req as AuthenticatedRequest);
  // ...
});
```

### `requireAdmin`
Admin-only access. Requires `role` to be `admin` or `super_admin`.

```typescript
app.get("/api/admin/users", requireAdmin, adminRateLimiter, async (req, res) => {
  // ...
});
```

### `requireSuperAdmin`
Super admin only. Requires `role` to be `super_admin`.

```typescript
app.get("/api/super-admin/overview", requireSuperAdmin, adminRateLimiter, async (req, res) => {
  // ...
});
```

## Rate Limiters

### `generationRateLimiter`
Limits image generation requests to prevent abuse.

### `authRateLimiter`
Limits authentication attempts to prevent brute force attacks.

### `adminRateLimiter`
Limits admin API requests.

### `guestGenerationLimiter`
Special limiter for guest (unauthenticated) image generation.

## Route Categories

### Public Routes (No Auth Required)
These routes are intentionally public:

| Route | Purpose |
|-------|---------|
| `GET /api/gallery` | Public image gallery |
| `GET /api/gallery/:id` | Public image details |
| `GET /api/gallery/:id/thumbnail` | Optimized thumbnails |
| `GET /api/leaderboard` | Public leaderboard |
| `GET /api/inspirations/*` | Daily inspirations |
| `GET /api/products/*` | Product catalog |
| `GET /api/images/public` | Public images feed |
| `GET /api/images/share/:id` | Shareable image links |
| `GET /api/stripe/config` | Stripe public key |
| `GET /api/auth/google-client-id` | OAuth config |
| `GET /api/style-transfer/presets` | Style preset catalog |

### Analytics Routes (Public, Rate Limited)
These track usage without requiring auth:

| Route | Purpose |
|-------|---------|
| `POST /api/gallery/:id/view` | Track image views |
| `POST /api/images/:id/remix` | Track remix usage |

### Authenticated Routes
All other routes require authentication via `requireAuth`.

### Admin Routes
Routes under `/api/admin/*` require `requireAdmin`.

### Super Admin Routes
Routes under `/api/super-admin/*` require `requireSuperAdmin`.

## Best Practices

1. **Default to `requireAuth`** for new routes
2. **Use rate limiters** on all generation endpoints
3. **Combine auth + rate limiting** for sensitive operations:
   ```typescript
   app.post("/api/generate", requireAuth, generationRateLimiter, async (req, res) => {
     // ...
   });
   ```
4. **Document public routes** - if a route is intentionally public, add a comment
5. **Validate ownership** - always check that users can only access their own resources

## Security Checklist for New Routes

- [ ] Does this route need authentication?
- [ ] Does this route need admin privileges?
- [ ] Should this route be rate limited?
- [ ] Does this route validate resource ownership?
- [ ] Are all user inputs validated?
