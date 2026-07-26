/**
 * One footer, three render modes.
 *
 * The destination page, the email and the printed itinerary all end with the
 * same information architecture: brand and tagline, a Support column, a Legal
 * column, then a rule with the social row and the legal line under it. Sharing
 * it here means a new support number or a renamed policy page is a one-line
 * change instead of three.
 *
 * Returns an array of <Row> elements rather than a component so the caller can
 * drop it straight into <Page> / <Email> / <Document>, which expect rows as
 * their direct children.
 *
 * Two variants:
 *   - "dark"  deep forest fill, light text. Web and email.
 *   - "print" no fill, hairline rule, ink-cheap. The document, where a
 *             full-bleed dark band would soak a page in toner.
 */
import { Row, Column, ColumnLayouts, Paragraph, Divider, Social } from "@unlayer/react-elements";
import { brand, booking, links } from "../lib/data";
import { colors, fonts, type } from "../lib/theme";

const socials = [
  { name: "Instagram", url: "https://instagram.com/example" },
  { name: "X", url: "https://x.com/example" },
  { name: "Facebook", url: "https://facebook.com/example" },
];

/** "email" is the dark web footer with email-safe touch targets. */
type Variant = "web" | "email" | "print";

/** Palette per variant, so the markup below stays single-purpose. */
function skin(variant: Variant) {
  const dark = variant !== "print";
  return {
    fill: dark ? colors.navy : colors.white,
    heading: dark ? colors.white : colors.navy,
    muted: dark ? colors.onNavyMuted : colors.warmGray,
    rule: dark ? "#334036" : colors.border,
  };
}

/**
 * One footer link column.
 *
 * Called as a plain function rather than rendered as <LinkColumn />: a Row
 * validates the *type* of each child and only accepts <Column>, so the element
 * has to be built here and dropped in already-made.
 */
function linkColumn({
  title,
  items,
  variant,
  gutter,
}: {
  title: string;
  items: Array<{ text: string; href: string }>;
  variant: Variant;
  gutter?: string;
}) {
  const s = skin(variant);
  const size = variant === "print" ? "11px" : type.small.size;
  return (
    <Column padding={gutter}>
      <Paragraph
        html={
          `<span style="font-family:${fonts.body};font-size:11px;line-height:16px;font-weight:700;` +
          `letter-spacing:1px;text-transform:uppercase;color:${s.heading};">${title}</span>`
        }
      />
      <Paragraph
        fontSize={size}
        lineHeight={variant === "print" ? "17px" : "24px"}
        color={s.muted}
        html={items
          .map(
            (i) =>
              `<a href="${i.href}" class="wl-flink" style="color:${s.muted};text-decoration:none;">${i.text}</a>`
          )
          .join("<br />")}
      />
    </Column>
  );
}

export function footerRows({
  variant = "web",
  padding = "24px",
}: { variant?: Variant; padding?: string } = {}): React.ReactElement[] {
  const s = skin(variant);
  const print = variant === "print";
  const support = [
    { text: "Contact concierge", href: links.contact },
    { text: brand.supportPhone, href: "tel:+15552345678" },
    // A 600px email splits into three ~180px columns, and the full address is
    // wider than that, so it breaks mid-domain. The label carries it there.
    {
      text: variant === "email" ? "Email concierge" : brand.supportEmail,
      href: `mailto:${brand.supportEmail}`,
    },
  ];
  const legal = [
    { text: "Privacy policy", href: links.privacy },
    { text: "Terms of service", href: links.terms },
    { text: "Email preferences", href: links.unsubscribe },
  ];

  const rows: React.ReactElement[] = [];

  // Print has no fill to separate it from the body copy above, so it opens on
  // a full-width rule instead. A rule inside the first column would only span
  // a third of the sheet.
  if (print) {
    rows.push(
      <Row key="footer-rule" backgroundColor={s.fill} padding={`24px ${padding} 0`}>
        <Column>
          <Divider borderTopWidth="1px" borderTopColor={s.rule} width="100%" />
        </Column>
      </Row>
    );
  }

  rows.push(
    <Row
      key="footer-top"
      className="wl-footer"
      backgroundColor={s.fill}
      padding={print ? `28px ${padding} 0` : `56px ${padding} 24px`}
      layout={ColumnLayouts.ThreeEqual}
    >
      <Column padding={`0 ${print ? "16px" : "24px"} 0 0`}>
        <Paragraph
          html={
            `<span style="font-family:${fonts.body};font-size:${print ? "15px" : "19px"};` +
            `line-height:26px;font-weight:700;letter-spacing:2px;color:${s.heading};">${brand.name}</span>`
          }
        />
        <Paragraph
          fontSize={print ? "11px" : type.small.size}
          lineHeight={print ? "17px" : type.small.line}
          color={s.muted}
          text={`${brand.tagline}. Crafting journeys for the mindful explorer since ${brand.established}.`}
        />
      </Column>
      {linkColumn({ title: "Support", items: support, variant })}
      {linkColumn({ title: "Legal", items: legal, variant })}
    </Row>
  );

  rows.push(
    <Row
      key="footer-bottom"
      className="wl-footer"
      backgroundColor={s.fill}
      padding={print ? `10px ${padding} 32px` : `0 ${padding} 40px`}
    >
      <Column>
        <Divider borderTopWidth="1px" borderTopColor={s.rule} width="100%" containerPadding="0 0 18px" />
        {print ? null : (
          <Social
            icons={socials}
            iconType="circle"
            // 28 on the web, where the stylesheet grows the anchor to a 44px
            // touch target. An email has no stylesheet to do that with, so the
            // glyph itself has to carry the full thumb target.
            iconSize={variant === "email" ? 44 : 28}
            spacing={10}
            align="left"
          />
        )}
        <Paragraph
          fontSize={print ? "10px" : "11px"}
          lineHeight={print ? "15px" : "16px"}
          color={s.muted}
          text={
            print
              ? `© ${brand.established + 8} ${brand.legalName}, ${brand.city}, Booking ${booking.reference}, Issued ${booking.issued}`
              : `© ${brand.established + 8} ${brand.legalName}, ${brand.city}, Booking ${booking.reference}`
          }
        />
      </Column>
    </Row>
  );

  return rows;
}
