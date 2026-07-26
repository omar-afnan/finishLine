/**
 * Renders every template to static HTML in /output.
 *
 *   email.html      <Email> — table-based, client-safe
 *   email.txt       renderToPlainText — the text/plain MIME part
 *   page.html       <Page> — responsive web page
 *   itinerary.html  <Document> — print-ready, opens the browser print dialog
 *   contact.html    <Page> — contact index, per design imgs/contactPage.png
 *   privacy.html    <Page> — privacy policy, same shell as terms
 *   terms.html      <Page> — terms of service
 *   *.design.json   renderToJson — editor-compatible design JSON
 *
 * renderToHtml owns the document shell and has no hook for custom CSS, so the
 * stylesheets and the favicon are injected into <head> after the fact.
 */
import fs from "node:fs";
import path from "node:path";
import { renderToHtml, renderToPlainText, renderToJson } from "@unlayer/react-elements";
import BookingEmail from "./templates/BookingEmail";
import DestinationPage from "./templates/DestinationPage";
import ItineraryDocument from "./templates/ItineraryDocument";
import ContactPage from "./templates/ContactPage";
import LegalPage from "./templates/LegalPage";
import { brand, booking, trip } from "./lib/data";
import { fonts } from "./lib/theme";
import { pageCss, documentCss, printBar } from "./styles";

const outDir = path.join(process.cwd(), "output");
fs.mkdirSync(outDir, { recursive: true });

const fontsOption = [{ url: fonts.googleFontsUrl }];

// Self-contained favicon: the SVG is embedded as a data URI so each HTML file
// stays standalone.
const faviconSvg = fs.readFileSync(path.join(process.cwd(), "assets", "favicon.svg"), "utf8");
const faviconLink = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,${encodeURIComponent(
  faviconSvg
)}" />`;

/** Injects the favicon and, when given, a stylesheet into <head>. */
function injectHead(html: string, css?: string): string {
  const head = faviconLink + (css ? `<style>${css}</style>` : "");
  return html.includes("</head>") ? html.replace("</head>", `${head}</head>`) : html.replace("<head>", `<head>${head}`);
}

/** Wraps the document body in the print sheet and prepends the print control. */
function wrapDocument(html: string): string {
  return html
    .replace(/(<body[^>]*>)/i, `$1${printBar}<div class="wl-sheet">`)
    .replace(/(<\/body>)/i, `</div>$1`);
}

interface Target {
  name: string;
  element: React.ReactElement;
  title: string;
  css?: string;
  transform?: (html: string) => string;
}

const targets: Target[] = [
  {
    name: "email",
    element: <BookingEmail />,
    title: `${trip.destination} is confirmed · ${booking.reference}`,
  },
  {
    name: "page",
    element: <DestinationPage />,
    title: `${trip.destination} · ${trip.dates} · ${brand.name}`,
    css: pageCss,
  },
  {
    name: "itinerary",
    element: <ItineraryDocument />,
    title: `Travel itinerary ${booking.reference} · ${brand.name}`,
    css: documentCss,
    transform: wrapDocument,
  },
  {
    name: "contact",
    element: <ContactPage />,
    title: `Concierge & Support · ${brand.name}`,
    css: pageCss,
  },
  {
    name: "privacy",
    element: <LegalPage page="privacy" />,
    title: `Privacy Policy · ${brand.name}`,
    css: pageCss,
  },
  {
    name: "terms",
    element: <LegalPage page="terms" />,
    title: `Terms of Service · ${brand.name}`,
    css: pageCss,
  },
];

for (const t of targets) {
  let html = renderToHtml(t.element, { title: t.title, fonts: fontsOption });
  html = injectHead(html, t.css);
  if (t.transform) html = t.transform(html);
  fs.writeFileSync(path.join(outDir, `${t.name}.html`), html, "utf8");

  const design = renderToJson(t.element);
  fs.writeFileSync(path.join(outDir, `${t.name}.design.json`), JSON.stringify(design, null, 2), "utf8");
  console.log(`  ok  output/${t.name}.html  (+ ${t.name}.design.json)`);
}

// Plain-text MIME part for the email. Real ESPs expect it and deliverability
// suffers without it.
fs.writeFileSync(path.join(outDir, "email.txt"), renderToPlainText(<BookingEmail />), "utf8");
console.log("  ok  output/email.txt");

console.log("\nAll templates rendered from one shared data source.");
