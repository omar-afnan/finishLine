/**
 * Custom Elements tools built with `registerTool` — the same config shape as
 * the Unlayer editor's `unlayer.registerTool`, with per-render-mode exporters.
 *
 * - StatTile: a big-number metric tile (email gets a bulletproof table,
 *   web/document get a div).
 * - FieldBar: a "faster than N% of the field" progress bar that renders as
 *   nested tables in email mode and divs elsewhere.
 */
import { registerTool } from "@unlayer/react-elements";
import { colors, fonts } from "./theme";

export const StatTile = registerTool({
  name: "stat_tile",
  values: {
    value: "",
    label: "",
    sub: "",
    valueColor: colors.ink,
    background: colors.mist,
  },
  renderer: {
    exporters: {
      email: (v) => `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td align="center" bgcolor="${v.background}" style="background-color:${v.background};border-radius:10px;padding:18px 8px;">
            <div style="font-family:${fonts.display};font-size:26px;line-height:32px;font-weight:800;color:${v.valueColor};">${v.value}</div>
            <div style="font-family:${fonts.body};font-size:11px;line-height:16px;letter-spacing:1.5px;text-transform:uppercase;color:${colors.slate};padding-top:6px;">${v.label}</div>
            ${v.sub ? `<div style="font-family:${fonts.body};font-size:12px;line-height:16px;color:${colors.faint};padding-top:2px;">${v.sub}</div>` : ""}
          </td></tr>
        </table>`,
      web: (v) => `
        <div style="background:${v.background};border-radius:12px;padding:22px 12px;text-align:center;">
          <div style="font-family:${fonts.display};font-size:30px;line-height:36px;font-weight:800;color:${v.valueColor};">${v.value}</div>
          <div style="font-family:${fonts.body};font-size:11px;line-height:16px;letter-spacing:1.5px;text-transform:uppercase;color:${colors.slate};margin-top:8px;">${v.label}</div>
          ${v.sub ? `<div style="font-family:${fonts.body};font-size:13px;line-height:18px;color:${colors.faint};margin-top:2px;">${v.sub}</div>` : ""}
        </div>`,
    },
  },
});

export const FieldBar = registerTool({
  name: "field_bar",
  values: {
    percent: 0,
    label: "",
    barColor: colors.accent,
    trackColor: colors.line,
  },
  renderer: {
    exporters: {
      email: (v) => {
        const pct = Math.max(0, Math.min(100, Number(v.percent)));
        return `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="font-family:${fonts.body};font-size:13px;line-height:18px;color:${colors.slate};padding-bottom:8px;">${v.label}</td></tr>
          <tr><td>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-radius:6px;background-color:${v.trackColor};">
              <tr>
                <td width="${pct}%" height="10" bgcolor="${v.barColor}" style="border-radius:6px;font-size:0;line-height:0;">&nbsp;</td>
                <td width="${100 - pct}%" style="font-size:0;line-height:0;">&nbsp;</td>
              </tr>
            </table>
          </td></tr>
        </table>`;
      },
      web: (v) => {
        const pct = Math.max(0, Math.min(100, Number(v.percent)));
        return `
        <div>
          <div style="font-family:${fonts.body};font-size:14px;line-height:20px;color:${colors.slate};margin-bottom:8px;">${v.label}</div>
          <div style="background:${v.trackColor};border-radius:6px;height:10px;overflow:hidden;">
            <div style="background:${v.barColor};border-radius:6px;height:10px;width:${pct}%;"></div>
          </div>
        </div>`;
      },
    },
  },
});
