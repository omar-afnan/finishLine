/**
 * Custom Elements tools, registered with the same config shape the Unlayer
 * editor uses for `unlayer.registerTool`, so anything here can be dropped into
 * the visual editor later.
 *
 * Each tool ships its own exporter per render mode:
 *   - `email`    bulletproof nested tables, bgcolor fallbacks, no flexbox
 *   - `web`      flexbox divs with hover-friendly markup
 *   - `document` falls back to `web` unless print needs something different
 *
 * That split is the whole point: one JSX call site, three correct outputs.
 */
import { registerTool } from "@unlayer/react-elements";
import { colors, fonts, radius, type } from "./theme";
import { icon, activityIcon, type IconName } from "./icons";

/* ------------------------------------------------------------------ *
 * Shared style fragments
 * ------------------------------------------------------------------ */

const base = `font-family:${fonts.body};`;
const labelStyle =
  `${base}font-size:${type.label.size};line-height:${type.label.line};font-weight:${type.label.weight};` +
  `letter-spacing:${type.label.spacing};text-transform:uppercase;`;
const bodyStyle = `${base}font-size:${type.body.size};line-height:${type.body.line};color:${colors.body};`;
const smallStyle = `${base}font-size:${type.small.size};line-height:${type.small.line};color:${colors.warmGray};`;
const cardStyle = `background:${colors.white};border:1px solid ${colors.border};border-radius:${radius.md};`;

/** Escapes text that lands inside an attribute or markup context. */
function esc(s: unknown): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ------------------------------------------------------------------ *
 * SectionLabel — the uppercase teal eyebrow above each block
 * ------------------------------------------------------------------ */

export const SectionLabel = registerTool({
  name: "wl_section_label",
  values: { text: "", color: colors.teal, align: "left" },
  renderer: {
    exporters: {
      email: (v) =>
        `<div style="${labelStyle}color:${esc(v.color)};text-align:${esc(v.align)};">${esc(v.text)}</div>`,
      web: (v) =>
        `<div style="${labelStyle}color:${esc(v.color)};text-align:${esc(v.align)};">${esc(v.text)}</div>`,
    },
  },
});

/* ------------------------------------------------------------------ *
 * SplitRow — two items pushed to opposite edges
 *
 * Elements columns each carry their own background, so a two-up layout
 * *inside* a single card needs to happen within one column. This does that:
 * a table in email, flexbox on the web, and it stacks on narrow screens.
 * ------------------------------------------------------------------ */

export const SplitRow = registerTool({
  name: "wl_split_row",
  values: { left: "", right: "", valign: "middle", gap: "16px" },
  renderer: {
    exporters: {
      email: (v) => `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="left" valign="${esc(v.valign)}">${v.left}</td>
            <td align="right" valign="${esc(v.valign)}" style="padding-left:${esc(v.gap)};">${v.right}</td>
          </tr>
        </table>`,
      web: (v) => `
        <div class="wl-split" style="display:flex;justify-content:space-between;align-items:${v.valign === "middle" ? "center" : String(v.valign)
        };gap:${esc(v.gap)};flex-wrap:wrap;">
          <div style="min-width:0;">${v.left}</div>
          <div style="min-width:0;text-align:right;">${v.right}</div>
        </div>`,
    },
  },
});

/* ------------------------------------------------------------------ *
 * TripTimeline — SFO to NRT to stay to NRT to SFO
 * ------------------------------------------------------------------ */

type Leg = { code: string; label: string; state: "done" | "current" | "upcoming" };

const dotColor = (state: Leg["state"]) =>
  state === "upcoming" ? colors.border : state === "current" ? colors.teal : colors.tealDeep;

