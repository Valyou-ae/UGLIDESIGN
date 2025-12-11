# Phase 3 Infrastructure Fixes - Deployment Instructions

## Overview
These changes add proper CORS configuration and structured logging throughout the application.

## Changes Made

### 1. NEW: `server/logger.ts`
A new structured logging module with:
- Log levels: debug, info, warn, error
- Automatic timestamp formatting
- Sensitive data sanitization (passwords, tokens, keys)
- JSON format option for log aggregation (`LOG_FORMAT=json`)
- Child loggers for component isolation
- HTTP request logging helper

### 2. `server/index.ts`
- Added CORS configuration with proper origins
- Replaced custom `log()` function with structured logger
- HTTP request logging now uses `logger.http()`
- All stripe logs use child logger `stripeLogger`

### 3. `server/routes.ts`
- Replaced 76+ `console.log`/`console.error` calls with structured logger
- All errors now logged with proper context and source tags
- Debug logs only show in development (`LOG_LEVEL=debug`)

### 4. `server/googleAuth.ts`
- Replaced 10 `console.error` calls with structured logger
- Uses dedicated `authLogger` child logger

---

## Deployment Steps

### Step 1: Install New Dependency
```bash
npm install cors --save
npm install @types/cors --save-dev
```

### Step 2: Add New File
Create `server/logger.ts` using `server_logger.ts`

### Step 3: Replace Files
- `server/index.ts` → Use `server_index_phase3.ts`
- `server/routes.ts` → Use `server_routes_phase3.ts`
- `server/googleAuth.ts` → Use `server_googleAuth.ts`

### Step 4: Optional Environment Variables
```bash
# Set log level (debug, info, warn, error)
# Default: "info" in production, "debug" in development
LOG_LEVEL=info

# Output JSON format for log aggregation tools
# Default: human-readable
LOG_FORMAT=json
```

### Step 5: Restart the App
```bash
npm run dev
```

---

## CORS Configuration

The app now properly handles Cross-Origin Resource Sharing:

**Allowed Origins:**
- All Replit domains (from `REPLIT_DOMAINS` env)
- `http://localhost:5000` (development)
- `http://localhost:3000` (development)
- `https://accounts.google.com` (Google OAuth)

**Settings:**
- `credentials: true` - Allows session cookies
- `methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']`
- Exposes rate limit headers to client
- 24-hour preflight cache

---

## Logger Usage Examples

```typescript
import { logger } from './logger';

// Basic logging
logger.info('User logged in', { userId: '123' });
logger.warn('Rate limit approaching', { remaining: 5 });
logger.error('Database connection failed', error);

// Child logger with preset context
const authLogger = logger.child({ source: 'auth' });
authLogger.info('Login successful'); // Automatically includes source: 'auth'

// HTTP request logging
logger.http('POST', '/api/generate', 200, 1234);
```

---

## Log Output Examples

**Development (human-readable):**
```
2:45:32 PM [INFO ] [auth] User logged in {"userId":"123"}
2:45:33 PM [ERROR] [api] Database query failed {"source":"api"}
```

**Production with JSON format (`LOG_FORMAT=json`):**
```json
{"timestamp":"2024-01-15T14:45:32.000Z","level":"info","message":"User logged in","source":"auth","userId":"123"}
```

---

## Sensitive Data Protection

The logger automatically redacts:
- Passwords
- Tokens
- API keys
- Secrets
- Authorization headers
- Credentials

Example:
```typescript
logger.info('Auth attempt', { password: 'secret123' });
// Output: {"password":"[REDACTED]"}
```

---

## Testing Checklist

After deployment, verify:

- [ ] App starts without errors
- [ ] Logs appear in console with timestamps
- [ ] No raw `console.log` statements in output
- [ ] CORS works for frontend requests
- [ ] Google Sign-In still works (CORS configured)
- [ ] Rate limit headers visible in responses

### Test CORS
```bash
# Should succeed (same origin)
curl -I https://your-app.replit.app/api/user

# Check CORS headers
curl -I -X OPTIONS https://your-app.replit.app/api/user \
  -H "Origin: https://your-app.replit.app" \
  -H "Access-Control-Request-Method: POST"
```

### Test Logging
```bash
# Set debug level to see all logs
LOG_LEVEL=debug npm run dev

# Test JSON format
LOG_FORMAT=json npm run dev
```

---

## Files Included

1. `server_logger.ts` → NEW file: `server/logger.ts`
2. `server_index_phase3.ts` → Replace `server/index.ts`
3. `server_routes_phase3.ts` → Replace `server/routes.ts`
4. `server_googleAuth.ts` → Replace `server/googleAuth.ts`
5. `PHASE3_DEPLOYMENT_INSTRUCTIONS.md` (this file)

---

## Combined Deployment (Phase 1 + 2 + 3)

If deploying all phases together:

```bash
# Install all dependencies
npm install helmet cors --save
npm install @types/cors --save-dev

# Files to replace/add:
# - server/logger.ts (NEW)
# - server/index.ts (from Phase 3)
# - server/routes.ts (from Phase 3)
# - server/googleAuth.ts (from Phase 3)
# - shared/schema.ts (from Phase 2)

npm run dev
```

---

## Rollback

If issues occur:
1. Restore original files
2. Remove `server/logger.ts`
3. Run `npm uninstall cors`
