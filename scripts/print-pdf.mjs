/**
 * Turns the rendered itinerary into a real PDF: assets/itinerary.pdf.
 *
 * The "Download PDF" buttons in the email, on the destination page and on the
 * itinerary itself all point at a relative itinerary.pdf, so that file has to
 * exist. Chrome's headless print pipeline is what produces it, driven by the
 * same @page and print rules the document already carries.
 *
 * Why the file lands in assets/ and not straight in output/:
 *   output/ is generated and gitignored, and the deploy host has no browser to
 *   run this with. Writing to assets/ makes the PDF a committed artifact that
 *   the build copies next to the HTML, exactly like the favicon.
 *
 * Run after a render:
 *   npm run pdf
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const root = process.cwd();
const source = path.join(root, "output", "itinerary.html");
const target = path.join(root, "assets", "itinerary.pdf");

/** Chrome or Edge, wherever this happens to run. */
function findBrowser() {
  const fromEnv = process.env.CHROME_PATH;
  const candidates = [
    fromEnv,
    // Windows
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    // macOS
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    // Linux
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/microsoft-edge",
  ].filter(Boolean);
  return candidates.find((c) => fs.existsSync(c));
}

if (!fs.existsSync(source)) {
  console.error("No output/itinerary.html. Run `npm run render` first.");
  process.exit(1);
}

const browser = findBrowser();
if (!browser) {
  console.error(
    "No Chrome or Edge found. Set CHROME_PATH to a Chromium binary, or open\n" +
      "output/itinerary.html and use the browser's own Print to PDF."
  );
  process.exit(1);
}

const fileUrl = `file:///${source.replace(/\\/g, "/")}`;

execFileSync(
  browser,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    // The document already sets @page size and margins, so nothing is
    // overridden here beyond suppressing the browser's own header line.
    `--print-to-pdf=${target}`,
    fileUrl,
  ],
  { stdio: ["ignore", "ignore", "pipe"] }
);

const kb = (fs.statSync(target).size / 1024).toFixed(1);
console.log(`  ok  assets/itinerary.pdf  (${kb} KB)`);
console.log("      run `npm run build` to copy it into output/");
