import fs from "fs";
import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
const appDir = path.join(process.cwd(), "src/app");
const outputPath = path.join(process.cwd(), "public", "routes.json");

/**
 * Recursively collect all routes from the App Router directory.
 */
function collectRoutes(dir, routes = [], basePath = "") {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const newBasePath = path.join(basePath, file);
      collectRoutes(fullPath, routes, newBasePath);
    } else if (file === "page.js" || file === "page.tsx") {
      const routePath = basePath
        .replace(/\/\(.*?\)/g, "") // Remove Next.js route groups like (marketing)
        .replace(/\[(.*?)\]/g, ":$1") // Convert [slug] to :slug for dynamic routes
        .replace(/\/_/g, "/"); // Ignore private folders starting with _

      if (routePath) {
        routes.push(`/${routePath}`);
      } else {
        routes.push("/");
      }
    }
  });

  return routes;
}

// Generate routes
const routes = collectRoutes(appDir);
const uniqueRoutes = [...new Set(routes)];

// Save to public/routes.json
fs.writeFileSync(outputPath, JSON.stringify(uniqueRoutes, null, 2));
console.log("Generated routes:", uniqueRoutes);
