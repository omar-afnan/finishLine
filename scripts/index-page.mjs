/**
 * The front door for output/ — the card grid linking to the three deliverables.
 *
 * Two consumers, one generator:
 *   - scripts/serve.mjs calls indexPage(root) per request, so the local preview
 *     always reflects whatever is on disk right now.
 *   - the deploy build runs this file directly, writing output/index.html so a
 *     static host has a real file to serve at /.
 *
 * Run directly to write that static file:
 *   node scripts/index-page.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Palette mirrored from src/lib/theme.ts. This file is plain ESM and cannot
 * import the TypeScript token module, so the handful of values used here are
 * repeated rather than derived. Keep them in step if the theme changes.
 */
const t = {
  teal: "#0D9488",
  tealLight: "#F0FDFA",
  navy: "#0F172A",
  warmGray: "#64748B",
  body: "#334155",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  border: "#E2E8F0",
  hairline: "#F1F5F9",
  onNavyMuted: "#94A3B8",
  font: "'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
  mono: "ui-monospace, 'SFMono-Regular', Consolas, monospace",
};

const svg = (paths, size = 22) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
  `stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const icons = {
  mail: svg('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
  globe: svg(
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'
  ),
  printer: svg(
    '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>'
  ),
  arrow: svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', 16),
};

/** The three deliverables, in the order they reach a traveller. */
const deliverables = [
  {
    file: "email.html",
    icon: "mail",
    mode: "<Email>",
    width: "600px",
    title: "Booking confirmation",
    blurb:
      "Table-based HTML at a fixed 600px, solid colour fills only, with a plain-text part alongside it.",
  },
  {
    file: "page.html",
    icon: "globe",
    mode: "<Page>",
    width: "960px",
    title: "Destination page",
    blurb:
      "Responsive flexbox at 960px. Sticky nav, hero, itinerary timeline, journal and about sections.",
  },
  {
    file: "itinerary.html",
    icon: "printer",
    mode: "<Document>",
    width: "700px",
    title: "Travel itinerary",
    blurb:
      "Print-ready at 700px with real page-break rules. Hit Print itinerary to export the PDF.",
  },
];

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const kb = (root, file) => {
  try {
    return `${(fs.statSync(path.join(root, file)).size / 1024).toFixed(1)} KB`;
  } catch {
    return "";
  }
};

export function indexPage(root, opts = {}) {
  const { deployed = false } = opts;
  const eyebrow = deployed ? "Built with Unlayer Elements" : "Local preview";
  const lede = deployed
    ? `One booking record, rendered three ways with Unlayer Elements. Every file below is
       generated from a single typed data module by <code>npm run render</code>.`
    : `One booking record, rendered three ways with Unlayer Elements. These files were written by
       <code>npm run render</code> and are served straight from <code>output/</code>.`;
  const hint = deployed
    ? `Each page is a standalone HTML file with no build step and no client-side JavaScript, so
       what you see is exactly what the renderer wrote.`
    : `Changed something? Re-run <code>npm run render</code> and refresh. This server only reads
       from disk, so there is nothing to restart.`;

  const present = new Set(fs.readdirSync(root));

  // Only advertise what was actually rendered, so the page never links to a 404.
  const cards = deliverables
    .filter((d) => present.has(d.file))
    .map(
      (d) => `
      <a class="card" href="/${d.file}">
        <span class="card-icon">${icons[d.icon]}</span>
        <span class="card-mode">${esc(d.mode)} · ${d.width}</span>
        <span class="card-title">${esc(d.title)}</span>
        <span class="card-blurb">${esc(d.blurb)}</span>
        <span class="card-foot">
          <span class="file">${esc(d.file)} · ${kb(root, d.file)}</span>
          <span class="go">Open ${icons.arrow}</span>
        </span>
      </a>`
    )
    .join("");

  const known = new Set(deliverables.map((d) => d.file));
  const extras = [...present]
    .filter((f) => !known.has(f) && f !== "index.html")
    .sort()
    .map(
      (f) => `
      <li>
        <a href="/${encodeURIComponent(f)}">${esc(f)}</a>
        <span class="size">${kb(root, f)}</span>
      </li>`
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>WANDERLUST · ${deployed ? "booking suite" : "local preview"}</title>
<meta name="description" content="A luxury travel booking suite built with Unlayer Elements: one React codebase rendering an email, a destination page and a printable itinerary." />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    background: ${t.bg};
    color: ${t.body};
    font-family: ${t.font};
    font-size: 14px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { max-width: 960px; margin: 0 auto; padding: 0 24px; }

  header { background: ${t.navy}; padding: 44px 0 48px; }
  .eyebrow {
    font-size: 11px; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; color: ${t.teal}; margin: 0 0 10px;
  }
  .brand { font-size: 22px; font-weight: 700; letter-spacing: 2px; color: ${t.white}; margin: 0; }
  .lede { color: ${t.onNavyMuted}; margin: 14px 0 0; max-width: 60ch; }
  .lede code { font-family: ${t.mono}; font-size: 12.5px; color: #CBD5E1; }

  main { padding: 40px 0 64px; }
  .section-label {
    font-size: 11px; font-weight: 700; letter-spacing: 1px;
    text-transform: uppercase; color: ${t.teal}; margin: 0 0 16px;
  }

  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .card {
    display: flex; flex-direction: column;
    background: ${t.white};
    border: 1px solid ${t.border};
    border-radius: 12px;
    padding: 24px;
    text-decoration: none;
    color: inherit;
    transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  }
  .card:hover {
    border-color: ${t.teal};
    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
    transform: translateY(-2px);
  }
  .card:focus-visible { outline: 2px solid ${t.teal}; outline-offset: 3px; }
  .card-icon { color: ${t.teal}; line-height: 0; }
  .card-mode { font-family: ${t.mono}; font-size: 11px; color: ${t.warmGray}; margin-top: 16px; }
  .card-title { font-size: 16px; font-weight: 600; color: ${t.navy}; margin-top: 4px; }
  .card-blurb { color: ${t.body}; margin-top: 8px; }
  .card-foot {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    margin-top: auto; padding-top: 18px;
  }
  .card-foot .file { font-size: 12px; color: ${t.warmGray}; }
  .go {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 600; color: ${t.teal}; white-space: nowrap;
  }
  .go svg { transition: transform 180ms ease; }
  .card:hover .go svg { transform: translateX(3px); }

  .extras { margin-top: 48px; }
  .extras ul {
    list-style: none; margin: 0; padding: 0;
    background: ${t.white}; border: 1px solid ${t.border}; border-radius: 12px;
  }
  .extras li {
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    padding: 12px 20px; border-bottom: 1px solid ${t.hairline};
  }
  .extras li:last-child { border-bottom: 0; }
  .extras a { color: ${t.navy}; font-family: ${t.mono}; font-size: 13px; text-decoration: none; }
  .extras a:hover { color: ${t.teal}; text-decoration: underline; }
  .extras .size { font-size: 12px; color: ${t.warmGray}; }

  .hint {
    margin-top: 40px; padding: 18px 20px;
    background: ${t.tealLight}; border: 1px solid #CCFBF1; border-radius: 12px;
    font-size: 13px; color: ${t.body};
  }
  .hint code {
    font-family: ${t.mono}; font-size: 12.5px;
    background: ${t.white}; border: 1px solid ${t.border}; border-radius: 4px;
    padding: 2px 6px; color: ${t.navy};
  }

  footer {
    border-top: 1px solid ${t.border};
    padding: 24px 0 40px; font-size: 12px; color: ${t.warmGray};
  }

  @media (max-width: 768px) {
    .grid { grid-template-columns: 1fr; }
    header { padding: 32px 0 36px; }
    main { padding: 32px 0 48px; }
    .wrap { padding: 0 16px; }
  }

  @media (prefers-reduced-motion: reduce) {
    * { transition-duration: 0.01ms !important; }
  }
</style>
</head>
<body>
  <header>
    <div class="wrap">
      <p class="eyebrow">${eyebrow}</p>
      <h1 class="brand">WANDERLUST</h1>
      <p class="lede">${lede}</p>
    </div>
  </header>

  <main class="wrap">
    <p class="section-label">Deliverables</p>
    <div class="grid">${cards}</div>

    ${
      extras
        ? `<section class="extras">
             <p class="section-label">Supporting files</p>
             <ul>${extras}</ul>
           </section>`
        : ""
    }

    <p class="hint">${hint}</p>
  </main>

  <footer class="wrap">
    WANDERLUST · Curated Journeys, Crafted for You · built with Unlayer Elements
  </footer>
</body>
</html>`;
}

/* Run directly (the deploy build) — write the static front door. */
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const root = path.join(process.cwd(), "output");
  if (!fs.existsSync(root)) {
    console.error("No output/ directory. Run `npm run render` first.");
    process.exit(1);
  }
  // The favicon is inlined as a data URI inside each rendered page, but the
  // index links to it by URL, so it needs to exist as a file too.
  const favicon = path.join(process.cwd(), "assets", "favicon.svg");
  if (fs.existsSync(favicon)) {
    fs.copyFileSync(favicon, path.join(root, "favicon.svg"));
    console.log("  ok  output/favicon.svg");
  }
  fs.writeFileSync(path.join(root, "index.html"), indexPage(root, { deployed: true }), "utf8");
  console.log("  ok  output/index.html");
}
