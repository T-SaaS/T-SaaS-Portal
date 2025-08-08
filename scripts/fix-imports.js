import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

console.log("🔧 Fixing ES module imports...");

function fixImportsInDirectory(dirPath) {
  try {
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
  } catch (error) {
    console.log(`Skipping directory ${dirPath}: ${error.message}`);
  }
}

function fixImportsInFile(filePath) {
  try {
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
  } catch (error) {
    console.log(`Error fixing imports in ${filePath}: ${error.message}`);
  }
}

// Fix imports in the server directory
if (process.cwd().includes("dist")) {
  // Running from dist directory
  fixImportsInDirectory("server");
} else {
  // Running from project root
  fixImportsInDirectory("dist/server");
}

console.log("✅ Import fixing completed!");
