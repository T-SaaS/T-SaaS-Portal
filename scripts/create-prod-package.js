import { readFileSync, writeFileSync } from "fs";

console.log("📦 Creating production package.json...");

try {
  // Read the original package.json
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

  // Create production package.json with only necessary fields
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

  // Write to dist folder
  writeFileSync("dist/package.json", JSON.stringify(prodPackageJson, null, 2));

  console.log("✅ Production package.json created successfully!");
} catch (error) {
  console.error("❌ Failed to create production package.json:", error.message);
  process.exit(1);
}
