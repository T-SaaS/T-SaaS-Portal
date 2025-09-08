import cors from "cors";
import dotenv from "dotenv";
import express, { NextFunction, type Request, Response } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { registerRoutes } from "./routes";
import { log, serveStatic, setupVite } from "./vite";

dotenv.config();
const app = express();

// Configure trust proxy for proper IP address detection behind proxies
// Only trust the first proxy (load balancer) in production
// In development, we can trust localhost proxies
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); // Trust only the first proxy
} else {
  app.set("trust proxy", "loopback"); // Trust only loopback addresses in development
}

// CORS configuration
const corsOptions = {
  origin: function (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000", // Vite dev server
      "http://localhost:5173", // Vite default port
      "http://localhost:4173", // Vite preview port
      "http://localhost:5000", // Backend server
      "http://127.0.0.1:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:4173",
      "http://127.0.0.1:5000",
      // Add your production domain here when deployed
      "https://driverqualificationtool.onrender.com",
      "https://driverqualificationtool.onrender.com/",
      "https://tsaasportal.vlocitycapital.com",
      "https://tsaasportal.vlocitycapital.com/",
    ];

    // Add origins from environment variable
    const envOrigins =
      process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) || [];
    allowedOrigins.push(...envOrigins);

    // Normalize origin by removing trailing slash for comparison
    const normalizedOrigin = origin?.replace(/\/$/, "");
    const normalizedAllowedOrigins = allowedOrigins.map((o) =>
      o.replace(/\/$/, "")
    );

    // Check if the origin is allowed
    if (
      normalizedAllowedOrigins.includes(normalizedOrigin) ||
      process.env.NODE_ENV === "development"
    ) {
      callback(null, true);
    } else {
      log(`CORS blocked request from origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Origin",
    "X-Requested-With",
    "Content-Type",
    "Accept",
    "Authorization",
    "Cache-Control",
  ],
  exposedHeaders: ["Content-Length", "X-Requested-With"],
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// Rate limiting configuration
const createRateLimiter = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max, // Limit each IP to max requests per windowMs
    message: {
      error: "Too many requests",
      message:
        message || `Too many requests from this IP, please try again later.`,
      retryAfter: Math.ceil(windowMs / 1000),
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: false, // Count all requests, including successful ones
    skipFailedRequests: false, // Count all requests, including failed ones
    keyGenerator: (req) => {
      // Use a combination of IP and user agent for better rate limiting
      // Use the ipKeyGenerator helper for proper IPv6 handling
      const ip = ipKeyGenerator(
        req.ip || req.connection.remoteAddress || "unknown"
      );
      const userAgent = req.get("User-Agent") || "unknown";
      return `${ip}-${userAgent}`;
    },
    handler: (req, res) => {
      log(
        `Rate limit exceeded for IP: ${req.ip} - ${req.method} ${
          req.path
        } - User-Agent: ${req.get("User-Agent")}`
      );
      res.status(429).json({
        error: "Too many requests",
        message:
          message || `Too many requests from this IP, please try again later.`,
        retryAfter: Math.ceil(windowMs / 1000),
      });
    },
  });
};

// General rate limiter for all routes
const generalLimiter = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  100, // limit each IP to 100 requests per 15 minutes
  "Too many requests from this IP, please try again in 15 minutes."
);

// Stricter rate limiter for authentication routes
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // limit each IP to 5 requests per 15 minutes
  "Too many authentication attempts, please try again in 15 minutes."
);

// API rate limiter for sensitive operations
const apiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  50, // limit each IP to 50 requests per 15 minutes
  "Too many API requests, please try again in 15 minutes."
);

// Apply rate limiting - skip for development static assets
if (process.env.NODE_ENV === "development") {
  // In development, disable rate limiting for now to debug issues
  log("Rate limiting disabled in development mode");
  // app.use("/api", generalLimiter);
  // app.use("/api/auth", authLimiter);
} else {
  // In production, apply to all routes
  app.use(generalLimiter);
  app.use("/api/auth", authLimiter); // Stricter auth rate limiting
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Global error handlers to prevent server crashes
process.on("uncaughtException", (error) => {
  log(`Uncaught Exception: ${error.message}`);
  log(error.stack || "No stack trace available");
  // Don't exit immediately, let the server try to continue
});

process.on("unhandledRejection", (reason, promise) => {
  log(`Unhandled Rejection at: ${promise}, reason: ${reason}`);

  // Log additional details for debugging
  if (reason instanceof Error) {
    log(`Error name: ${reason.name}`);
    log(`Error message: ${reason.message}`);
    log(`Error stack: ${reason.stack}`);
  }

  // Check if it's related to ZeptoMail
  if (reason && typeof reason === "object" && "message" in reason) {
    const message = (reason as any).message;
    if (typeof message === "string" && message.includes("json")) {
      log("This appears to be a JSON parsing error, possibly from ZeptoMail");
    }
  }

  // Don't exit immediately, let the server try to continue
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  log("SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  log("SIGINT received, shutting down gracefully");
  process.exit(0);
});

(async () => {
  try {
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      log(`Error ${status}: ${message}`);
      if (err.stack) {
        log(err.stack);
      }

      res.status(status).json({ message });
      // Don't throw the error - just log it and continue
    });

    // importantly only setup vite in development and after
    // setting up all the other routes so the catch-all route
    // doesn't interfere with the other routes
    if (process.env.NODE_ENV === "development") {
      await setupVite(app, server);
    } else {
      try {
        serveStatic(app);
      } catch (error) {
        log(`Error setting up static files: ${error}`);
        // Fallback: serve API only
        app.use("*", (_req, res) => {
          res.status(404).json({ message: "Not found" });
        });
      }
    }

    // Use environment PORT for Render.com deployment, fallback to 5000
    const port = process.env.PORT || 5000;

    // Set timeout values for Render.com deployment
    server.keepAliveTimeout = 120000; // 120 seconds
    server.headersTimeout = 120000; // 120 seconds

    log(`Starting server on port ${port} with host 0.0.0.0`);
    log(`NODE_ENV: ${process.env.NODE_ENV}`);
    log(
      `Environment variables: PORT=${process.env.PORT}, NODE_ENV=${process.env.NODE_ENV}`
    );

    server.listen(
      {
        port,
        host: "0.0.0.0",
        reusePort: true,
      },
      () => {
        log(`✅ Server started successfully on port ${port}`);
        log(`🌐 Server accessible at http://0.0.0.0:${port}`);
      }
    );

    // Handle server errors
    server.on("error", (error) => {
      log(`Server error: ${error.message}`);
      if (error.stack) {
        log(error.stack);
      }
    });
  } catch (error) {
    log(
      `Failed to start server: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    if (error instanceof Error && error.stack) {
      log(error.stack);
    }
    process.exit(1);
  }
})();