export const TripTimeline = registerTool({
  name: "wl_trip_timeline",
  values: { legs: [] as unknown as Leg[] },
  renderer: {
    exporters: {
      // Email: one table row of alternating dot cells and rule cells, with a
      // matching label row underneath. Percentage widths keep it fluid.
      email: (v) => {
        const legs = (v.legs ?? []) as Leg[];
        const dots = legs
          .map((leg, i) => {
            const rule =
              i < legs.length - 1
                ? `<td style="padding:0 4px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="${colors.border}" style="font-size:0;line-height:0;background-color:${colors.border};">&nbsp;</td></tr></table></td>`
                : "";
            return (
              `<td width="12" style="padding:0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>` +
              `<td width="12" height="12" bgcolor="${dotColor(leg.state)}" style="background-color:${dotColor(
                leg.state
              )};border-radius:6px;font-size:0;line-height:0;">&nbsp;</td>` +
              `</tr></table></td>${rule}`
            );
          })
          .join("");
        const labels = legs
          .map((leg, i) => {
            const align = i === 0 ? "left" : i === legs.length - 1 ? "right" : "center";
            return `<td align="${align}" style="${base}font-size:10px;line-height:14px;font-weight:700;letter-spacing:0.6px;color:${leg.state === "upcoming" ? colors.warmGray : colors.navy
              };padding-top:10px;white-space:nowrap;">${esc(leg.code)}</td>`;
          })
          .join("");
        return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>${dots}</tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>${labels}</tr>
          </table>`;
      },
      // Web: flex, with the connecting rule as a flexible sibling so the beads
      // spread evenly at any width.
      web: (v) => {
        const legs = (v.legs ?? []) as Leg[];
        const beads = legs
          .map((leg, i) => {
            const rule =
              i < legs.length - 1
                ? `<span style="flex:1 1 auto;height:1px;background:${colors.border};margin:0 6px;"></span>`
                : "";
            return (
              `<span style="width:12px;height:12px;border-radius:50%;background:${dotColor(
                leg.state
              )};flex:0 0 12px;"></span>${rule}`
            );
          })
          .join("");
        const labels = legs
          .map((leg, i) => {
            const align = i === 0 ? "left" : i === legs.length - 1 ? "right" : "center";
            return `<span style="flex:1 1 0;text-align:${align};${base}font-size:10px;line-height:14px;font-weight:700;letter-spacing:0.6px;color:${leg.state === "upcoming" ? colors.warmGray : colors.navy
              };">${esc(leg.code)}</span>`;
          })
          .join("");
        return `
          <div class="wl-timeline">
            <div style="display:flex;align-items:center;">${beads}</div>
            <div style="display:flex;margin-top:10px;">${labels}</div>
          </div>`;
      },
    },
  },
});

/* ------------------------------------------------------------------ *
 * IconTile — one cell of the inclusions grid
 * ------------------------------------------------------------------ */

export const IconTile = registerTool({
  name: "wl_icon_tile",
  values: { icon: "plane", label: "", detail: "" },
  renderer: {
    exporters: {
      email: (v) => `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${cardStyle}">
          <tr><td align="center" style="padding:16px 8px;">
            <div style="line-height:0;">${icon(v.icon as IconName, colors.teal, 24)}</div>
            <div style="${labelStyle}color:${colors.navy};padding-top:10px;">${esc(v.label)}</div>
            ${v.detail ? `<div style="${smallStyle}padding-top:3px;">${esc(v.detail)}</div>` : ""}
          </td></tr>
        </table>`,
      web: (v) => `
        <div style="${cardStyle}padding:20px 12px;text-align:center;height:100%;box-sizing:border-box;">
          <div style="line-height:0;">${icon(v.icon as IconName, colors.teal, 26)}</div>
          <div style="${labelStyle}color:${colors.navy};margin-top:12px;">${esc(v.label)}</div>
          ${v.detail ? `<div style="${smallStyle}margin-top:4px;">${esc(v.detail)}</div>` : ""}
        </div>`,
    },
  },
});

/* ------------------------------------------------------------------ *
 * FlightLeg — one flight row
 * ------------------------------------------------------------------ */

export const FlightLeg = registerTool({
  name: "wl_flight_leg",
  values: {
    direction: "",
    airline: "",
    number: "",
    fromCode: "",
    fromCity: "",
    toCode: "",
    toCity: "",
    departTime: "",
    departDate: "",
    duration: "",
    cabin: "",
  },
  renderer: {
    exporters: {
      email: (v) => `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="${cardStyle}">
          <tr><td style="padding:18px 20px;border-left:3px solid ${colors.teal};border-top-left-radius:${radius.md};border-bottom-left-radius:${radius.md};">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="left" style="${labelStyle}color:${colors.warmGray};padding-bottom:8px;">${esc(v.direction)}</td>
                <td align="right" style="padding-bottom:8px;">
                  <span style="display:inline-block;background-color:${colors.tealLight};border-radius:${radius.pill};padding:4px 10px;${labelStyle}color:${colors.teal};">${esc(v.cabin)}</span>
                </td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td align="left" valign="middle" style="${base}font-size:${type.h3.size};line-height:${type.h3.line};font-weight:700;color:${colors.navy};">
                  ${esc(v.airline)} ${esc(v.number)}
                </td>
                <td align="right" valign="middle" style="${base}font-size:13px;line-height:18px;font-weight:600;color:${colors.navy};white-space:nowrap;">
                  ${esc(v.departTime)}<br /><span style="${smallStyle}font-weight:400;">${esc(v.departDate)}</span>
                </td>
              </tr>
            </table>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="padding-top:8px;">
              <tr>
                <td style="${base}font-size:13px;color:${colors.body};">${esc(v.fromCity)} (${esc(v.fromCode)})</td>
                <td style="padding:0 8px;line-height:0;">${icon("arrowRight", colors.teal, 14)}</td>
                <td style="${base}font-size:13px;color:${colors.body};">${esc(v.toCity)} (${esc(v.toCode)})</td>
              </tr>
            </table>
            <div style="${smallStyle}padding-top:6px;">Duration ${esc(v.duration)}</div>
          </td></tr>
        </table>`,
      web: (v) => `
        <div class="wl-flight" style="${cardStyle}border-left:3px solid ${colors.teal};padding:20px 22px;">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;">
            <span style="${labelStyle}color:${colors.warmGray};">${esc(v.direction)}</span>
            <span style="background:${colors.tealLight};color:${colors.teal};border-radius:${radius.pill};padding:4px 10px;${labelStyle}">${esc(v.cabin)}</span>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin-top:10px;">
            <div>
              <div style="${base}font-size:${type.h3.size};line-height:${type.h3.line};font-weight:700;color:${colors.navy};">${esc(v.airline)} ${esc(v.number)}</div>
              <div style="display:flex;align-items:center;gap:8px;margin-top:6px;${base}font-size:13px;color:${colors.body};">
                <span>${esc(v.fromCity)} (${esc(v.fromCode)})</span>
                ${icon("arrowRight", colors.teal, 14)}
                <span>${esc(v.toCity)} (${esc(v.toCode)})</span>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="${base}font-size:14px;font-weight:600;color:${colors.navy};">${esc(v.departTime)}</div>
              <div style="${smallStyle}">${esc(v.departDate)} · ${esc(v.duration)}</div>
            </div>
          </div>
        </div>`,
    },
  },
});

