# CSRF Protection Implementation

## Overview

Cross-Site Request Forgery (CSRF) protection has been implemented to prevent unauthorized state-changing requests from malicious websites.

## Implementation Details

### Backend (Server)

**Package**: `csurf` v1.11.0

**Configuration** (`server/index.ts`):
- Session-based tokens (no cookies)
- Protects POST, PUT, PATCH, DELETE methods
- GET, HEAD, OPTIONS are exempt (read-only operations)

**Exempted Routes**:
- `/api/stripe/webhook/*` - External Stripe webhooks
- `/api/auth/google/callback` - OAuth callback
- `/api/auth/replit/callback` - OAuth callback

**Token Endpoint**:
```
GET /api/csrf-token
Response: { "csrfToken": "..." }
```

### Frontend (Client)

**Files**:
- `client/src/lib/csrf.ts` - Token management and caching
- `client/src/lib/fetch-with-csrf.ts` - Fetch wrapper with automatic CSRF injection
- `client/src/lib/api.ts` - Updated to use CSRF tokens

**Usage**:

1. **Automatic (Recommended)** - Use `fetchApi` from `api.ts`:
   ```typescript
   import { authApi } from '@/lib/api';
   
   // CSRF token automatically included
   await authApi.logout();
   ```

2. **Manual** - Use `fetchWithCsrf` for direct fetch calls:
   ```typescript
   import { fetchWithCsrf } from '@/lib/fetch-with-csrf';
   
   const response = await fetchWithCsrf('/api/images', {
     method: 'POST',
     body: JSON.stringify(data),
   });
   ```

3. **Low-level** - Use `withCsrfToken` helper:
   ```typescript
   import { withCsrfToken } from '@/lib/csrf';
   
   const options = await withCsrfToken({
     method: 'POST',
     body: JSON.stringify(data),
   });
   
   const response = await fetch('/api/images', options);
   ```

### Token Management

**Caching**:
- CSRF tokens are cached in memory for the session
- Tokens are automatically fetched on first state-changing request
- Cache is cleared on logout

**Token Lifecycle**:
1. First POST/PUT/PATCH/DELETE request triggers token fetch
2. Token is cached in memory
3. Token is included in all subsequent state-changing requests
4. Token is cleared on logout

### Security Considerations

**Strengths**:
- ✅ Session-based tokens (no cookie vulnerabilities)
- ✅ Automatic token rotation per session
- ✅ Protects all state-changing endpoints
- ✅ Exempts read-only operations (no performance impact)
- ✅ Exempts external webhooks (Stripe, etc.)

**Limitations**:
- ⚠️ Requires session management (already implemented)
- ⚠️ Tokens are stored in memory (cleared on page reload)
- ⚠️ First request after page load requires token fetch

### Testing

**Manual Testing**:

1. **Verify token generation**:
   ```bash
   curl -c cookies.txt http://localhost:5000/api/csrf-token
   ```

2. **Test protected endpoint without token** (should fail):
   ```bash
   curl -b cookies.txt -X POST http://localhost:5000/api/images \
     -H "Content-Type: application/json" \
     -d '{"prompt": "test"}'
   ```

3. **Test protected endpoint with token** (should succeed):
   ```bash
   TOKEN=$(curl -b cookies.txt http://localhost:5000/api/csrf-token | jq -r .csrfToken)
   curl -b cookies.txt -X POST http://localhost:5000/api/images \
     -H "Content-Type: application/json" \
     -H "X-CSRF-Token: $TOKEN" \
     -d '{"prompt": "test"}'
   ```

**Automated Testing** (TODO):
- Unit tests for CSRF middleware
- Integration tests for protected endpoints
- E2E tests for user flows

### Error Handling

**CSRF Token Errors**:

- **403 Forbidden**: Invalid or missing CSRF token
- **Error Response**: `{ "message": "invalid csrf token" }`

**Client-side handling**:
```typescript
try {
  await fetchWithCsrf('/api/images', { method: 'POST', ... });
} catch (error) {
  if (error.message.includes('csrf')) {
    // Clear token cache and retry
    clearCsrfToken();
    await fetchWithCsrf('/api/images', { method: 'POST', ... });
  }
}
```

### Migration Notes

**Breaking Changes**:
- All POST/PUT/PATCH/DELETE requests now require CSRF tokens
- Frontend must fetch token before making state-changing requests

**Backward Compatibility**:
- GET/HEAD/OPTIONS requests unchanged
- Webhook endpoints unchanged
- OAuth callbacks unchanged

### Future Improvements

1. **Token Refresh**: Implement automatic token refresh on expiration
2. **Error Recovery**: Automatic retry with new token on CSRF errors
3. **Monitoring**: Track CSRF token failures in Sentry
4. **Testing**: Add automated CSRF protection tests
5. **Documentation**: Add OpenAPI/Swagger annotations for CSRF requirements

### References

- [OWASP CSRF Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)
- [csurf npm package](https://www.npmjs.com/package/csurf)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**Implementation Date**: December 26, 2024  
**Status**: ✅ Complete  
**Tested**: Manual testing required before production deployment
