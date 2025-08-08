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
      // In development, always use the client/index.html template
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );

      if (!fs.existsSync(clientTemplate)) {
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
  // Paths optimized for Render.com deployment
  const possiblePaths = [
    path.resolve(process.cwd(), "public"), // Render.com production (running from dist/)
    path.resolve(process.cwd(), "dist", "public"), // Alternative (running from root)
    path.resolve(import.meta.dirname, "..", "public"), // Server running from dist/server/
    path.resolve(import.meta.dirname, "..", "dist", "public"), // Alternative path
    path.resolve(process.cwd(), "public"), // Fallback
  ];

  let distPath = null;
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      distPath = testPath;
      break;
    }
  }

  if (!distPath) {
    console.warn(
      `Could not find the build directory, tried: ${possiblePaths.join(
        ", "
      )}, serving API only`
    );
    // Don't throw error, just serve API routes
    app.use("*", (_req, res) => {
      res.status(404).json({ message: "Not found" });
    });
    return;
  }

  console.log(`Serving static files from: ${distPath}`);
  console.log(`Current working directory: ${process.cwd()}`);
  console.log(`Server file location: ${import.meta.dirname}`);
  
  // Serve static files with proper MIME types
  app.use(express.static(distPath, {
    setHeaders: (res, path) => {
      if (path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
      }
    }
  }));

  // fall through to index.html if the file doesn't exist
  app.use("*", (req, res) => {
    console.log(`Serving index.html for route: ${req.originalUrl}`);
    res.sendFile(path.resolve(distPath, "index.html"), (err) => {
      if (err) {
        console.error(`Error serving index.html: ${err.message}`);
        res.status(500).json({ error: "Failed to serve static files" });
      }
    });
  });
}
