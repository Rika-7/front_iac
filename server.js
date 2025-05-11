import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Get the equivalent of __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Always use production mode when deployed
const dev = false;
const app = next({
  dev,
  dir: __dirname,
  conf: {
    distDir: ".next",
  },
});

const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

// Log startup information to help with debugging
console.log("Starting Next.js server in standalone mode");
console.log("Current working directory:", __dirname);
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
