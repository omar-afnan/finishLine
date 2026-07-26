/** Shared visual language for all three render modes. */

export const colors = {
  ink: "#101828", // near-black slate
  slate: "#475467",
  faint: "#98a2b3",
  paper: "#ffffff",
  mist: "#f4f6f8", // page/email background
  line: "#e4e7ec",
  accent: "#e8590c", // race-day orange
  accentDark: "#c2410c",
  night: "#0b1526", // dark hero panels
  gold: "#b98900",
} as const;

export const fonts = {
  // Loaded via renderToHtml's `fonts` option; stacks fall back to system fonts.
  display: "'Sora', 'Segoe UI', Helvetica, Arial, sans-serif",
  body: "'Inter', 'Segoe UI', Helvetica, Arial, sans-serif",
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
} as const;
