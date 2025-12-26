import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedRequest } from "../types";
import { storage } from "../storage";
import { logger } from "../logger";

export function createMiddleware() {
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    // Check if user is authenticated via Passport session (Google OAuth or Replit)
    const authReq = req as AuthenticatedRequest;
    if (!authReq.user?.claims?.sub) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    next();
  };

  const getUserId = (req: AuthenticatedRequest): string => {
    // Get user ID from Passport session (works for both Google OAuth and Replit)
    return req.user?.claims?.sub || '';
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
