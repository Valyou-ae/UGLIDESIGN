import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { storage } from "./storage";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static files with cache control
  // JS/CSS files have hashes in names, so they can be cached longer
  // But we set moderate cache to ensure updates are picked up
  app.use(express.static(distPath, {
    etag: false,
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      // HTML files should never be cached
      if (filePath.endsWith('.html')) {
        res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
        res.set('Pragma', 'no-cache');
        res.set('Expires', '0');
      }
    }
  }));

  // Handle share pages with dynamic OG meta tags
  app.get("/share/:id", async (req, res) => {
    try {
      const indexPath = path.resolve(distPath, "index.html");
      let html = fs.readFileSync(indexPath, "utf-8");
      
      const image = await storage.getPublicImageById(req.params.id);
      
      if (image) {
        const title = "AI Generated Image - UGLI";
        const description = image.prompt 
          ? image.prompt.substring(0, 150) + (image.prompt.length > 150 ? "..." : "")
          : "Check out this AI-generated image created with UGLI";
        const imageUrl = image.imageUrl;
        const creator = image.username ? `Created by @${image.username}` : "";
        
        // Build dynamic meta tags
        const metaTags = `
    <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${(description + (creator ? ` ${creator}` : "")).replace(/"/g, '&quot;')}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${imageUrl}" />`;
        
        // Replace existing OG tags or inject before </head>
        html = html.replace(/<meta property="og:title"[^>]*>/g, '');
        html = html.replace(/<meta property="og:description"[^>]*>/g, '');
        html = html.replace(/<meta property="og:image"[^>]*>/g, '');
        html = html.replace(/<meta name="twitter:card"[^>]*>/g, '');
        html = html.replace(/<meta name="twitter:title"[^>]*>/g, '');
        html = html.replace(/<meta name="twitter:description"[^>]*>/g, '');
        html = html.replace(/<meta name="twitter:image"[^>]*>/g, '');
        html = html.replace('</head>', `${metaTags}\n  </head>`);
      }
      
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      // Fall back to regular index.html on error
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.sendFile(path.resolve(distPath, "index.html"));
    }
  });

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
