import { execSync } from "child_process";
import {
  cpSync,
  existsSync,
  rmSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
} from "fs";
import { join } from "path";

console.log("🚀 Starting simple build process...");

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

  // Fix ES module imports by adding .js extensions
  console.log("🔧 Fixing ES module imports...");
  fixImportsInDirectory("dist");

  // Create production package.json
  console.log("📄 Creating production package.json...");
  createProductionPackage();

  console.log("✅ Build completed successfully!");
} catch (error) {
  console.error("❌ Build failed:", error.message);
  process.exit(1);
}

function fixImportsInDirectory(dirPath) {
  const items = readdirSync(dirPath);

  items.forEach((item) => {
    const fullPath = join(dirPath, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      fixImportsInDirectory(fullPath);
    } else if (item.endsWith(".js")) {
      fixImportsInFile(fullPath);
    }
  });
}

function fixImportsInFile(filePath) {
  let content = readFileSync(filePath, "utf8");
  let modified = false;

  // Fix @shared imports
  const sharedRegex = /from\s+['"](@shared\/[^'"]*?)['"]/g;
  content = content.replace(sharedRegex, (match, importPath) => {
    const relativePath = importPath.replace("@shared/", "../shared/");
    modified = true;
    return `from '${relativePath}.js'`;
  });

  // Fix relative imports
  const relativeRegex = /from\s+['"](\.\/[^'"]*?)['"]/g;
  content = content.replace(relativeRegex, (match, importPath) => {
    if (
      !importPath.endsWith(".js") &&
      !importPath.includes("@") &&
      !importPath.startsWith("http")
    ) {
      modified = true;
      return `from '${importPath}.js'`;
    }
    return match;
  });

  // Fix parent directory imports
  const parentRegex = /from\s+['"](\.\.\/[^'"]*?)['"]/g;
  content = content.replace(parentRegex, (match, importPath) => {
    if (
      !importPath.endsWith(".js") &&
      !importPath.includes("@") &&
      !importPath.startsWith("http")
    ) {
      modified = true;
      return `from '${importPath}.js'`;
    }
    return match;
  });

  if (modified) {
    writeFileSync(filePath, content, "utf8");
    console.log(`✅ Fixed imports in ${filePath}`);
  }
}

function createProductionPackage() {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

  const prodPackageJson = {
    name: packageJson.name,
    version: packageJson.version,
    type: packageJson.type,
    main: "server/index.js",
    scripts: {
      start: "node server/index.js",
    },
    dependencies: packageJson.dependencies,
    engines: {
      node: ">=18.0.0",
    },
  };

  writeFileSync("dist/package.json", JSON.stringify(prodPackageJson, null, 2));
  console.log("✅ Production package.json created successfully!");
}
