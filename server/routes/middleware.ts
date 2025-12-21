import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types";
import { isAuthenticated } from "../replitAuth";
import { storage } from "../storage";
import { logger } from "../logger";

export function createMiddleware() {
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    return isAuthenticated(req, res, next);
  };

  const getUserId = (req: AuthenticatedRequest): string => {
    // Support both Replit Auth (req.user.claims.sub) and local auth (req.session.passport.user.id)
    const replitUserId = req.user?.claims?.sub;
    const passportUserId = (req as any).session?.passport?.user?.id;
    return replitUserId || passportUserId || '';
  };

  const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
    requireAuth(req, res, async () => {
      try {
        const userId = getUserId(req as AuthenticatedRequest);
        const user = await storage.getUser(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== 'admin' && user.role !== 'super_admin') {
          return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        next();
      } catch (error) {
        logger.error("Admin auth error", error, { source: "middleware" });
        res.status(500).json({ message: "Authentication error" });
      }
    });
  };

  const requireSuperAdmin = async (req: Request, res: Response, next: NextFunction) => {
    requireAuth(req, res, async () => {
      try {
        const userId = getUserId(req as AuthenticatedRequest);
        const user = await storage.getUser(userId);

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (user.role !== 'super_admin') {
          return res.status(403).json({ message: "Access denied. Super Admin privileges required." });
        }

        next();
      } catch (error) {
        logger.error("Super Admin auth error", error, { source: "middleware" });
        res.status(500).json({ message: "Authentication error" });
      }
    });
  };

  return {
    requireAuth,
    getUserId,
    requireAdmin,
    requireSuperAdmin,
  };
}

export type Middleware = ReturnType<typeof createMiddleware>;
