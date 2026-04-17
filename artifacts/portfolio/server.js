/**
 * Production static file server with SPA fallback.
 *
 * Vite's built-in `vite preview` does NOT handle SPA fallback routing —
 * any direct navigation to /admin, /blog/:slug, etc. returns a 404 because
 * those paths don't correspond to real files on disk.
 *
 * This server:
 *   1. Tries to serve the requested file from dist/public.
 *   2. If the file doesn't exist it falls back to dist/public/index.html
 *      so React Router can handle the route on the client.
 *
 * Zero extra dependencies — uses only Node built-ins.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist", "public");
const INDEX = path.join(DIST, "index.html");
const PORT = Number(process.env.PORT) || 4173;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js":   "application/javascript; charset=utf-8",
  ".mjs":  "application/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png":  "image/png",
  ".jpg":  "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif":  "image/gif",
  ".svg":  "image/svg+xml",
  ".ico":  "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2":"font/woff2",
  ".ttf":  "font/ttf",
  ".txt":  "text/plain; charset=utf-8",
  ".xml":  "application/xml",
  ".webmanifest": "application/manifest+json",
};

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME[ext] ?? "application/octet-stream";

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fallback to index.html for SPA routing
      fs.readFile(INDEX, (err2, html) => {
        if (err2) {
          res.writeHead(500);
          res.end("Server error");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
      });
      return;
    }

    const isImmutable = filePath.includes("/assets/");
    res.writeHead(200, {
      "Content-Type": contentType,
      // Vite hashes asset filenames so they can be cached indefinitely.
      // index.html and other top-level files must not be cached.
      "Cache-Control": isImmutable
        ? "public, max-age=31536000, immutable"
        : "no-cache, no-store, must-revalidate",
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  // Strip query string and decode URI
  let urlPath;
  try {
    urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  } catch {
    res.writeHead(400);
    res.end("Bad Request");
    return;
  }

  // Prevent directory traversal
  const safePath = path.normalize(urlPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(DIST, safePath);

  // Must stay within DIST
  if (!filePath.startsWith(DIST)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      serveFile(filePath, res);
    } else if (!err && stat.isDirectory()) {
      // Try index.html inside the directory first, then SPA fallback
      const dirIndex = path.join(filePath, "index.html");
      fs.stat(dirIndex, (e, s) => {
        if (!e && s.isFile()) {
          serveFile(dirIndex, res);
        } else {
          serveFile(INDEX, res);
        }
      });
    } else {
      // Not a real file → let React Router handle it
      serveFile(INDEX, res);
    }
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Portfolio server running on http://0.0.0.0:${PORT}`);
});
