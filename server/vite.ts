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
    configFile: path.resolve(import.meta.dirname, "..", "vite.config.ts"),
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
  // Enhanced path detection for Render.com deployment
  const possiblePaths = [
    // Render.com production paths (server runs from dist/server/)
    path.resolve(import.meta.dirname, "..", "public"),
    path.resolve(process.cwd(), "public"),
    path.resolve(process.cwd(), "dist", "public"),
    // Alternative paths
    path.resolve(import.meta.dirname, "..", "dist", "public"),
    path.resolve(process.cwd(), "public"),
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

  // List files in the dist directory for debugging
  try {
    const files = fs.readdirSync(distPath);
    console.log(`Files in ${distPath}:`, files);

    const assetsPath = path.join(distPath, "assets");
    if (fs.existsSync(assetsPath)) {
      const assetFiles = fs.readdirSync(assetsPath);
      console.log(`Files in ${assetsPath}:`, assetFiles);
    }
  } catch (error) {
    console.log(`Error reading directory: ${error}`);
  }

  // Serve static files with proper MIME types and caching
  app.use(
    express.static(distPath, {
      maxAge: "1y", // Cache static assets for 1 year
      setHeaders: (res, filePath) => {
        if (filePath.endsWith(".css")) {
          res.setHeader("Content-Type", "text/css");
          res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year
        } else if (filePath.endsWith(".js")) {
          res.setHeader("Cache-Control", "public, max-age=31536000"); // 1 year
        }
      },
    })
  );

  // Specific route for CSS files as fallback
  app.get("/assets/*.css", (req, res) => {
    const cssPath = path.join(distPath, req.path);
    console.log(`Serving CSS file: ${cssPath}`);

    if (fs.existsSync(cssPath)) {
      res.setHeader("Content-Type", "text/css");
      res.setHeader("Cache-Control", "public, max-age=31536000");
      res.sendFile(cssPath);
    } else {
      console.error(`CSS file not found: ${cssPath}`);
      res.status(404).send("CSS file not found");
    }
  });

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
