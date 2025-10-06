import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://3de40fda9dc899210a2fd2905602f0cc@o4510081971716096.ingest.us.sentry.io/4510081973485568",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  tracesSampleRate: 1.0,
  tracePropagationTargets: ["localhost", /^\//],
  // Session Replay
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1.0,
  tunnel: "/tunnel",
});

// Sometime later
import("@sentry/react").then((lazyLoadedSentry) => {
  Sentry.addIntegration(
    lazyLoadedSentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    })
  );
});

createRoot(document.getElementById("root")!, {
  // Callback called when an error is thrown and not caught by an ErrorBoundary.
  onUncaughtError: (error: Error, errorInfo: { componentStack: string }) => {
    console.warn("Uncaught error", error, errorInfo.componentStack);
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  },
  // Callback called when React catches an error in an ErrorBoundary.
  onCaughtError: (error: Error, errorInfo: { componentStack: string }) => {
    console.warn("Caught error", error, errorInfo.componentStack);
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  },
  // Callback called when React automatically recovers from errors.
  onRecoverableError: (error: Error, errorInfo: { componentStack: string }) => {
    console.warn("Recoverable error", error, errorInfo.componentStack);
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
    });
  },
} as any).render(<App />);
