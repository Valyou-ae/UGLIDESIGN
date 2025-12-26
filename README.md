# UGLI Design - AI-Powered Image Generation Platform

> Professional AI image generation and mockup creation platform built with modern web technologies.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [Development](#development)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

UGLI Design is a full-stack web application that enables users to generate AI-powered images, create professional mockups, and manage their creative assets. The platform integrates with Google Gemini for image generation and Replicate for background removal, providing a seamless creative workflow.

**Key Capabilities:**
- 🎨 AI-powered image generation with style presets
- 👕 Mockup generation for apparel and products
- 🖼️ Background removal and image editing
- 📁 Organized asset management with folders
- 💳 Stripe-powered subscription and payment system
- 🔐 Secure authentication with Google OAuth
- 🌐 Public gallery and social features

---

## ✨ Features

### Core Features
- **AI Image Generation**: Generate high-quality images using Google Gemini with customizable prompts and style presets
- **Mockup Creator**: Create professional product mockups for t-shirts, hoodies, and other apparel
- **Background Removal**: Remove backgrounds from images using Replicate's AI models
- **Image Editor**: Edit and refine generated images with AI-powered tools
- **Asset Management**: Organize images in folders with favorites and tagging

### User Features
- **Authentication**: Google OAuth and Replit Auth integration
- **Credit System**: Credit-based usage with subscription tiers
- **Billing**: Stripe integration for payments and subscriptions
- **Profile Management**: Customizable user profiles with social links
- **Gallery**: Public and private image galleries

### Advanced Features
- **Affiliate Program**: Referral system with commission tracking
- **Admin Dashboard**: User management and analytics
- **CRM Integration**: Contact and deal management
- **Moodboards**: Create collections of inspiration images
- **Social Features**: Follow users, like images, discover content

For detailed feature documentation, see [docs/FEATURES.md](docs/FEATURES.md).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19.2 with TypeScript
- **Styling**: TailwindCSS 4.1 with custom components
- **UI Components**: Radix UI primitives
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter (lightweight router)
- **Animations**: Framer Motion
- **Build Tool**: Vite 7.1

### Backend
- **Runtime**: Node.js 22.x
- **Framework**: Express 4.21
- **Language**: TypeScript 5.6
- **Database**: PostgreSQL (Neon serverless)
- **ORM**: Drizzle ORM 0.39
- **Authentication**: Passport.js with OAuth
- **Session Management**: express-session with PostgreSQL store

### AI & Services
- **Image Generation**: Google Gemini API
- **Background Removal**: Replicate API
- **Payments**: Stripe
- **Error Tracking**: Sentry
- **Logging**: Winston (structured logging)

### DevOps
- **Containerization**: Docker
- **Deployment**: Fly.io, Replit
- **Database Hosting**: Neon (PostgreSQL)
- **CDN**: Cloudflare (recommended)

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v22.x or higher ([Download](https://nodejs.org/))
- **npm**: v10.x or higher (comes with Node.js)
- **PostgreSQL**: v14+ or Neon account ([Neon.tech](https://neon.tech))
- **Git**: For version control

### Required API Keys

You'll need accounts and API keys for:

1. **Google Gemini**: [Get API Key](https://makersuite.google.com/app/apikey)
2. **Replicate**: [Get API Token](https://replicate.com/account/api-tokens)
3. **Stripe**: [Get API Keys](https://dashboard.stripe.com/apikeys)
4. **Google OAuth**: [Google Cloud Console](https://console.cloud.google.com/)
5. **Neon Database**: [Create Database](https://neon.tech)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Valyou-ae/UGLIDESIGN.git
cd UGLIDESIGN
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env
```

Edit `.env` with your API keys and configuration (see [Environment Configuration](#environment-configuration) below).

### 4. Set Up Database

Run database migrations:

```bash
npm run db:push
```

### 5. Start Development Server

```bash
# Start backend and frontend concurrently
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:5000/api

---

## ⚙️ Environment Configuration

### Required Variables

```env
# Database (Required)
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require

# Session Secret (Required in production)
SESSION_SECRET=your-secure-session-secret-min-32-chars

# AI Services (Required for core features)
GEMINI_API_KEY=your-gemini-api-key
REPLICATE_API_TOKEN=your-replicate-api-token

# Authentication (Required for login)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Payments (Required for billing)
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=pk_live_your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret
```

### Optional Variables

```env
# Monitoring
SENTRY_DSN=https://your-key@sentry.io/project-id
LOG_LEVEL=info
LOG_FORMAT=json

# CORS
ALLOWED_ORIGINS=https://your-domain.com,https://app.your-domain.com

# Development
PORT=5000
NODE_ENV=development
```

For a complete list of environment variables with descriptions, see [.env.example](.env.example).

---

## 💻 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server (backend + frontend)
npm run dev:client       # Start frontend only (Vite dev server)

# Build
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push          # Push schema changes to database

# Type Checking
npm run check            # Run TypeScript type checking
```

### Development Workflow

1. **Backend Development**: Edit files in `server/` directory
2. **Frontend Development**: Edit files in `client/src/` directory
3. **Shared Types**: Edit files in `shared/` directory
4. **Database Schema**: Edit `shared/schema.ts` and run `npm run db:push`

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Follow existing code style
- **Imports**: Use path aliases (`@/` for client, `@shared/` for shared)
- **Logging**: Use `logger` utility, never `console.log`

---

## 🚢 Deployment

### Docker Deployment

Build and run with Docker:

```bash
# Build image
docker build -t uglidesign .

# Run container
docker run -p 3000:3000 --env-file .env uglidesign
```

### Fly.io Deployment

The project includes `fly.toml` configuration:

```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Deploy
fly deploy
```

### Replit Deployment

The project is Replit-ready with `.replit` configuration. Simply import the repository into Replit and configure secrets.

### Environment Setup

1. Set all required environment variables in your hosting platform
2. Configure database connection (Neon recommended for serverless)
3. Set up Stripe webhooks pointing to `/api/stripe/webhook/:uuid`
4. Configure CORS with `ALLOWED_ORIGINS`
5. Enable Sentry for error monitoring (optional but recommended)

---

## 📁 Project Structure

```
UGLIDESIGN/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and helpers
│   │   ├── pages/         # Page components
│   │   └── App.tsx        # Root component
│   └── index.html         # HTML entry point
│
├── server/                # Backend Express application
│   ├── config/           # Configuration files
│   ├── routes/           # API route handlers
│   ├── services/         # Business logic services
│   ├── utils/            # Server utilities
│   ├── db.ts             # Database connection
│   ├── index.ts          # Server entry point
│   └── logger.ts         # Logging configuration
│
├── shared/               # Shared types and schemas
│   ├── schema.ts         # Database schema (Drizzle)
│   └── mockupTypes.ts    # Shared type definitions
│
├── db/                   # Database migrations
│   └── migrations/       # SQL migration files
│
├── docs/                 # Documentation
│   ├── FEATURES.md       # Feature documentation
│   ├── SRS.md            # Software requirements
│   ├── PRD.md            # Product requirements
│   └── CDN_SETUP.md      # CDN configuration guide
│
├── scripts/              # Utility scripts
├── Dockerfile            # Docker configuration
├── fly.toml              # Fly.io configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── vite.config.ts        # Vite configuration
└── .env.example          # Environment variable template
```

---

## 📚 Documentation

### Available Documentation

- **[FEATURES.md](docs/FEATURES.md)**: Comprehensive feature documentation
- **[SRS.md](docs/SRS.md)**: Software Requirements Specification
- **[PRD.md](docs/PRD.md)**: Product Requirements Document
- **[CDN_SETUP.md](docs/CDN_SETUP.md)**: CDN configuration guide
- **[TECHNICAL_DEBT.md](TECHNICAL_DEBT.md)**: Known technical debt and improvements
- **[SECURITY_ANALYSIS.md](SECURITY_ANALYSIS.md)**: Security review and fixes
- **[TESTING_CHECKLIST.md](TESTING_CHECKLIST.md)**: Manual testing procedures

### API Documentation

API routes are organized in `server/routes/`:

- **Authentication**: `/api/auth/*` - Login, logout, session management
- **Images**: `/api/images/*` - Image CRUD operations
- **Generation**: `/api/generate/*` - AI image generation
- **Mockups**: `/api/mockup/*` - Mockup generation
- **Billing**: `/api/stripe/*` - Payment and subscription management
- **Admin**: `/api/admin/*` - Administrative functions

For detailed API patterns, see [server/API_AUTH_PATTERNS.md](server/API_AUTH_PATTERNS.md).

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run type checking: `npm run check`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Contribution Guidelines

- **Code Quality**: Follow existing code style and TypeScript best practices
- **Testing**: Add tests for new features (testing infrastructure in progress)
- **Documentation**: Update relevant documentation
- **Commits**: Use clear, descriptive commit messages
- **PR Description**: Explain what changes you made and why

### Areas for Contribution

- 🧪 **Testing**: Help build test infrastructure (high priority)
- 📝 **Documentation**: Improve or translate documentation
- 🐛 **Bug Fixes**: Fix issues from the issue tracker
- ✨ **Features**: Implement new features from the roadmap
- 🎨 **UI/UX**: Improve user interface and experience
- ⚡ **Performance**: Optimize code and database queries

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Google Gemini**: AI image generation capabilities
- **Replicate**: Background removal AI models
- **Stripe**: Payment processing infrastructure
- **Neon**: Serverless PostgreSQL hosting
- **Radix UI**: Accessible UI component primitives
- **TailwindCSS**: Utility-first CSS framework

---

## 📞 Support

For support, please:

1. Check the [documentation](docs/)
2. Search [existing issues](https://github.com/Valyou-ae/UGLIDESIGN/issues)
3. Create a new issue if needed

---

## 🗺️ Roadmap

### Completed ✅
- AI image generation with Gemini
- Mockup generation system
- Background removal
- User authentication and profiles
- Credit system and billing
- Admin dashboard

### In Progress 🚧
- Automated testing infrastructure
- CI/CD pipeline
- CSRF protection
- Object storage migration (R2/S3)

### Planned 📋
- API documentation (OpenAPI/Swagger)
- Performance monitoring (APM)
- CDN integration
- Mobile app (React Native)
- Advanced image editing features
- Collaborative workspaces

For detailed technical debt and improvements, see [TECHNICAL_DEBT.md](TECHNICAL_DEBT.md).

---

<div align="center">

**Made with ❤️ by the UGLI Design Team**

[Website](https://uglidesign.com) • [Documentation](docs/) • [Report Bug](https://github.com/Valyou-ae/UGLIDESIGN/issues) • [Request Feature](https://github.com/Valyou-ae/UGLIDESIGN/issues)

</div>
