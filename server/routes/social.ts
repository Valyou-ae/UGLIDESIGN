import type { Express, Request, Response } from "express";
import { z } from "zod";
import { storage } from "../storage";
import type { Middleware } from "./middleware";
import type { AuthenticatedRequest } from "../types";
import { parsePagination } from "./utils";

const followSchema = z.object({
  userId: z.string().uuid("Invalid user ID"),
});

export function registerSocialRoutes(app: Express, middleware: Middleware) {
  const { requireAuth, getUserId } = middleware;

  app.post("/api/social/follow", requireAuth, async (req: Request, res: Response) => {
    try {
      const followerId = getUserId(req as AuthenticatedRequest);
      const { userId: followingId } = followSchema.parse(req.body);

      if (followerId === followingId) {
        return res.status(400).json({ message: "Cannot follow yourself" });
      }

      const targetUser = await storage.getUser(followingId);
      if (!targetUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const follow = await storage.followUser(followerId, followingId);
      if (!follow) {
        return res.status(400).json({ message: "Could not follow user" });
      }

      res.json({ success: true, following: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Server error" });
    }
  });

  app.delete("/api/social/follow/:userId", requireAuth, async (req: Request, res: Response) => {
    try {
      const followerId = getUserId(req as AuthenticatedRequest);
      const followingId = req.params.userId;

      const result = followSchema.safeParse({ userId: followingId });
      if (!result.success) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      await storage.unfollowUser(followerId, followingId);
      res.json({ success: true, following: false });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/social/following/:userId", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const { limit, offset } = parsePagination(req.query, { limit: 50, maxLimit: 100 });

      const result = followSchema.safeParse({ userId });
      if (!result.success) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const { following, total } = await storage.getFollowing(userId, limit, offset);
      
      res.json({
        following: following.map(u => ({
          id: u.id,
          username: u.username,
          displayName: u.displayName,
          profileImageUrl: u.profileImageUrl,
          followedAt: u.followedAt
        })),
        total,
        limit,
        offset
      });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/social/followers/:userId", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const { limit, offset } = parsePagination(req.query, { limit: 50, maxLimit: 100 });

      const result = followSchema.safeParse({ userId });
      if (!result.success) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const { followers, total } = await storage.getFollowers(userId, limit, offset);
      
      res.json({
        followers: followers.map(u => ({
          id: u.id,
          username: u.username,
          displayName: u.displayName,
          profileImageUrl: u.profileImageUrl,
          followedAt: u.followedAt
        })),
        total,
        limit,
        offset
      });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/social/counts/:userId", async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;

      const result = followSchema.safeParse({ userId });
      if (!result.success) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const counts = await storage.getFollowCounts(userId);
      res.json(counts);
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/social/is-following/:userId", requireAuth, async (req: Request, res: Response) => {
    try {
      const followerId = getUserId(req as AuthenticatedRequest);
      const followingId = req.params.userId;

      const result = followSchema.safeParse({ userId: followingId });
      if (!result.success) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const isFollowing = await storage.isFollowing(followerId, followingId);
      res.json({ isFollowing });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.get("/api/social/feed", requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = getUserId(req as AuthenticatedRequest);
      const { limit, offset } = parsePagination(req.query, { limit: 50, maxLimit: 100 });

      const { images, total } = await storage.getFollowingFeed(userId, limit, offset);
      
      res.json({
        images,
        total,
        limit,
        offset
      });
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  });
}
