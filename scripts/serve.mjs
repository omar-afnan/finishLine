/**
 * Zero-dependency static server for /output.
 *
 * Not needed to build anything: `npm run render` writes plain HTML that opens
 * fine from the filesystem. This exists because file:// URLs behave slightly
 * differently from http:// (relative paths, CORS, some devtools features), and
 * because serving on 0.0.0.0 lets you open the page on a phone on the same
 * network, which is the honest way to check the responsive breakpoints.
 *
 *   node scripts/serve.mjs [port]
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { indexPage } from "./index-page.mjs";

const port = Number(process.argv[2] ?? process.env.PORT ?? 4173);
const root = path.join(process.cwd(), "output");

const types = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

if (!fs.existsSync(root)) {
  console.error("No output/ directory yet. Run `npm run render` first.");
  process.exit(1);
}

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url ?? "/").split("?")[0]);
  const target = url === "/" ? "/index.html" : url;

  // Resolve inside output/ only, so a crafted path cannot escape the folder.
  const filePath = path.join(root, path.normalize(target).replace(/^(\.\.[/\\])+/, ""));
  if (!filePath.startsWith(root)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  if (url === "/") {
    // Generated per request rather than served from output/index.html: a build
    // may not have written that file yet, and regenerating keeps the listing in
    // step with whatever is on disk right now.
    res.writeHead(200, { "content-type": types[".html"], "cache-control": "no-store" }).end(
      indexPage(root)
    );
    return;
  }

  fs.readFile(filePath, (err, buf) => {
    if (err) {
      res.writeHead(404, { "content-type": types[".txt"] }).end("Not found");
      return;
    }
    res.writeHead(200, {
      "content-type": types[path.extname(filePath)] ?? "application/octet-stream",
      "cache-control": "no-store",
    }).end(buf);
  });
});

server.on("listening", () => {
  const actual = server.address().port;
  const lan = Object.values(os.networkInterfaces())
    .flat()
    .find((i) => i && i.family === "IPv4" && !i.internal)?.address;

  if (actual !== port) {
    console.log(`\n  Port ${port} was busy, using ${actual} instead.`);
  }
  console.log(`\n  Local:   http://localhost:${actual}`);
  if (lan) console.log(`  Network: http://${lan}:${actual}   (open this on your phone)`);
  console.log("\n  Ctrl+C to stop.\n");
});

/**
 * A busy port is an ordinary situation (a previous run still going, another
 * dev server), not a crash. Walk up to the next free port instead of dying
 * with an unhandled 'error' event and a stack trace.
 */
const maxAttempts = 10;
let attempt = 0;

server.on("error", (err) => {
  if (err.code === "EADDRINUSE" && attempt < maxAttempts) {
    attempt += 1;
    server.listen(port + attempt, "0.0.0.0");
    return;
  }
  if (err.code === "EADDRINUSE") {
    console.error(
      `\n  Ports ${port} to ${port + maxAttempts} are all in use.` +
        `\n  Pass a different one:  node scripts/serve.mjs 5000\n`
    );
  } else if (err.code === "EACCES") {
    console.error(`\n  Not allowed to bind port ${port}. Try a port above 1024.\n`);
  } else {
    console.error(`\n  Could not start the server: ${err.message}\n`);
  }
  process.exit(1);
});

// Ctrl+C should release the port cleanly rather than leaving it held.
for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => {
    server.close(() => process.exit(0));
    // Do not wait forever on keep-alive connections.
    setTimeout(() => process.exit(0), 500).unref();
  });
}

server.listen(port, "0.0.0.0");
