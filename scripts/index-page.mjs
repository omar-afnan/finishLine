/**
 * The front door for output/ — the editorial landing page linking to the three
 * deliverables. Layout and palette follow design imgs/landingPage.png.
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
  clay: "#C0623A",
  clayDeep: "#A44F2C",
  clayLight: "#F2E8DD",
  forest: "#1F2A24",
  forestSoft: "#2A352F",
  ink: "#23281F",
  stone: "#7C7360",
  body: "#5F5849",
  bg: "#F4EFE6",
  surface: "#FBF8F2",
  border: "#E3DACB",
  hairline: "#EFE8DC",
  onForestMuted: "#A9B2A6",
  serif: "'Playfair Display', 'Iowan Old Style', Georgia, 'Times New Roman', serif",
  sans: "'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
  mono: "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Consolas, monospace",
};

const svg = (paths, size = 18) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" ` +
  `stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const icons = {
  compass: svg('<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>', 20),
  mail: svg('<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>'),
  globe: svg(
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>'
  ),
  doc: svg('<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z"/><path d="M14 2v6h6"/>'),
  arrow: svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', 15),
  pin: svg('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>', 14),
  upRight: svg('<path d="M7 17 17 7"/><path d="M7 7h10v10"/>', 15),
  instagram: svg('<rect width="20" height="20" x="2" y="2" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>', 16),
  send: svg('<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>', 16),
  world: svg('<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>', 16),
};

/** Photography, mirrored from src/lib/data.ts (`images`). */
const photos = {
  hero: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1200&q=80",
  street: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
  hotel: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
};