/* ------------------------------------------------------------------ *
 * DetailRow — icon + label + value, used for check-in / check-out
 * ------------------------------------------------------------------ */

export const DetailRow = registerTool({
  name: "wl_detail_row",
  values: { items: [] as unknown as Array<{ icon: string; label: string; value: string }> },
  renderer: {
    exporters: {
      email: (v) => {
        const items = (v.items ?? []) as Array<{ icon: string; label: string; value: string }>;
        const cells = items
          .map(
            (it) => `
            <td valign="top" style="padding-right:18px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="line-height:0;padding-right:7px;">${icon(it.icon as IconName, colors.teal, 16)}</td>
                  <td valign="middle" style="${smallStyle}">${esc(it.label)}</td>
                </tr>
              </table>
              <div style="${base}font-size:13px;line-height:18px;font-weight:600;color:${colors.navy};padding-top:3px;">${esc(it.value)}</div>
            </td>`
          )
          .join("");
        return `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>${cells}</tr></table>`;
      },
      web: (v) => {
        const items = (v.items ?? []) as Array<{ icon: string; label: string; value: string }>;
        const cells = items
          .map(
            (it) => `
            <div style="min-width:120px;">
              <div style="display:flex;align-items:center;gap:7px;${smallStyle}">
                ${icon(it.icon as IconName, colors.teal, 16)}<span>${esc(it.label)}</span>
              </div>
              <div style="${base}font-size:13px;line-height:18px;font-weight:600;color:${colors.navy};margin-top:3px;">${esc(it.value)}</div>
            </div>`
          )
          .join("");
        return `<div style="display:flex;flex-wrap:wrap;gap:20px;">${cells}</div>`;
      },
    },
  },
});

/* ------------------------------------------------------------------ *
 * PriceTable — subtotal / taxes / total
 * ------------------------------------------------------------------ */

export const PriceTable = registerTool({
  name: "wl_price_table",
  values: {
    rows: [] as unknown as Array<{ label: string; value: string }>,
    totalLabel: "Total",
    totalValue: "",
    note: "",
  },
  renderer: {
    exporters: {
      email: (v) => {
        const rows = (v.rows ?? []) as Array<{ label: string; value: string }>;
        const body = rows
          .map(
            (r) => `
            <tr>
              <td align="left" style="${bodyStyle}padding:6px 0;">${esc(r.label)}</td>
              <td align="right" style="${bodyStyle}padding:6px 0;font-weight:600;color:${colors.navy};">${esc(r.value)}</td>
            </tr>`
          )
          .join("");
        return `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            ${body}
            <tr><td colspan="2" style="padding:10px 0 0;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="1" bgcolor="${colors.border}" style="font-size:0;line-height:0;background-color:${colors.border};">&nbsp;</td></tr></table></td></tr>
            <tr>
              <td align="left" style="${labelStyle}color:${colors.navy};padding-top:12px;">${esc(v.totalLabel)}</td>
              <td align="right" style="${base}font-size:${type.h2.size};line-height:${type.h2.line};font-weight:700;color:${colors.navy};padding-top:12px;">${esc(v.totalValue)}</td>
            </tr>
            ${v.note ? `<tr><td colspan="2" style="${smallStyle}padding-top:8px;">${esc(v.note)}</td></tr>` : ""}
          </table>`;
      },
      web: (v) => {
        const rows = (v.rows ?? []) as Array<{ label: string; value: string }>;
        const body = rows
          .map(
            (r) => `
            <div style="display:flex;justify-content:space-between;padding:6px 0;${bodyStyle}">
              <span>${esc(r.label)}</span>
              <span style="font-weight:600;color:${colors.navy};">${esc(r.value)}</span>
            </div>`
          )
          .join("");
        return `
          <div>
            ${body}
            <div style="height:1px;background:${colors.border};margin:10px 0 0;"></div>
            <div style="display:flex;justify-content:space-between;align-items:baseline;padding-top:12px;">
              <span style="${labelStyle}color:${colors.navy};">${esc(v.totalLabel)}</span>
              <span style="${base}font-size:${type.h2.size};line-height:${type.h2.line};font-weight:700;color:${colors.navy};">${esc(v.totalValue)}</span>
            </div>
            ${v.note ? `<div style="${smallStyle}margin-top:8px;">${esc(v.note)}</div>` : ""}
          </div>`;
      },
    },
  },
});

