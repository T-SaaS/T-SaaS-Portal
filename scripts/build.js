import { execSync } from "child_process";
import { cpSync, existsSync, rmSync } from "fs";
import { join } from "path";

console.log("🚀 Starting build process...");

try {
  // Clean dist directory
  if (existsSync("dist")) {
    console.log("🧹 Cleaning dist directory...");
    rmSync("dist", { recursive: true, force: true });
  }

  // Build client
  console.log("📦 Building client...");
  execSync("vite build", { stdio: "inherit" });

  // Build server
  console.log("🔧 Building server...");
  execSync("tsc --project tsconfig.server.json", { stdio: "inherit" });

  // Copy shared files
  console.log("📋 Copying shared files...");
  if (existsSync("shared")) {
    cpSync("shared", "dist/shared", { recursive: true });
  }

  // Create production package.json
  console.log("📄 Creating production package.json...");
  execSync("node scripts/create-prod-package.js", { stdio: "inherit" });

  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}