/** The three deliverables, in the order they reach a traveller. */
const deliverables = [
  {
    file: "email.html",
    icon: "mail",
    photo: photos.street,
    mode: "Email",
    width: "600px",
    title: "Booking confirmation",
    blurb:
      "Table-based HTML at a fixed 600px, solid colour fills only, with a plain-text part alongside it.",
  },
  {
    file: "page.html",
    icon: "globe",
    photo: photos.hero,
    mode: "Page",
    width: "960px",
    title: "Destination page",
    blurb:
      "Responsive flexbox at 960px. Sticky nav, hero, itinerary timeline, journal and about sections.",
  },
  {
    file: "itinerary.html",
    icon: "doc",
    photo: photos.hotel,
    mode: "Document",
    width: "700px",
    title: "Travel itinerary",
    blurb:
      "Print-ready at 700px with real page-break rules. Hit print, export a clean PDF of the itinerary.",
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
    ? `A single typed data module generates every file below: an email, a destination page and a
       print-ready itinerary, all crafted for the journey ahead.`
    : `A single typed data module generates every file below. These were written by
       <code>npm run render</code> and are served straight from <code>output/</code>.`;

  const present = new Set(fs.readdirSync(root));

  // Only advertise what was actually rendered, so the page never links to a 404.
  const shown = deliverables.filter((d) => present.has(d.file));
  const cards = shown
    .map(
      (d) => `
      <a class="card" href="/${d.file}">
        <span class="card-photo" style="background-image:url('${d.photo}')">
          <span class="card-badge">${icons[d.icon]}</span>
        </span>
        <span class="card-body">
          <span class="card-mode">${esc(d.mode)} (${d.width})</span>
          <span class="card-title">${esc(d.title)}</span>
          <span class="card-blurb">${esc(d.blurb)}</span>
          <span class="card-foot">
            <span class="file">${esc(d.file)} (${kb(root, d.file)})</span>
            <span class="go">Open ${icons.arrow}</span>
          </span>
        </span>
      </a>`
    )
    .join("");

  const known = new Set(deliverables.map((d) => d.file));
  const extraFiles = [...present].filter((f) => !known.has(f) && f !== "index.html").sort();
  const extras = extraFiles
    .map(
      (f) => `
      <li>
        <a href="/${encodeURIComponent(f)}">${esc(f)}</a>
        <span class="size">${kb(root, f)}</span>
      </li>`
    )
    .join("");

  // The hero chip names a real rendered file — the itinerary when it exists.
  const chipFile = present.has("itinerary.html") ? "itinerary.html" : (shown[0]?.file ?? "");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Wanderlust · ${deployed ? "booking suite" : "local preview"}</title>
<meta name="description" content="A luxury travel booking suite built with Unlayer Elements: one React codebase rendering an email, a destination page and a printable itinerary." />
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0;
    background: ${t.bg};
    color: ${t.body};
    font-family: ${t.sans};
    font-size: 14.5px;
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
  }
  a { color: inherit; }
  .wrap { max-width: 1120px; margin: 0 auto; padding: 0 40px; }

  .eyebrow {
    font-family: ${t.mono}; font-size: 11px; font-weight: 500;
    letter-spacing: 0.18em; text-transform: uppercase; color: ${t.clay}; margin: 0;
  }
  .serif { font-family: ${t.serif}; color: ${t.ink}; letter-spacing: -0.01em; }

  /* ---------- top bar ---------- */
  .topbar { border-bottom: 1px solid ${t.border}; }
  .topbar .wrap {
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
    height: 62px;
  }
  .brand { display: inline-flex; align-items: center; gap: 10px; text-decoration: none; }
  .brand .mark { color: ${t.clay}; line-height: 0; }
  .brand .name { font-family: ${t.serif}; font-size: 19px; font-weight: 600; color: ${t.ink}; }
  .navlinks { display: flex; gap: 26px; font-size: 13.5px; color: ${t.stone}; }
  .navlinks a { text-decoration: none; }
  .navlinks a:hover { color: ${t.clay}; }

  /* ---------- hero ---------- */
  .hero {
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
    padding: 96px 0 104px;
  }
  .hero h1 {
    font-family: ${t.serif}; font-weight: 600; color: ${t.ink};
    font-size: 58px; line-height: 1.06; letter-spacing: -0.02em;
    margin: 18px 0 0; max-width: 12ch;
  }
  .hero h1 em { font-style: italic; color: ${t.clay}; }
  .hero p.lede { margin: 26px 0 0; max-width: 42ch; color: ${t.stone}; }
  .hero p.lede code { font-family: ${t.mono}; font-size: 12.5px; color: ${t.body}; }
  .cta-row { display: flex; align-items: center; gap: 22px; flex-wrap: wrap; margin-top: 36px; }
  .btn {
    display: inline-flex; align-items: center; gap: 10px;
    background: ${t.forest}; color: ${t.bg};
    border-radius: 999px; padding: 13px 24px;
    font-size: 14px; font-weight: 500; text-decoration: none;
    transition: background 180ms ease, transform 180ms ease;
  }
  .btn:hover { background: ${t.ink}; transform: translateY(-1px); }
  .btn svg { transition: transform 180ms ease; }
  .btn:hover svg { transform: translateX(3px); }
  .note {
    display: inline-flex; align-items: center; gap: 7px;
    font-size: 12.5px; color: ${t.stone};
  }
  .note svg { color: ${t.clay}; }

  .hero-figure { position: relative; }
  .hero-photo {
    display: block; width: 100%; height: 560px; object-fit: cover;
    border-radius: 20px; background: ${t.clayLight};
    box-shadow: 0 24px 60px rgba(31, 42, 36, 0.14);
  }
  .hero-chip {
    position: absolute; left: -28px; bottom: 42px;
    background: ${t.surface}; border-radius: 12px; padding: 14px 20px;
    box-shadow: 0 12px 30px rgba(31, 42, 36, 0.14);
  }
  .hero-chip .k { font-family: ${t.mono}; font-size: 11px; color: ${t.stone}; display: block; }
  .hero-chip .v { font-family: ${t.serif}; font-size: 17px; color: ${t.ink}; }

  /* ---------- sections ---------- */
  section { padding-bottom: 96px; }
  .section-head {
    display: flex; align-items: baseline; justify-content: space-between; gap: 24px;
    border-bottom: 1px solid ${t.border}; padding-bottom: 18px; margin-bottom: 32px;
  }
  .section-head h2 {
    font-family: ${t.serif}; font-size: 36px; font-weight: 600; color: ${t.ink};
    margin: 0; letter-spacing: -0.02em;
  }
  .count {
    font-family: ${t.mono}; font-size: 11px; letter-spacing: 0.16em;
    text-transform: uppercase; color: ${t.stone}; white-space: nowrap;
  }

  /* ---------- deliverable cards ---------- */
  .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .card {
    display: flex; flex-direction: column; overflow: hidden;
    background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 14px;
    text-decoration: none; color: inherit;
    transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
  }
  .card:hover {
    border-color: ${t.clay};
    box-shadow: 0 16px 34px rgba(31, 42, 36, 0.10);
    transform: translateY(-3px);
  }
  .card:focus-visible { outline: 2px solid ${t.clay}; outline-offset: 3px; }
  .card-photo {
    position: relative; display: block; height: 168px;
    background-size: cover; background-position: center; background-color: ${t.clayLight};
  }
  .card-badge {
    position: absolute; top: 14px; left: 14px;
    display: inline-flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 999px;
    background: ${t.surface}; color: ${t.clay};
  }
  .card-body { display: flex; flex-direction: column; flex: 1; padding: 22px; }
  .card-mode {
    font-family: ${t.mono}; font-size: 10.5px; letter-spacing: 0.16em;
    text-transform: uppercase; color: ${t.stone};
  }
  .card-title {
    font-family: ${t.serif}; font-size: 20px; font-weight: 600; color: ${t.ink}; margin-top: 6px;
  }
  .card-blurb { color: ${t.stone}; font-size: 13.5px; margin-top: 10px; }
  .card-foot {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    margin-top: auto; padding-top: 18px; border-top: 1px solid ${t.hairline};
  }
  .card-foot .file { font-family: ${t.mono}; font-size: 11.5px; color: ${t.stone}; }
  .go {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 13px; font-weight: 500; color: ${t.clay}; white-space: nowrap;
  }
  .go svg { transition: transform 180ms ease; }
  .card:hover .go svg { transform: translateX(3px); }

  /* ---------- supporting files ---------- */
  .files { list-style: none; margin: 0; padding: 0; }
  .files li {
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
    background: ${t.surface}; border: 1px solid ${t.border}; border-radius: 8px;
    padding: 13px 20px; margin-bottom: 8px;
    transition: border-color 160ms ease;
  }
  .files li:hover { border-color: ${t.clay}; }
  .files a { font-family: ${t.mono}; font-size: 13px; color: ${t.ink}; text-decoration: none; }
  .files li:hover a { color: ${t.clay}; }
  .files .size { font-family: ${t.mono}; font-size: 12px; color: ${t.stone}; }

  /* ---------- newsletter band ---------- */
  .band { background: ${t.forest}; color: ${t.onForestMuted}; }
  .band .wrap {
    display: grid; grid-template-columns: 1fr 1fr; gap: 56px; align-items: center;
    padding-top: 72px; padding-bottom: 72px;
  }
  .band h2 {
    font-family: ${t.serif}; font-size: 34px; font-weight: 600; color: ${t.bg};
    margin: 0; line-height: 1.25; letter-spacing: -0.01em; max-width: 16ch;
  }
  .band p { margin: 18px 0 0; font-size: 13.5px; max-width: 44ch; }
  .signup { display: flex; gap: 12px; }
  .signup input {
    flex: 1; min-width: 0;
    background: ${t.forestSoft}; border: 1px solid #3A463F; border-radius: 8px;
    padding: 13px 16px; color: ${t.bg}; font-family: ${t.sans}; font-size: 14px;
  }
  .signup input::placeholder { color: #7E8B82; }
  .signup input:focus { outline: 2px solid ${t.clay}; outline-offset: 1px; border-color: ${t.clay}; }
  .signup button {
    display: inline-flex; align-items: center; gap: 8px;
    background: ${t.clay}; color: #FFF6EF; border: 0; border-radius: 8px;
    padding: 13px 22px; font-family: ${t.sans}; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: background 160ms ease;
  }
  .signup button:hover { background: ${t.clayDeep}; }

  /* ---------- footer ---------- */
  footer { background: ${t.forest}; color: ${t.onForestMuted}; }
  .foot-grid {
    display: grid; grid-template-columns: 1.6fr 1fr 1fr 1fr; gap: 40px;
    padding: 64px 0 56px;
  }
  .foot-brand .name { font-family: ${t.serif}; font-size: 19px; color: ${t.bg}; }
  .foot-brand p { margin: 16px 0 0; font-size: 13px; max-width: 34ch; }
  .socials { display: flex; gap: 10px; margin-top: 22px; }
  .socials span {
    display: inline-flex; align-items: center; justify-content: center;
    width: 34px; height: 34px; border-radius: 999px;
    border: 1px solid #3A463F; color: ${t.onForestMuted};
  }
  .foot-col h3 {
    font-family: ${t.mono}; font-size: 10.5px; font-weight: 500; letter-spacing: 0.18em;
    text-transform: uppercase; color: #808E84; margin: 0 0 18px;
  }
  .foot-col ul { list-style: none; margin: 0; padding: 0; }
  .foot-col li { margin-bottom: 10px; }
  .foot-col a { font-size: 13.5px; color: ${t.bg}; text-decoration: none; opacity: 0.86; }
  .foot-col a:hover { color: ${t.clay}; opacity: 1; }
  .foot-bottom {
    border-top: 1px solid #2E3A33;
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
    padding: 22px 0; font-size: 12px;
  }
  .foot-bottom nav { display: flex; gap: 22px; }
  .foot-bottom a { text-decoration: none; }
  .foot-bottom a:hover { color: ${t.clay}; }

  @media (max-width: 960px) {
    .hero { grid-template-columns: 1fr; gap: 48px; padding: 56px 0 64px; }
    .hero h1 { font-size: 44px; max-width: none; }
    .hero-photo { height: 380px; }
    .hero-chip { left: 20px; bottom: 20px; }
    .grid { grid-template-columns: 1fr; }
    .band .wrap { grid-template-columns: 1fr; gap: 32px; }
    .foot-grid { grid-template-columns: 1fr 1fr; gap: 32px; }
  }
  @media (max-width: 620px) {
    .wrap { padding: 0 20px; }
    .hero h1 { font-size: 36px; }
    .section-head h2 { font-size: 28px; }
    .navlinks { display: none; }
    .signup { flex-direction: column; }
    .foot-grid { grid-template-columns: 1fr; }
    .foot-bottom { flex-direction: column; align-items: flex-start; gap: 12px; }
  }
  @media (prefers-reduced-motion: reduce) {
    * { transition-duration: 0.01ms !important; }
  }
</style>
</head>
<body>
  <div class="topbar">
    <div class="wrap">
      <a class="brand" href="/">
        <span class="mark">${icons.compass}</span>
        <span class="name">Wanderlust</span>
      </a>
      <nav class="navlinks">
        <a href="#deliverables">Deliverables</a>
        <a href="#files">Files</a>
        <a href="/page.html">Destination</a>
      </nav>
    </div>
  </div>

  <div class="wrap">
    <section class="hero">
      <div>
        <p class="eyebrow">${esc(eyebrow)}</p>
        <h1>One booking, rendered three <em>beautiful</em> ways.</h1>
        <p class="lede">${lede}</p>
        <div class="cta-row">
          <a class="btn" href="#deliverables">Explore deliverables ${icons.arrow}</a>
          <span class="note">${icons.pin} No build step, no client JS</span>
        </div>
      </div>
      <figure class="hero-figure" style="margin:0">
        <img class="hero-photo" src="${photos.hero}" alt="Tokyo at dusk" />
        <figcaption class="hero-chip">
          <span class="k">${esc(chipFile)}</span>
          <span class="v">6 nights, Tokyo</span>
        </figcaption>
      </figure>
    </section>

    <section id="deliverables">
      <div class="section-head">
        <h2>Deliverables</h2>
        <span class="count">${shown.length} ${shown.length === 1 ? "file" : "files"}</span>
      </div>
      <div class="grid">${cards}</div>
    </section>

    ${
      extras
        ? `<section id="files">
             <div class="section-head">
               <h2>Supporting files</h2>
               <span class="count">${extraFiles.length} ${extraFiles.length === 1 ? "item" : "items"}</span>
             </div>
             <ul class="files">${extras}</ul>
           </section>`
        : ""
    }

  </div>

  <div class="band">
    <div class="wrap">
      <div>
        <h2>Postcards from the road, twice a month.</h2>
        <p>Route notes, hidden stays, and first access to new expeditions. No noise, just the good stuff.</p>
      </div>
      <form class="signup" action="https://wanderlust.example.com/subscribe" method="post">
        <label for="email" hidden>Email address</label>
        <input id="email" name="email" type="email" placeholder="you@example.com" required />
        <button type="submit">Subscribe ${icons.upRight}</button>
      </form>
    </div>
  </div>

  <footer>
    <div class="wrap">
      <div class="foot-grid">
        <div class="foot-brand">
          <a class="brand" href="/">
            <span class="mark">${icons.compass}</span>
            <span class="name">Wanderlust</span>
          </a>
          <p>Curated journeys, crafted for the way you actually want to travel: slow, considered, and unmistakably yours.</p>
          <div class="socials">
            <span>${icons.instagram}</span>
            <span>${icons.send}</span>
            <span>${icons.world}</span>
          </div>
        </div>
        <div class="foot-col">
          <h3>Deliverables</h3>
          <ul>
            <li><a href="/email.html">Booking confirmation</a></li>
            <li><a href="/page.html">Destination page</a></li>
            <li><a href="/itinerary.html">Travel itinerary</a></li>
            <li><a href="/email.txt">Plain-text email</a></li>
          </ul>
        </div>
        <div class="foot-col">
          <h3>Source</h3>
          <ul>
            <li><a href="#files">Design JSON</a></li>
            <li><a href="#deliverables">Render modes</a></li>
            <li><a href="/favicon.svg">Brand mark</a></li>
          </ul>
        </div>
        <div class="foot-col">
          <h3>Built with</h3>
          <ul>
            <li><a href="https://elements.unlayer.com">Unlayer Elements</a></li>
            <li><a href="https://react.dev">React</a></li>
            <li><a href="https://www.typescriptlang.org">TypeScript</a></li>
          </ul>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© ${new Date().getFullYear()} WANDERLUST Inc. Curated Journeys, Crafted for You.</span>
        <nav>
          <a href="https://wanderlust.example.com/privacy">Privacy</a>
          <a href="https://wanderlust.example.com/terms">Terms</a>
          <a href="https://wanderlust.example.com/contact">Contact</a>
        </nav>
      </div>
    </div>
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
  // The printed itinerary as a real PDF, so the Download PDF buttons resolve.
  // Generated by `npm run pdf` (needs a local Chrome or Edge) and committed,
  // because the deploy host has no browser to produce it.
  const pdf = path.join(process.cwd(), "assets", "itinerary.pdf");
  if (fs.existsSync(pdf)) {
    fs.copyFileSync(pdf, path.join(root, "itinerary.pdf"));
    console.log("  ok  output/itinerary.pdf");
  } else {
    console.warn("  --  assets/itinerary.pdf missing. Run `npm run pdf` to generate it.");
  }
  fs.writeFileSync(path.join(root, "index.html"), indexPage(root, { deployed: true }), "utf8");
  console.log("  ok  output/index.html");
}
