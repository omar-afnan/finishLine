/**
 * Inline SVG icon set. 2px stroke, no fills, 24x24 viewBox.
 *
 * Two reasons these are raw strings rather than components:
 *   1. The custom Elements tools build HTML strings, so they need markup, not JSX.
 *   2. Email clients drop external images behind privacy proxies. Inline SVG
 *      survives in Apple Mail and web clients, and the surrounding text label
 *      carries the meaning everywhere else.
 *
 * Emoji are deliberately not used as icons: they render differently on every
 * platform and carry no accessible name.
 */

type IconName =
  | "plane"
  | "planeTakeoff"
  | "bed"
  | "compass"
  | "utensils"
  | "car"
  | "calendar"
  | "calendarOut"
  | "check"
  | "checkCircle"
  | "mapPin"
  | "phone"
  | "mail"
  | "thermometer"
  | "clock"
  | "coins"
  | "info"
  | "building"
  | "globe"
  | "arrowRight"
  | "printer"
  | "sun";

/** Path data only. Stroke, size and colour are applied by `icon()`. */
const paths: Record<IconName, string> = {
  plane:
    '<path d="M17.8 19.2 16 11l3.5-3.5a2.1 2.1 0 0 0-3-3L13 8 4.8 6.2a.5.5 0 0 0-.5.8l3.2 3.7-2.1 2.1-1.6-.4a.5.5 0 0 0-.5.8L5 15.5 6.5 18l1.3-1.9a.5.5 0 0 0 .8-.5l-.4-1.6 2.1-2.1 3.7 3.2a.5.5 0 0 0 .8-.5Z"/>',
  planeTakeoff:
    '<path d="M2 22h20"/><path d="M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.2Z"/>',
  bed: '<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',
  compass:
    '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
  utensils:
    '<path d="M3 2v7c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18.4 7.6A2 2 0 0 0 16.5 6h-9a2 2 0 0 0-1.9 1.6L3.5 11.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  calendar:
    '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/><path d="M8 2v4"/><path d="M16 2v4"/>',
  calendarOut:
    '<path d="M8 2v4"/><path d="M16 2v4"/><path d="M21 11V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6"/><path d="M3 10h18"/><path d="m17 22 4-4-4-4"/><path d="M21 18h-7"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  checkCircle: '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  mapPin:
    '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  phone:
    '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2Z"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  thermometer:
    '<path d="M14 4v10.5a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  coins:
    '<circle cx="8" cy="8" r="6"/><path d="M18.1 6.6A6 6 0 1 1 15.4 18"/><path d="M7 6h1v4"/><path d="m16.7 13.6-.6.4h2"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  building:
    '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>',
  globe:
    '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  arrowRight: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  printer:
    '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect width="12" height="8" x="6" y="14"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>',
};

/**
 * Returns an inline SVG string.
 *
 * @param name   Icon key.
 * @param color  Stroke colour (defaults to currentColor so it inherits).
 * @param size   Square px size.
 * @param title  Accessible name. Omit for icons that sit next to a text label,
 *               which is the common case: a duplicated name is noise for
 *               screen readers, so those get `aria-hidden`.
 */
export function icon(
  name: IconName,
  color: string = "currentColor",
  size: number = 20,
  title?: string
): string {
  const a11y = title
    ? `role="img" aria-label="${title}"`
    : 'aria-hidden="true" focusable="false"';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" ` +
    `fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ` +
    `${a11y} style="display:inline-block;vertical-align:middle;">${paths[name]}</svg>`
  );
}

/** Data URI form, for the few places that need an `src` rather than markup. */
export function iconDataUri(name: IconName, color: string = "#0D9488", size: number = 24): string {
  return `data:image/svg+xml,${encodeURIComponent(icon(name, color, size))}`;
}

/** Icon assigned to each itinerary activity type. */
export const activityIcon: Record<string, IconName> = {
  transfer: "car",
  tour: "compass",
  dining: "utensils",
  flight: "planeTakeoff",
  hotel: "bed",
  free: "sun",
};

export type { IconName };
