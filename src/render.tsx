/**
 * Renders every template to static HTML in /output:
 * - email.html      (<Email> mode — Outlook/Gmail-safe tables)
 * - email.txt       (plain-text MIME part via renderToPlainText)
 * - page.html       (<Page> mode — responsive flexbox web page)
 * - certificate.html (<Document> mode — print/PDF-ready)
 * - *.design.json   (editor-compatible design JSON via renderToJson)
 */
import fs from "node:fs";
import path from "node:path";
import { renderToHtml, renderToPlainText, renderToJson } from "@unlayer/react-elements";
import ResultsEmail from "./templates/ResultsEmail";
import ResultsPage from "./templates/ResultsPage";
import FinisherCertificate from "./templates/FinisherCertificate";
import { raceData } from "./lib/data";
import { fonts } from "./lib/theme";

const outDir = path.join(process.cwd(), "output");
fs.mkdirSync(outDir, { recursive: true });

const fontsOption = [{ url: fonts.googleFontsUrl }];
const { event, runner } = raceData;

// Self-contained favicon: embed the SVG as a data URI so each HTML file
// stays standalone (renderToHtml has no favicon option, so we inject it).
const faviconSvg = fs.readFileSync(path.join(process.cwd(), "assets", "favicon.svg"), "utf8");
const faviconLink = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(
  faviconSvg
)}" />`;

function withFavicon(html: string): string {
  return html.includes("</head>")
    ? html.replace("</head>", `${faviconLink}</head>`)
    : html.replace("<head>", `<head>${faviconLink}`);
}

const targets = [
  {
    name: "email",
    element: <ResultsEmail />,
    title: `Your official ${event.name} result`,
    mode: "email" as const,
  },
  {
    name: "page",
    element: <ResultsPage />,
    title: `${runner.firstName} ${runner.lastName} — ${event.name} Results`,
    mode: "web" as const,
  },
  {
    name: "certificate",
    element: <FinisherCertificate />,
    title: `${event.name} — Finisher Certificate`,
    mode: "document" as const,
  },
];

for (const t of targets) {
  const html = withFavicon(renderToHtml(t.element, { title: t.title, fonts: fontsOption }));
  fs.writeFileSync(path.join(outDir, `${t.name}.html`), html, "utf8");

  const design = renderToJson(t.element);
  fs.writeFileSync(
    path.join(outDir, `${t.name}.design.json`),
    JSON.stringify(design, null, 2),
    "utf8"
  );
  console.log(`  ✔ output/${t.name}.html  (+ ${t.name}.design.json)`);
}

// Plain-text MIME part for the email — critical for deliverability.
const text = renderToPlainText(<ResultsEmail />);
fs.writeFileSync(path.join(outDir, "email.txt"), text, "utf8");
console.log("  ✔ output/email.txt");

console.log("\n✅ All templates rendered from one shared data source.");