/* ------------------------------------------------------------------ *
 * HeroBanner — full bleed image with a bottom scrim
 *
 * Web only by design. The email never puts text over an image, and the
 * printed itinerary carries no background art at all.
 * ------------------------------------------------------------------ */

export const HeroBanner = registerTool({
  name: "wl_hero_banner",
  values: {
    image: "",
    alt: "",
    eyebrow: "",
    title: "",
    subtitle: "",
    ctaText: "",
    ctaHref: "",
  },
  renderer: {
    exporters: {
      web: (v) => `
        <div class="wl-hero" role="img" aria-label="${esc(v.alt)}" style="position:relative;height:500px;border-radius:${radius.lg};overflow:hidden;background-image:url('${esc(
        v.image
      )}');background-size:cover;background-position:center;">
          <div style="position:absolute;inset:0;background:linear-gradient(to bottom, rgba(15,23,42,0.15) 0%, rgba(15,23,42,0.45) 55%, rgba(15,23,42,0.85) 100%);"></div>
          <div class="wl-hero-copy" style="position:absolute;left:0;right:0;bottom:0;padding:48px;">
            <div style="${labelStyle}color:rgba(255,255,255,0.85);">${esc(v.eyebrow)}</div>
            <h1 class="wl-hero-title" style="${base}font-size:48px;line-height:56px;font-weight:700;letter-spacing:-0.02em;color:${colors.white};margin:12px 0 0;">${esc(v.title)}</h1>
            <p style="${base}font-size:15px;line-height:24px;color:rgba(255,255,255,0.88);margin:10px 0 0;">${esc(v.subtitle)}</p>
            <a href="${esc(v.ctaHref)}" class="wl-btn-light" style="display:inline-block;margin-top:24px;background:${colors.white};color:${colors.navy};border-radius:${radius.md};padding:14px 26px;${base}font-size:14px;line-height:20px;font-weight:600;text-decoration:none;min-height:20px;">${esc(v.ctaText)}</a>
          </div>
        </div>`,
    },
  },
});

/* ------------------------------------------------------------------ *
 * FactStat — one cell of the quick facts bar
 * ------------------------------------------------------------------ */

export const FactStat = registerTool({
  name: "wl_fact_stat",
  values: { icon: "calendar", label: "", value: "" },
  renderer: {
    exporters: {
      // The tile is drawn here rather than on the wrapping Column: Elements
      // columns sit flush against each other, so a column-level fill leaves
      // four boxes touching. Padding on the column plus a card in here gives
      // the row real gaps.
      web: (v) => `
        <div style="display:flex;align-items:center;gap:12px;background:${colors.bg};border:1px solid ${colors.border};border-radius:${radius.md};padding:16px 18px;height:100%;box-sizing:border-box;">
          <span style="line-height:0;flex:0 0 auto;">${icon(v.icon as IconName, colors.teal, 22)}</span>
          <span style="min-width:0;">
            <span style="display:block;${labelStyle}color:${colors.warmGray};">${esc(v.label)}</span>
            <span style="display:block;${base}font-size:14px;line-height:20px;font-weight:600;color:${colors.navy};margin-top:2px;">${esc(v.value)}</span>
          </span>
        </div>`,
    },
  },
});

/* ------------------------------------------------------------------ *
 * CheckList — highlight bullets with check icons
 * ------------------------------------------------------------------ */

