import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import { runMigrations } from 'stripe-replit-sync';
import { getStripeSync } from './stripeClient';
import { WebhookHandlers } from './webhookHandlers';
import helmet from 'helmet';
import cors from 'cors';
import { logger } from './logger';

const app = express();
const httpServer = createServer(app);

// Create child loggers for different components
const stripeLogger = logger.child({ source: 'stripe' });
const httpLogger = logger.child({ source: 'http' });

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Legacy log function for backward compatibility (will be removed)
export function log(message: string, source = "express") {
  logger.info(message, { source });
}

async function initStripe() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    stripeLogger.warn('DATABASE_URL not found, skipping Stripe init');
    return;
  }

  try {
    stripeLogger.info('Initializing Stripe schema...');
    await runMigrations({ 
      databaseUrl
    });
    stripeLogger.info('Stripe schema ready');

    const stripeSync = await getStripeSync();

    stripeLogger.info('Setting up managed webhook...');
    const webhookBaseUrl = `https://${process.env.REPLIT_DOMAINS?.split(',')[0]}`;
    const { webhook, uuid } = await stripeSync.findOrCreateManagedWebhook(
      `${webhookBaseUrl}/api/stripe/webhook`,
      {
        enabled_events: ['*'],
        description: 'Managed webhook for Stripe sync',
      }
    );
    stripeLogger.info(`Webhook configured: ${webhook.url}`, { uuid });

    stripeLogger.info('Syncing Stripe data in background...');
    stripeSync.syncBackfill()
      .then(() => {
        stripeLogger.info('Stripe data synced');
      })
      .catch((err: Error) => {
        stripeLogger.error('Error syncing Stripe data', err);
      });
  } catch (error: any) {
    stripeLogger.error('Failed to initialize Stripe', error);
  }
}

(async () => {
  await initStripe();

  // CORS Configuration
  const allowedOrigins = [
    // Replit domains
    ...(process.env.REPLIT_DOMAINS?.split(',').map(d => `https://${d}`) || []),
    // Development
    'http://localhost:5000',
    'http://localhost:3000',
    // Google OAuth
    'https://accounts.google.com',
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) {
        return callback(null, true);
      }
      
      // Check if origin is in allowed list
      if (allowedOrigins.some(allowed => origin.startsWith(allowed) || allowed === origin)) {
        return callback(null, true);
      }
      
      // In development, allow all origins
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      logger.warn('CORS blocked request', { origin, source: 'cors' });
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true, // Allow cookies for session authentication
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset', 'Retry-After'],
    maxAge: 86400, // Cache preflight for 24 hours
  }));

  // Stripe webhook must be before body parsers
  app.post(
    '/api/stripe/webhook/:uuid',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
      const signature = req.headers['stripe-signature'];

      if (!signature) {
        return res.status(400).json({ error: 'Missing stripe-signature' });
      }

      try {
        const sig = Array.isArray(signature) ? signature[0] : signature;

        if (!Buffer.isBuffer(req.body)) {
          stripeLogger.error('Webhook error: req.body is not a Buffer');
          return res.status(500).json({ error: 'Webhook processing error' });
        }

        const { uuid } = req.params;
        await WebhookHandlers.processWebhook(req.body as Buffer, sig, uuid);

        res.status(200).json({ received: true });
      } catch (error: any) {
        stripeLogger.error('Webhook processing error', error);
        res.status(400).json({ error: 'Webhook processing error' });
      }
    }
  );

  // Security headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://accounts.google.com", "https://apis.google.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:", "https:"],
        connectSrc: ["'self'", "https://accounts.google.com", "https://www.googleapis.com", "https://api.stripe.com"],
        frameSrc: ["'self'", "https://accounts.google.com", "https://js.stripe.com"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false, // Required for Google Sign-In
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }, // Required for Google Sign-In popup
  }));

  app.use(
    express.json({
      limit: '15mb', // Supports base64 images while preventing DoS
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false, limit: '15mb' }));

  // Disable ETags for API routes to prevent 304 responses with empty bodies
  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
    app.set('etag', false);
    next();
  });

  // HTTP Request logging middleware
  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        // Use the structured logger for HTTP requests
        logger.http(req.method, path, res.statusCode, duration);
      }
    });

    next();
  });

  await registerRoutes(httpServer, app);

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    
    // Log full error for debugging
    logger.error('Unhandled error', err, { source: 'express' });

    // Only send generic message to client in production
    const message = process.env.NODE_ENV === 'production' 
      ? "Internal Server Error" 
      : err.message || "Internal Server Error";

    if (!res.headersSent) {
      res.status(status).json({ message });
    }
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      logger.info(`Server listening on port ${port}`, { source: 'express' });
    },
  );
})();
