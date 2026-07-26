/**
 * Stylesheets injected into the rendered documents.
 *
 * Elements emits inline styles plus its own grid CSS, and it only stacks
 * columns below 480px. Everything here layers on top of that: a real tablet
 * breakpoint, tightened spacing on phones, interaction states, and the print
 * rules for the PDF itinerary.
 */
import { colors, fonts, radius, shadow } from "./lib/theme";

/**
 * Web page stylesheet.
 *
 * Breakpoints: 768px (tablet, columns stack) and 480px (phone, spacing and
 * type step down). `!important` is needed because Elements writes its column
 * widths inline and in its own generated rules.
 */
export const pageCss = `
  html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }
  body { margin: 0; }
  img { max-width: 100%; height: auto; }

  /* Sticky navigation. */
  .wl-nav {
    position: sticky;
    top: 0;
    z-index: 50;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
    background: ${colors.white};
  }

  .wl-navlink:hover { color: ${colors.teal} !important; }

  /* Cards in a row are all as tall as the tallest one, so the three journal
     footers and the four team cards line up instead of ending raggedly. */
  .wl-cards > div, .wl-facts > div { align-items: stretch !important; }
  .wl-cards .u-col, .wl-facts .u-col { display: flex !important; }
  .wl-cards .u-col > .v-col-padding, .wl-facts .u-col > .v-col-padding { width: 100%; }
  .wl-journal { transition: border-color 180ms ease, box-shadow 180ms ease; }
  .wl-journal:hover {
    border-color: ${colors.teal};
    box-shadow: ${shadow.ambient};
  }

  /* Interaction states. Hover darkens by one step, focus is always visible. */
  a { transition: color 180ms ease, background-color 180ms ease, border-color 180ms ease; }
  a[href]:hover { cursor: pointer; }
  a:focus-visible,
  button:focus-visible {
    outline: 2px solid ${colors.teal};
    outline-offset: 3px;
    border-radius: ${radius.sm};
  }
  .wl-btn-light:hover { background: ${colors.bg} !important; }

  /* Every link that renders as a button clears the 44px touch target. */
  .wl-hero .wl-btn-light { min-height: 44px; box-sizing: border-box; }

  /* ---------------- Touch targets ----------------
     Keyed to the pointer, not just the width: a 1024px tablet is still a thumb,
     and a narrow desktop window is still a mouse. Width stays in the query so
     that browsers without pointer-media support (and narrow desktop testing)
     still get the larger targets.

     The nav menu, the footer lists and the inline text CTAs all render as
     13-31px inline links — fine for a cursor, too small for a thumb. Padding
     does the work, so nothing shifts horizontally. */
  @media (max-width: 768px), (pointer: coarse) {
    .wl-nav a[href] {
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      min-height: 44px;
      box-sizing: border-box;
    }

    .wl-brand { min-height: 44px; }

    .wl-tlink, .wl-flink {
      display: inline-block !important;
      min-height: 44px;
      line-height: 44px !important;
    }

    /* Social icons render as a bare 28px <img> in an <a>. The glyph keeps its
       size; the anchor around it grows to a thumb-sized hit area. */
    .u_content_social a {
      display: inline-flex !important;
      align-items: center;
      justify-content: center;
      min-width: 44px;
      min-height: 44px;
    }
  }

  /* ---------------- Tablet: 768px ---------------- */
  @media (max-width: 768px) {
    /* Elements stacks at 480 by default. Move that up to the tablet edge. */
    .u-row:not(.no-stack) { flex-wrap: wrap !important; }
    .u-row:not(.no-stack) .u-col {
      flex: 0 0 100% !important;
      max-width: 100% !important;
      width: 100% !important;
    }

    .wl-nav { position: static; }
    .wl-nav .u-col { text-align: center !important; }

    .wl-hero { height: 380px !important; }
    .wl-hero-copy { padding: 28px 24px !important; }
    .wl-hero-title { font-size: 34px !important; line-height: 42px !important; }

    /* Section rhythm compresses from 64px to 40px. */
    .wl-section { padding-top: 40px !important; }

    /* Stacked columns need their own vertical gap back. */
    .wl-facts .u-col,
    .wl-cards .u-col { margin-bottom: 12px; }

    /* Cards sat side by side, so their horizontal gutters become margins. */
    .wl-cards .u-col { padding-left: 0 !important; padding-right: 0 !important; }

    /* Forecast: seven days never wrap cleanly into a narrow card — three per
       row leaves a stranded seventh. Below the tablet edge the strip becomes a
       single scrollable rail instead. "flex: 1 0 84px" fills the card when
       there is room and scrolls once there isn't, so there is no orphan row at
       any width. The inline rule is overflow:hidden, hence the override. */
    .wl-forecast {
      flex-wrap: nowrap !important;
      overflow-x: auto !important;
      overflow-y: hidden !important;
      -webkit-overflow-scrolling: touch;
      scroll-snap-type: x proximity;
    }
    .wl-forecast > div {
      flex: 1 0 84px !important;
      box-sizing: border-box !important;
      scroll-snap-align: start;
    }
    .wl-forecast > div:last-child { border-right: 0 !important; }
  }

  /* ---------------- Phone: 480px ---------------- */
  @media (max-width: 480px) {
    .wl-hero { height: 320px !important; }
    .wl-hero-copy { padding: 22px 18px !important; }
    .wl-hero-title { font-size: 28px !important; line-height: 36px !important; }

    .wl-section { padding-left: 16px !important; padding-right: 16px !important; }

    /* Trip beads: shrink the labels rather than letting them collide. */
    .wl-timeline span { font-size: 9px !important; }

    /* The day rail loses its circle gutter and the card takes the full width. */
    .wl-day { gap: 12px !important; }
    .wl-day-rail { flex: 0 0 34px !important; }
    .wl-day-rail > span:first-child {
      width: 34px !important;
      height: 34px !important;
      flex: 0 0 34px !important;
      font-size: 13px !important;
    }

    /* Split rows stop fighting for space and stack left aligned. */
    .wl-split { flex-direction: column !important; align-items: flex-start !important; }
    .wl-split > div { text-align: left !important; }
  }

  @media (prefers-reduced-motion: reduce) {
    * { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; }
  }
`;

