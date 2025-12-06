# Overview

Ugli is an AI-powered creative studio platform that enables users to generate images, create product mockups, and remove backgrounds from images. The application follows a modern SaaS architecture with a full-stack TypeScript implementation, featuring a React frontend with shadcn/ui components and an Express backend with PostgreSQL database storage.

The platform includes user authentication, affiliate program management, credit-based usage tracking, and multiple creative tools organized in a dashboard-style interface. The design emphasizes a clean, minimal aesthetic with dark/light theme support and responsive layouts.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

**Framework & Build System**
- React 18+ with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and caching

**UI Component System**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS v4 with CSS variables for theming
- Custom design tokens for colors, spacing, and typography
- Framer Motion for animations and transitions
- Inter font family as the primary typeface

**State Management Pattern**
- Server state managed via TanStack Query with custom hooks
- Local UI state with React useState/useReducer
- Session-based authentication state synchronized with backend
- Custom hooks pattern (use-auth, use-images, use-affiliate, use-settings) for feature-specific logic

**Design System Decisions**
- Two-panel layout: Fixed sidebar (280px) + scrollable main content
- Bento grid layout pattern for dashboard cards
- Consistent color system with semantic tokens (primary, secondary, muted, accent, destructive)
- Dark/light theme support via CSS custom properties
- Mobile-responsive with breakpoint at 768px

## Backend Architecture

**Server Framework**
- Express.js with TypeScript
- HTTP server with middleware-based request handling
- Custom logging middleware for request/response tracking
- Session-based authentication (no JWT tokens)

**Database Layer**
- PostgreSQL as primary database
- Drizzle ORM for type-safe database queries
- Schema-first approach with migrations in `/migrations`
- Connection pooling via node-postgres (pg)

**Session Management**
- express-session with connect-pg-simple for PostgreSQL session store
- 30-day session expiration
- HttpOnly cookies with SameSite=lax for CSRF protection
- Test mode bypass for development (TEST_MODE environment variable)

**Authentication Strategy**
- Username/email + password authentication
- bcrypt for password hashing (cost factor 10)
- Session-based, not token-based
- Middleware-based route protection (requireAuth)
- Referral tracking via affiliate codes

**Data Models**
- Users: Authentication, profile, affiliate code
- Generated Images: User creations with favorites, prompt history
- Affiliate Commissions: Referral tracking and earnings
- Withdrawal Requests: Payout management for affiliates

**Storage Pattern**
- Repository pattern via IStorage interface
- DatabaseStorage implementation for PostgreSQL operations
- Separation of concerns: routes.ts handles HTTP, storage.ts handles data access

## External Dependencies

**Database**
- PostgreSQL (via @neondatabase/serverless connector)
- Drizzle ORM for schema management and queries
- connect-pg-simple for session persistence

**UI Libraries**
- Radix UI for accessible component primitives (30+ components)
- Tailwind CSS v4 with @tailwindcss/vite plugin
- Lucide React for icon system
- Framer Motion for animations

**Development Tools**
- Vite for frontend build and HMR
- esbuild for server bundling in production
- TypeScript with strict mode enabled
- Replit-specific plugins (cartographer, dev-banner, runtime-error-modal)

**Build & Deployment**
- Custom build script (`script/build.ts`) that:
  - Bundles server with esbuild (allowlist for critical deps)
  - Builds client with Vite
  - Outputs to `/dist` directory
- Static file serving in production mode
- Environment-based configuration (NODE_ENV)

**Asset Management**
- Static assets served from `client/public`
- Attached assets in `/attached_assets` for design specifications
- Custom Vite plugin for OpenGraph meta tag updates (vite-plugin-meta-images.ts)

**Third-Party Services (Planned/Mocked)**
- Google Gemini API for AI image generation (referenced in design specs)
- Stripe for payment processing (imports present in dependencies)
- Email service via nodemailer (listed in dependencies)

**Notable Architectural Decisions**
- Monorepo structure with shared schema (`/shared/schema.ts`)
- Path aliases for clean imports (@/, @shared/, @assets/)
- Separation of client and server code with shared types
- Production builds use single CJS bundle for server (reduced cold start)
- Session store in database (not in-memory) for horizontal scaling