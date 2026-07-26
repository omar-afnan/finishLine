/**
 * The site header, shared by the destination page and the standalone pages.
 *
 * Returned as a <Row> from a plain function rather than a component, because a
 * Row validates the type of its children and <Page> expects rows as its own.
 *
 * `prefix` is what the section anchors hang off: empty on the destination page,
 * where the sections are on the same document, and "page.html" everywhere else,
 * where they are one navigation away.
 */
import { Row, Column, ColumnLayouts, Paragraph, Button } from "@unlayer/react-elements";
import { brand, navLinks, links } from "../lib/data";
import { colors, fonts, radius, hairlineBorder } from "../lib/theme";

export function navRow({
  prefix = "",
  ctaText = "My Trips",
  ctaHref = links.myTrips,
}: { prefix?: string; ctaText?: string; ctaHref?: string } = {}) {
  return (
    <Row
      key="site-nav"
      className="wl-nav"
      backgroundColor={colors.white}
      padding="16px 24px"
      layout={ColumnLayouts.ThreeNarrowWideNarrow}
    >
      <Column>
        <Paragraph
          textAlign="left"
          html={`<a href="${links.home}" class="wl-brand" style="font-family:${fonts.body};font-size:19px;line-height:26px;font-weight:700;letter-spacing:2px;color:${colors.navy};text-decoration:none;">${brand.name}</a>`}
        />
      </Column>
      <Column>
        {/* Hand-rolled rather than <Menu>: that tool hardcodes its own link
            blue and stamps target="_blank" on every item, so in-page anchors
            opened a second copy of the page instead of scrolling. */}
        <Paragraph
          textAlign="center"
          html={navLinks
            .map(
              (l) =>
                `<a href="${prefix}${l.href}" class="wl-navlink" style="display:inline-block;padding:5px 15px;font-family:${fonts.body};font-size:14px;line-height:20px;color:${colors.body};text-decoration:none;">${l.text}</a>`
            )
            .join("")}
        />
      </Column>
      <Column>
        <Button
          href={ctaHref}
          backgroundColor={colors.white}
          color={colors.teal}
          fontSize="14px"
          fontWeight={600}
          padding="11px 18px"
          borderRadius={radius.md}
          border={hairlineBorder(colors.teal)}
        >
          {ctaText}
        </Button>
      </Column>
    </Row>
  );
}