/**
 * Print stylesheet for the itinerary.
 *
 * The screen version keeps a print button; @media print removes it, sets the
 * 0.75in margin, and stops day blocks from splitting across a page.
 */
export const documentCss = `
  body { margin: 0; background: ${colors.bg}; }
  img { max-width: 100%; height: auto; }

  /* Screen-only affordance so the file is useful before it becomes a PDF. */
  .wl-print-bar {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 12px;
    padding: 20px 16px;
    font-family: ${fonts.body};
  }
  .wl-print-btn {
    display: inline-flex;
    align-items: center;
    gap: 9px;
    background: ${colors.teal};
    color: ${colors.white};
    border: 0;
    border-radius: ${radius.md};
    padding: 13px 22px;
    min-height: 44px;
    font-family: ${fonts.body};
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 180ms ease;
  }
  .wl-print-btn:hover { background: ${colors.tealDeep}; }
  .wl-print-btn:focus-visible { outline: 2px solid ${colors.navy}; outline-offset: 3px; }

  /* The download sits beside print as the quieter of the two: same shape,
     outlined rather than filled, and it resolves to a real file. */
  .wl-print-btn-ghost {
    background: ${colors.white};
    color: ${colors.teal};
    border: 1px solid ${colors.teal};
    text-decoration: none;
  }
  .wl-print-btn-ghost:hover { background: ${colors.tealLight}; color: ${colors.tealDeep}; }

  /* The sheet itself floats on the grey canvas on screen. */
  .wl-sheet {
    max-width: 700px;
    margin: 0 auto 40px;
    background: ${colors.white};
    box-shadow: 0 4px 20px rgba(15, 23, 42, 0.08);
  }

  /* ---------------- Screen, small viewports ----------------
     Document mode targets a fixed 700px sheet, so Elements leaves its rows at
     flex-wrap:nowrap. On a phone that turns the three-up policies block into
     three 96px columns. These rules are scoped to "screen" so the printed
     sheet — the actual deliverable — keeps its multi-column layout. */
  @media screen and (max-width: 768px) {
    .wl-sheet { margin-bottom: 24px; }

    .u-row { flex-wrap: wrap !important; }
    .u-row .u-col {
      flex: 0 0 100% !important;
      max-width: 100% !important;
      width: 100% !important;
    }

    /* Row padding was tuned for a 0.75in print margin; reclaim it on screen. */
    .wl-doc-block, .wl-doc-day {
      padding-left: 20px !important;
      padding-right: 20px !important;
    }

    /* Six columns cannot be legible at phone width, so the flight summary
       scrolls sideways inside its own container rather than crushing to 44px
       columns. The page itself still never scrolls horizontally. */
    .wl-doc-flights .u-col { overflow-x: auto !important; }
    .wl-doc-flights table { min-width: 520px; }
  }

  @page {
    size: A4;
    margin: 0.75in;
  }

  @media print {
    body { background: ${colors.white}; }
    .wl-print-bar { display: none !important; }
    .wl-sheet { box-shadow: none; margin: 0; max-width: none; }

    /* Keep a day and its activities on one page. */
    .wl-doc-day, .wl-doc-block { page-break-inside: avoid; break-inside: avoid; }

    /* Force the colour blocks to print rather than being dropped. */
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }

    a { text-decoration: none; color: inherit; }
  }
`;

/** Screen-only controls prepended to the document body. */
export const printBar = `
  <div class="wl-print-bar">
    <button class="wl-print-btn" type="button" onclick="window.print()">
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M6 9V2h12v7"/>
        <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
        <rect width="12" height="8" x="6" y="14"/>
      </svg>
      Print itinerary
    </button>
    <a class="wl-print-btn wl-print-btn-ghost" href="itinerary.pdf" download="wanderlust-itinerary.pdf">
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <path d="M7 10l5 5 5-5"/>
        <path d="M12 15V3"/>
      </svg>
      Download PDF
    </a>
  </div>
`;
