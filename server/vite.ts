import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createLogger, createServer as createViteServer } from "vite";
const viteLogger = createLogger();

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // Try to find the client template in production first, then development
      const possibleTemplates = [
        path.resolve(process.cwd(), "dist", "public", "index.html"), // Production
        path.resolve(import.meta.dirname, "..", "dist", "public", "index.html"), // Alternative production
        path.resolve(import.meta.dirname, "..", "client", "index.html"), // Development
      ];

      let clientTemplate = null;
      for (const templatePath of possibleTemplates) {
        if (fs.existsSync(templatePath)) {
          clientTemplate = templatePath;
          break;
        }
      }

      if (!clientTemplate) {
        throw new Error("Could not find index.html template");
      }

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // 1) Locate your built public folder
  const publicPath = (() => {
    const candidates = [
      path.resolve(process.cwd(), "dist", "public"),
      path.resolve(import.meta.dirname, "..", "dist", "public"),
    ];
    return candidates.find((p) => fs.existsSync(p))!;
  })();

  console.log(`Serving static files from: ${publicPath}`);

  // 2) **Explicitly** mount /assets → dist/public/assets
  app.use(
    "/assets",
    express.static(path.join(publicPath, "assets"), {
      maxAge: "1y",      // long cache, files are content-hashed
      immutable: true,
    })
  );

  // 3) Mount everything else (HTML, images, CSS, fonts)  
  app.use(
    express.static(publicPath, {
      maxAge: "1h",
    })
  );

  // 4) SPA fallback: serve index.html for client-side routes
  app.get("/*", (_req, res) => {
    res.sendFile(path.join(publicPath, "index.html"), (err) => {
      if (err) {
        console.error(`Error serving index.html: ${err.message}`);
        res.status(500).json({ error: "Failed to serve static files" });
      }
    });
  });
}
