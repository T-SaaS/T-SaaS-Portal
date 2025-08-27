import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: "./postcss.config.js",
  },
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  define: {
    global: "globalThis",
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist", "public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          ui: [
            "@radix-ui/react-dialog",
            "@radix-ui/react-select",
            "@radix-ui/react-label",
          ],
          pdf: ["@react-pdf/renderer"],
        },
        // Ensure proper module format for better compatibility
        format: "es",
        // Add proper chunk naming
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
      // Ensure external dependencies are handled properly
      external: [],
    },
    // Add target for better compatibility
    target: "es2015",
    // Ensure source maps are generated for debugging
    sourcemap: false,
    // Add minify options for better compatibility
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
      },
    },
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Ensure assets are built with proper paths
  base: "/",
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  // Add optimizeDeps for better handling of dependencies
  optimizeDeps: {
    include: ["@react-pdf/renderer"],
    exclude: [],
  },
});
