/**
 * WANDERLUST design tokens.
 *
 * One visual language shared by all three render modes (email, page, document).
 * Values come straight from the brand brief, so treat this file as the single
 * source of truth: never hardcode a hex or a font size inside a template.
 */

export const colors = {
  /** Core brand teal. Primary actions, active states, section labels. */
  teal: "#0D9488",
  /** Deeper teal for hover states and dark teal surfaces. */
  tealDeep: "#0B7A70",
  /** Tinted teal surface. Featured cards, badges, hero wash. */
  tealLight: "#F0FDFA",
  /** Authority colour. Headings, nav, table headers, footer. */
  navy: "#0F172A",
  /** Secondary text. Softens the interface without losing contrast. */
  warmGray: "#64748B",
  /** Body copy. Slightly darker than warmGray for long-form reading. */
  body: "#334155",
  /** Level 0 canvas behind white cards. */
  bg: "#F8FAFC",
  /** Level 1 surface. */
  white: "#FFFFFF",
  /** Confirmed / paid states. */
  success: "#059669",
  /** High-energy accent. CTAs and stamps only, never large fills. */
  coral: "#E85D04",
  /** 1px card and table borders. */
  border: "#E2E8F0",
  /** Hairline separators inside lists. */
  hairline: "#F1F5F9",
  /** Muted text on navy surfaces. */
  onNavyMuted: "#94A3B8",
} as const;

/**
 * Type scale. Every size is a string so it can be dropped straight into a
 * style attribute or an Elements `fontSize` prop.
 */
export const type = {
  h1: { size: "28px", weight: 700, line: "34px", spacing: "-0.02em" },
  h2: { size: "22px", weight: 600, line: "29px", spacing: "-0.01em" },
  h3: { size: "16px", weight: 600, line: "22px", spacing: "0" },
  /** Uppercase eyebrow / section label. */
  label: { size: "11px", weight: 700, line: "16px", spacing: "1px" },
  body: { size: "14px", weight: 400, line: "22px", spacing: "0" },
  small: { size: "12px", weight: 400, line: "18px", spacing: "0" },
  /** Print floor. Nothing in the PDF goes below this. */
  print: { size: "11px", weight: 400, line: "16px", spacing: "0" },
} as const;

/** 4px base scale. Section gaps use the 24 / 48 / 64 steps to hold the negative space. */
export const space = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "48px",
  section: "64px",
} as const;

export const radius = {
  sm: "4px",
  /** Buttons and cards. */
  md: "8px",
  /** Images and feature cards. */
  lg: "12px",
  /** Badges and chips only. */
  pill: "9999px",
} as const;

/** Ambient shadow. Keeps floating surfaces light rather than heavy. */
export const shadow = {
  ambient: "0 4px 20px rgba(15, 23, 42, 0.05)",
  nav: "0 1px 3px rgba(15, 23, 42, 0.06)",
} as const;

export const fonts = {
  /** Inter throughout. Hierarchy comes from weight and casing, not typeface. */
  body: "'Inter', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif",
  /** Monospace for confirmation codes, so digits line up and read as data. */
  mono: "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Consolas, monospace",
  googleFontsUrl:
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap",
} as const;

/** Layout widths per render mode. */
export const widths = {
  email: "600px",
  page: "960px",
  document: "700px",
} as const;

/** Reusable per-side border object for Elements `border` props. */
export function hairlineBorder(color: string = colors.border, width: string = "1px") {
  return {
    borderTopWidth: width,
    borderRightWidth: width,
    borderBottomWidth: width,
    borderLeftWidth: width,
    borderTopColor: color,
    borderRightColor: color,
    borderBottomColor: color,
    borderLeftColor: color,
    borderTopStyle: "solid",
    borderRightStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
  };
}