export const CheckList = registerTool({
  name: "wl_check_list",
  values: { items: [] as unknown as string[] },
  renderer: {
    exporters: {
      email: (v) => {
        const rows = ((v.items ?? []) as string[])
          .map(
            (t) => `
            <tr>
              <td valign="top" width="26" style="line-height:0;padding:8px 8px 8px 0;">${icon("checkCircle", colors.teal, 18)}</td>
              <td valign="top" style="${bodyStyle}padding:6px 0;">${esc(t)}</td>
            </tr>`
          )
          .join("");
        return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>`;
      },
      web: (v) => {
        const rows = ((v.items ?? []) as string[])
          .map(
            (t) => `
            <li style="display:flex;align-items:flex-start;gap:12px;padding:9px 0;border-bottom:1px solid ${colors.hairline};">
              <span style="line-height:0;flex:0 0 auto;padding-top:2px;">${icon("checkCircle", colors.teal, 18)}</span>
              <span style="${bodyStyle}">${esc(t)}</span>
            </li>`
          )
          .join("");
        return `<ul style="list-style:none;margin:0;padding:0;">${rows}</ul>`;
      },
    },
  },
});

/* ------------------------------------------------------------------ *
 * DayCard — vertical itinerary entry for the destination page
 * ------------------------------------------------------------------ */

const typeTint: Record<string, { bg: string; fg: string }> = {
  tour: { bg: "#E9EFE7", fg: "#3F5A45" },
  dining: { bg: "#F8ECDD", fg: "#A05A28" },
  transfer: { bg: colors.tealLight, fg: colors.teal },
  free: { bg: "#F1EDE3", fg: "#6E6853" },
  flight: { bg: colors.tealLight, fg: colors.teal },
};

export const DayCard = registerTool({
  name: "wl_day_card",
  values: {
    day: 0,
    date: "",
    theme: "",
    activities: [] as unknown as Array<{
      time: string;
      type: string;
      title: string;
      description: string;
    }>,
    last: false,
  },
  renderer: {
    exporters: {
      web: (v) => {
        const acts = (v.activities ?? []) as Array<{
          time: string;
          type: string;
          title: string;
          description: string;
        }>;
        const cards = acts
          .map((a) => {
            const tint = typeTint[a.type] ?? typeTint.tour;
            return `
              <div style="${cardStyle}padding:18px 20px;margin-bottom:12px;">
                <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
                  <span style="display:inline-flex;align-items:center;gap:7px;background:${colors.teal};color:${colors.white};border-radius:${radius.pill};padding:4px 11px;${labelStyle}">
                    ${esc(a.time)}
                  </span>
                  <span style="display:inline-flex;align-items:center;gap:6px;background:${tint.bg};color:${tint.fg};border-radius:${radius.pill};padding:4px 11px;${labelStyle}">
                    ${icon(activityIcon[a.type] ?? "compass", tint.fg, 13)} ${esc(a.type)}
                  </span>
                </div>
                <div style="${base}font-size:${type.h3.size};line-height:${type.h3.line};font-weight:600;color:${colors.navy};margin-top:12px;">${esc(a.title)}</div>
                <div style="${bodyStyle}margin-top:6px;">${esc(a.description)}</div>
              </div>`;
          })
          .join("");
        // The connecting rail is a border on the left gutter, so it survives
        // the mobile reflow without absolute positioning.
        return `
          <div class="wl-day" style="display:flex;gap:20px;align-items:stretch;">
            <div class="wl-day-rail" style="flex:0 0 44px;display:flex;flex-direction:column;align-items:center;">
              <span style="width:44px;height:44px;border-radius:50%;background:${colors.teal};color:${colors.white};display:flex;align-items:center;justify-content:center;${base}font-size:15px;font-weight:700;flex:0 0 44px;">${esc(v.day)}</span>
              ${v.last ? "" : `<span style="flex:1 1 auto;width:1px;background:${colors.border};margin-top:8px;"></span>`}
            </div>
            <div style="flex:1 1 auto;min-width:0;padding-bottom:${v.last ? "0" : "20px"};">
              <div style="${labelStyle}color:${colors.warmGray};">${esc(v.date)}</div>
              <div style="${base}font-size:15px;line-height:22px;font-weight:600;color:${colors.navy};margin:4px 0 12px;">${esc(v.theme)}</div>
              ${cards}
            </div>
          </div>`;
      },
    },
  },
});

/* ------------------------------------------------------------------ *
 * DayBlock — printed itinerary day, teal header bar plus activity rows
 * ------------------------------------------------------------------ */

export const DayBlock = registerTool({
  name: "wl_day_block",
  values: {
    day: 0,
    date: "",
    theme: "",
    activities: [] as unknown as Array<{
      time: string;
      type: string;
      title: string;
      description: string;
      note: string;
    }>,
  },
  renderer: {
    exporters: {
      web: (v) => {
        const acts = (v.activities ?? []) as Array<{
          time: string;
          type: string;
          title: string;
          description: string;
          note: string;
        }>;
        const rows = acts
          .map(
            (a, i) => `
            <tr>
              <td valign="top" width="70" style="${base}font-size:${type.print.size};line-height:${type.print.line};color:${colors.warmGray};padding:14px 10px 14px 16px;${i > 0 ? `border-top:1px solid ${colors.hairline};` : ""
              }white-space:nowrap;">${esc(a.time)}</td>
              <td valign="top" width="24" style="line-height:0;padding:15px 8px 14px 0;${i > 0 ? `border-top:1px solid ${colors.hairline};` : ""
              }">${icon(activityIcon[a.type] ?? "compass", colors.teal, 15)}</td>
              <td valign="top" style="padding:14px 16px 14px 0;${i > 0 ? `border-top:1px solid ${colors.hairline};` : ""
              }">
                <div style="${base}font-size:14px;line-height:20px;font-weight:600;color:${colors.navy};">${esc(a.title)}</div>
                <div style="${base}font-size:12.5px;line-height:18px;color:${colors.body};margin-top:3px;">${esc(a.description)}</div>
                ${a.note
                ? `<div style="${base}font-size:${type.print.size};line-height:${type.print.line};color:${colors.warmGray};font-style:italic;margin-top:5px;">${esc(a.note)}</div>`
                : ""
              }
              </td>
            </tr>`
          )
          .join("");
        return `
          <div class="wl-day-block" style="border:1px solid ${colors.border};border-radius:${radius.md};overflow:hidden;margin-bottom:14px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${colors.teal};">
              <tr>
                <td align="left" style="${labelStyle}color:${colors.white};padding:9px 16px;">Day ${esc(v.day)} · ${esc(v.date)}</td>
                <td align="right" style="${base}font-size:11px;line-height:16px;color:${colors.white};padding:9px 16px;">${esc(v.theme)}</td>
              </tr>
            </table>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${colors.white};">${rows}</table>
          </div>`;
      },
    },
  },
});

/* ------------------------------------------------------------------ *
 * Anchor — an in-page link target
 *
 * Row forwards only className and style, never id, so `<Row id="about">`
 * silently produces no anchor. This emits a real id inside a Column instead.
 * scroll-margin-top keeps the sticky nav from covering the heading.
 * ------------------------------------------------------------------ */

export const Anchor = registerTool({
  name: "wl_anchor",
  values: { id: "" },
  renderer: {
    exporters: {
      web: (v) =>
        `<span id="${esc(v.id)}" style="display:block;scroll-margin-top:88px;"></span>`,
    },
  },
});

/* ------------------------------------------------------------------ *
 * JournalCard — one story in the journal grid
 * ------------------------------------------------------------------ */

export const JournalCard = registerTool({
  name: "wl_journal_card",
  values: {
    title: "",
    excerpt: "",
    author: "",
    date: "",
    readTime: "",
    tags: [] as unknown as string[],
  },
  renderer: {
    exporters: {
      web: (v) => {
        const tags = ((v.tags ?? []) as string[])
          .map(
            (t) =>
              `<span style="background:${colors.tealLight};color:${colors.teal};border-radius:${radius.pill};padding:3px 10px;white-space:nowrap;${labelStyle}">${esc(t)}</span>`
          )
          .join("");
        // Column stretches its children, so the card is a flex column with the
        // meta row pushed to the bottom. That keeps the three cards' footers
        // aligned even when the excerpts differ in length.
        //
        // The tag row never wraps and the title reserves two lines: a card with
        // one long tag pair used to push its own title a line lower than its
        // neighbours', which read as three misaligned cards rather than a row.
        return `
          <div class="wl-journal" style="${cardStyle}border-radius:${radius.lg};padding:26px 24px;height:100%;box-sizing:border-box;display:flex;flex-direction:column;">
            <div style="display:flex;gap:6px;flex-wrap:nowrap;overflow:hidden;margin-bottom:14px;">${tags}</div>
            <div style="${base}font-size:${type.h3.size};line-height:22px;font-weight:600;color:${colors.navy};min-height:44px;">${esc(v.title)}</div>
            <div style="${bodyStyle}margin-top:8px;">${esc(v.excerpt)}</div>
            <div style="margin-top:auto;">
              <div style="height:1px;background:${colors.hairline};margin:18px 0 12px;"></div>
              <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;${smallStyle}">
                <span>${esc(v.author)} · ${esc(v.date)}</span>
                <span>${esc(v.readTime)}</span>
              </div>
            </div>
          </div>`;
      },
    },
  },
});

/* ------------------------------------------------------------------ *
 * TeamList — the people on the about section, one bordered card
 * ------------------------------------------------------------------ */

export const TeamList = registerTool({
  name: "wl_team_list",
  values: {
    members: [] as unknown as Array<{ name: string; role: string; origin: string }>,
  },
  renderer: {
    exporters: {
      web: (v) => {
        const members = (v.members ?? []) as Array<{
          name: string;
          role: string;
          origin: string;
        }>;
        const rows = members
          .map((m, i) => {
            // Initials stand in for a headshot: no remote image to break.
            const initials = String(m.name ?? "")
              .split(/\s+/)
              .filter(Boolean)
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase();
            return `
              <div style="display:flex;align-items:center;gap:14px;padding:14px 0;${i < members.length - 1 ? `border-bottom:1px solid ${colors.hairline};` : ""
              }">
                <span style="flex:0 0 38px;width:38px;height:38px;border-radius:50%;background:${colors.tealLight};color:${colors.teal};display:flex;align-items:center;justify-content:center;${base}font-size:13px;font-weight:700;letter-spacing:0.5px;">${esc(initials)}</span>
                <span style="min-width:0;">
                  <span style="display:block;${base}font-size:14px;line-height:20px;font-weight:600;color:${colors.navy};">${esc(m.name)}</span>
                  <span style="display:block;${base}font-size:13px;line-height:18px;color:${colors.teal};">${esc(m.role)}</span>
                  <span style="display:block;${smallStyle}">${esc(m.origin)}</span>
                </span>
              </div>`;
          })
          .join("");
        return `<div style="${cardStyle}padding:6px 20px;">${rows}</div>`;
      },
    },
  },
});

/* ------------------------------------------------------------------ *
 * TeamCard — one person, stacked, for the four-up about grid
 *
 * The about section used to run the team as a narrow list beside a tall
 * column of values, which left a block of empty cream under it. Four equal
 * cards across the full width read as a team and square the section off.
 * ------------------------------------------------------------------ */

export const TeamCard = registerTool({
  name: "wl_team_card",
  values: { name: "", role: "", origin: "" },
  renderer: {
    exporters: {
      web: (v) => {
        // Initials stand in for a headshot: no remote image to break.
        const initials = String(v.name ?? "")
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((w) => w[0])
          .join("")
          .toUpperCase();
        return `
          <div style="${cardStyle}border-radius:${radius.lg};padding:22px 20px;height:100%;box-sizing:border-box;text-align:center;">
            <span style="display:inline-flex;width:46px;height:46px;border-radius:50%;background:${colors.tealLight};color:${colors.teal};align-items:center;justify-content:center;${base}font-size:15px;font-weight:700;letter-spacing:0.5px;">${esc(initials)}</span>
            <span style="display:block;${base}font-size:14px;line-height:20px;font-weight:600;color:${colors.navy};margin-top:12px;">${esc(v.name)}</span>
            <span style="display:block;${base}font-size:13px;line-height:18px;color:${colors.teal};margin-top:2px;">${esc(v.role)}</span>
            <span style="display:block;${smallStyle}margin-top:4px;">${esc(v.origin)}</span>
          </div>`;
      },
    },
  },
});

/* ------------------------------------------------------------------ *
 * QuoteCard — the mission statement, set as a pull quote
 * ------------------------------------------------------------------ */

export const QuoteCard = registerTool({
  name: "wl_quote_card",
  values: { text: "", attribution: "" },
  renderer: {
    exporters: {
      web: (v) => `
        <div style="background:${colors.tealLight};border-radius:${radius.lg};padding:26px 28px;height:100%;box-sizing:border-box;">
          <div style="${base}font-size:26px;line-height:26px;font-weight:700;color:${colors.teal};">&ldquo;</div>
          <div style="${base}font-size:15px;line-height:24px;color:${colors.navy};margin-top:4px;">${esc(v.text)}</div>
          ${v.attribution
          ? `<div style="${labelStyle}color:${colors.teal};margin-top:16px;">${esc(v.attribution)}</div>`
          : ""
        }
        </div>`,
    },
  },
});

/* ------------------------------------------------------------------ *
 * InfoCard — the three essentials cards
 * ------------------------------------------------------------------ */

export const InfoCard = registerTool({
  name: "wl_info_card",
  values: { icon: "info", title: "", body: "" },
  renderer: {
    exporters: {
      web: (v) => `
        <div style="${cardStyle}padding:24px;height:100%;box-sizing:border-box;">
          <div style="line-height:0;">${icon(v.icon as IconName, colors.teal, 24)}</div>
          <div style="${base}font-size:${type.h3.size};line-height:${type.h3.line};font-weight:600;color:${colors.navy};margin-top:14px;">${esc(v.title)}</div>
          <div style="${bodyStyle}margin-top:8px;">${esc(v.body)}</div>
        </div>`,
    },
  },
});

/* ------------------------------------------------------------------ *
 * ForecastStrip — seven day outlook
 * ------------------------------------------------------------------ */

export const ForecastStrip = registerTool({
  name: "wl_forecast_strip",
  values: {
    days: [] as unknown as Array<{ day: string; icon: string; high: string; low: string }>,
  },
  renderer: {
    exporters: {
      web: (v) => {
        const days = (v.days ?? []) as Array<{
          day: string;
          icon: string;
          high: string;
          low: string;
        }>;
        const cells = days
          .map(
            (d) => `
            <div style="flex:1 1 90px;text-align:center;padding:14px 6px;border-right:1px solid ${colors.hairline};">
              <div style="${labelStyle}color:${colors.warmGray};">${esc(d.day)}</div>
              <div style="line-height:0;margin:8px 0;">${icon(d.icon as IconName, colors.teal, 20)}</div>
              <div style="${base}font-size:13px;font-weight:600;color:${colors.navy};">${esc(d.high)}</div>
              <div style="${smallStyle}">${esc(d.low)}</div>
            </div>`
          )
          .join("");
        return `<div class="wl-forecast" style="${cardStyle}display:flex;flex-wrap:wrap;overflow:hidden;">${cells}</div>`;
      },
    },
  },
});

/* ------------------------------------------------------------------ *
 * PaidStamp — rotated coral stamp for the printed itinerary
 * ------------------------------------------------------------------ */

export const PaidStamp = registerTool({
  name: "wl_paid_stamp",
  values: { text: "Paid in Full", color: colors.coral },
  renderer: {
    exporters: {
      web: (v) => `
        <div style="display:inline-block;border:3px solid ${esc(v.color)};border-radius:${radius.sm};padding:8px 18px;transform:rotate(-8deg);">
          <span style="${base}font-size:15px;line-height:20px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${esc(v.color)};">${esc(v.text)}</span>
        </div>`,
    },
  },
});

/* ------------------------------------------------------------------ *
 * PageHero — the display headline on the standalone pages
 *
 * Editorial serif at 48px, matching the landing page and
 * design imgs/contactPage.png. Web only: the email and the printed
 * itinerary have no business loading a display font.
 * ------------------------------------------------------------------ */

export const PageHero = registerTool({
  name: "wl_page_hero",
  values: { eyebrow: "", title: "", lede: "", meta: "" },
  renderer: {
    exporters: {
      web: (v) => `
        <div>
          <div style="${labelStyle}color:${colors.teal};">${esc(v.eyebrow)}</div>
          <h1 class="wl-page-title" style="font-family:${fonts.display};font-size:48px;line-height:1.08;font-weight:600;letter-spacing:-0.02em;color:${colors.navy};margin:14px 0 0;">${esc(v.title)}</h1>
          ${v.lede
        ? `<p style="${bodyStyle}font-size:15px;line-height:24px;margin:18px 0 0;max-width:62ch;">${esc(v.lede)}</p>`
        : ""
      }
          ${v.meta
        ? `<p style="${base}font-family:${fonts.mono};font-size:11px;line-height:16px;letter-spacing:0.12em;text-transform:uppercase;color:${colors.warmGray};margin:16px 0 0;">${esc(v.meta)}</p>`
        : ""
      }
        </div>`,
    },
  },
});

/* ------------------------------------------------------------------ *
 * LinkCard — one card in the contact page index
 *
 * The whole card is the anchor, so the hit area is the card rather than the
 * four words of its title.
 * ------------------------------------------------------------------ */

export const LinkCard = registerTool({
  name: "wl_link_card",
  values: { eyebrow: "", title: "", body: "", to: "" },
  renderer: {
    exporters: {
      web: (v) => `
        <a class="wl-linkcard" href="${esc(v.to)}" style="${cardStyle}border-radius:${radius.lg};display:flex;flex-direction:column;padding:26px 24px;height:100%;box-sizing:border-box;text-decoration:none;">
          <span style="${labelStyle}color:${colors.teal};">${esc(v.eyebrow)}</span>
          <span style="${base}font-size:17px;line-height:24px;font-weight:600;color:${colors.navy};margin-top:12px;">${esc(v.title)}</span>
          <span style="${bodyStyle}margin-top:10px;">${esc(v.body)}</span>
        </a>`,
    },
  },
});

/* ------------------------------------------------------------------ *
 * LegalSection — one numbered clause on the privacy and terms pages
 * ------------------------------------------------------------------ */

export const LegalSection = registerTool({
  name: "wl_legal_section",
  values: {
    id: "",
    number: "",
    heading: "",
    body: [] as unknown as string[],
    last: false,
  },
  renderer: {
    exporters: {
      web: (v) => {
        const paras = ((v.body ?? []) as string[])
          .map((p) => `<p style="${bodyStyle}margin:12px 0 0;">${esc(p)}</p>`)
          .join("");
        return `
          <section id="${esc(v.id)}" style="scroll-margin-top:88px;padding-bottom:${v.last ? "0" : "32px"};margin-bottom:${v.last ? "0" : "32px"};${v.last ? "" : `border-bottom:1px solid ${colors.border};`}">
            <div style="display:flex;align-items:baseline;gap:12px;">
              <span style="${base}font-family:${fonts.mono};font-size:12px;color:${colors.teal};">${esc(v.number)}</span>
              <h2 style="font-family:${fonts.display};font-size:24px;line-height:1.2;font-weight:600;letter-spacing:-0.01em;color:${colors.navy};margin:0;">${esc(v.heading)}</h2>
            </div>
            <div style="padding-left:26px;">${paras}</div>
          </section>`;
      },
    },
  },
});

/* ------------------------------------------------------------------ *
 * TocList — the clause index beside a legal page
 * ------------------------------------------------------------------ */

export const TocList = registerTool({
  name: "wl_toc_list",
  values: {
    title: "On this page",
    items: [] as unknown as Array<{ id: string; heading: string }>,
  },
  renderer: {
    exporters: {
      web: (v) => {
        const items = (v.items ?? []) as Array<{ id: string; heading: string }>;
        const rows = items
          .map(
            (i, n) =>
              `<a class="wl-toc-link" href="#${esc(i.id)}" style="display:block;${bodyStyle}font-size:13.5px;padding:7px 0;text-decoration:none;">` +
              `<span style="font-family:${fonts.mono};font-size:11px;color:${colors.teal};padding-right:8px;">${String(n + 1).padStart(2, "0")}</span>${esc(i.heading)}</a>`
          )
          .join("");
        return `
          <nav class="wl-toc" aria-label="${esc(v.title)}" style="border-left:2px solid ${colors.border};padding-left:18px;">
            <div style="${labelStyle}color:${colors.warmGray};padding-bottom:6px;">${esc(v.title)}</div>
            ${rows}
          </nav>`;
      },
    },
  },
});
