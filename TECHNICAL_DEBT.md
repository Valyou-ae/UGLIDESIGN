# Technical Debt Register

This document tracks known technical debt in the UGLI application.

## Priority Levels
- **P1 (Critical)**: Security or data integrity issues - fix immediately
- **P2 (High)**: Performance or reliability issues - fix within sprint
- **P3 (Medium)**: Code quality issues - fix when touching related code
- **P4 (Low)**: Nice-to-have improvements - backlog

---

## Active Technical Debt

### TD-001: Duplicated Error Handling Pattern
**Priority:** P4 (Low)  
**Status:** Documented  
**Files Affected:** 6 route files (36 instances)

**Description:**
The pattern `res.status(500).json({ message: "Server error" })` is repeated across route handlers.

**Current State:**
```typescript
// Repeated in many places
catch (error) {
  logger.error("Some error", error, { source: "..." });
  res.status(500).json({ message: "Server error" });
}
```

**Recommended Fix:**
Create a centralized error handler:
```typescript
// utils/errorHandler.ts
export function handleRouteError(res: Response, error: unknown, context: string) {
  logger.error(`${context} error`, error, { source: context });
  res.status(500).json({ message: "Server error" });
}

// Usage
catch (error) {
  handleRouteError(res, error, "generation");
}
```

**Why Not Fixed Now:**
- Low risk (code works correctly)
- High effort (36+ locations)
- Could introduce regressions
- Better suited for dedicated refactoring sprint

---

### TD-002: Mixed Database Access Patterns
**Priority:** P4 (Low)  
**Status:** Documented (see DATABASE_PATTERNS.md)

**Description:**
Codebase uses both Drizzle ORM and direct pool queries.

**Current State:**
Both patterns are used based on query complexity.

**Recommendation:**
Keep as-is. Document patterns (done). New code should prefer Drizzle where possible.

---

### TD-003: Base64 Image Storage
**Priority:** P3 (Medium)  
**Status:** Documented

**Description:**
Images are stored as base64 strings in the database instead of object storage (S3/R2).

**Impact:**
- Larger database size
- Slower queries
- No CDN benefits
- Higher bandwidth costs

**Recommended Fix:**
Migrate to object storage:
1. Set up S3/Cloudflare R2 bucket
2. Create migration script to move existing images
3. Update image upload/retrieval to use object storage
4. Keep base64 fallback for backwards compatibility

**Estimated Effort:** 2-3 days

---

### TD-004: No Automated Test Coverage
**Priority:** P3 (Medium)  
**Status:** Documented

**Description:**
No unit tests or integration tests exist for the application.

**Recommended Fix:**
1. Set up Jest/Vitest for testing
2. Add unit tests for critical business logic
3. Add integration tests for API endpoints
4. Set up CI/CD to run tests on PR

**Estimated Effort:** 1-2 weeks for initial coverage

---

### TD-005: No CDN for Static Assets
**Priority:** P3 (Medium)  
**Status:** Documented

**Description:**
Static assets and images are served directly from the application server.

**Impact:**
- Slower load times for users far from server
- Higher server load
- No edge caching

**Recommended Fix:**
1. Set up Cloudflare or similar CDN
2. Configure asset caching headers
3. Use CDN URLs for image serving

**Estimated Effort:** 1 day

---

## Resolved Technical Debt

### TD-R001: Image Authorization Vulnerability
**Resolved:** 2024-12-25  
**Fix:** Added ownership validation with public image fallback

### TD-R002: Guest Generation Race Condition
**Resolved:** 2024-12-25  
**Fix:** Atomic INSERT with RETURNING pattern

### TD-R003: Missing Cascade Deletes
**Resolved:** 2024-12-25  
**Fix:** Added ON DELETE CASCADE/SET NULL to schema

### TD-R004: Missing Database Transactions
**Resolved:** 2024-12-25  
**Fix:** Added withTransaction helper and wrapped critical operations

### TD-R005: Style Transfer Auth Missing
**Resolved:** 2024-12-25  
**Fix:** Added requireAuth to style transfer routes

---

## Adding New Technical Debt

When adding new technical debt:
1. Assign a unique ID (TD-XXX)
2. Set appropriate priority
3. Document the issue clearly
4. Explain why it's not being fixed now
5. Provide a recommended fix
6. Estimate effort if possible
