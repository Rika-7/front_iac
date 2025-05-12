import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync } from "fs";

// Get the equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Always use production mode when deployed
const dev = false;

// Check if we're running in a standalone environment
const standalonePath = join(__dirname, ".next/standalone");
const isStandalone = existsSync(standalonePath);

// Configure the Next.js app with the correct path
const app = next({
  dev,
  dir: isStandalone ? standalonePath : __dirname,
  conf: {
    distDir: isStandalone ? "./.next" : ".next",
  },
});

const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

// Log startup information to help with debugging
console.log("Starting Next.js server in standalone mode");
console.log("Current working directory:", __dirname);
console.log("Is standalone mode:", isStandalone);
console.log(
  "Looking for Next.js build in:",
  isStandalone ? join(standalonePath, ".next") : join(__dirname, ".next")
);
console.log("Environment:", process.env.NODE_ENV);

try {
  await app.prepare();

  createServer((req, res) => {
    // Parse the request URL
    const parsedUrl = parse(req.url, true);

    // Let Next.js handle the request
    handle(req, res, parsedUrl);
  }).listen(port, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
} catch (err) {
  console.error("Error preparing Next.js app:", err);
  process.exit(1);
}
