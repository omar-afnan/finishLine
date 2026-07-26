/**
 * <Page> render mode — the contact page.
 *
 * Layout follows design imgs/contactPage.png: nav, an editorial serif hero on
 * cream, and a three-up index of the standalone pages. The concierge channels
 * below it are what the third card points at, so the page answers "how do I
 * reach a human" without a second navigation.
 */
import { Page, Row, Column, ColumnLayouts, Heading, Paragraph, Divider } from "@unlayer/react-elements";
import { brand, contactContent, links } from "../lib/data";
import { colors, fonts, radius, type } from "../lib/theme";
import { PageHero, LinkCard, InfoCard, SectionLabel, Anchor } from "../lib/tools";
import { navRow } from "./SiteNav";
import { footerRows } from "./SiteFooter";

export default function ContactPage() {
  return (
    <Page backgroundColor={colors.bg} contentWidth="960px" fontFamily={fonts.body}>
      {navRow({ prefix: links.destination, ctaText: "Home", ctaHref: links.home })}

      {/* 1. Hero */}
      <Row className="wl-section" backgroundColor={colors.bg} padding="72px 24px 0">
        <Column>
          <PageHero
            eyebrow={contactContent.eyebrow}
            title={contactContent.title}
            lede={contactContent.lede}
          />
        </Column>
      </Row>

      {/* 2. The index: privacy, terms, and the concierge anchor below. */}
      <Row
        className="wl-cards"
        backgroundColor={colors.bg}
        padding="44px 18px 72px"
        layout={ColumnLayouts.ThreeEqual}
      >
        {contactContent.cards.map((c) => (
          <Column key={c.title} padding="0 6px">
            <LinkCard eyebrow={c.eyebrow} title={c.title} body={c.body} to={c.href} />
          </Column>
        ))}
      </Row>

      {/* 3. Concierge channels — the target of the third card. */}
      <Row className="wl-section" backgroundColor={colors.white} padding="64px 24px 0">
        <Column>
          <Anchor id="concierge" />
          <SectionLabel text="Direct channels" />
          <Heading
            level="h2"
            fontSize={type.h2.size}
            lineHeight={type.h2.line}
            fontWeight={type.h2.weight}
            letterSpacing={type.h2.spacing}
            color={colors.navy}
            text="Reach the concierge"
            containerPadding="10px 0 0"
          />
        </Column>
      </Row>
      <Row
        className="wl-cards"
        backgroundColor={colors.white}
        padding="24px 18px 0"
        layout={ColumnLayouts.ThreeEqual}
      >
        {contactContent.channels.map((c) => (
          <Column key={c.title} padding="0 6px">
            <InfoCard icon={c.icon} title={c.title} body={c.body} />
          </Column>
        ))}
      </Row>

      {/* 4. How we help */}
      <Row className="wl-section" backgroundColor={colors.white} padding="56px 24px 72px">
        <Column backgroundColor={colors.tealLight} borderRadius={radius.lg} padding="32px 32px 28px">
          <Heading
            level="h2"
            fontSize={type.h3.size}
            lineHeight={type.h3.line}
            fontWeight={600}
            color={colors.navy}
            text={contactContent.helpTitle}
            containerPadding="0 0 4px"
          />
          <Paragraph
            fontSize={type.body.size}
            lineHeight={type.body.line}
            color={colors.body}
            text={contactContent.help}
          />
          <Divider
            borderTopWidth="1px"
            borderTopColor="#E7D6C4"
            width="100%"
            containerPadding="20px 0 14px"
          />
          <Paragraph
            fontSize={type.small.size}
            lineHeight={type.small.line}
            color={colors.warmGray}
            html={
              `${contactContent.office} ` +
              `<a href="${links.privacy}" style="color:${colors.teal};text-decoration:none;font-weight:600;">Privacy</a>` +
              `&nbsp;&nbsp;<a href="${links.terms}" style="color:${colors.teal};text-decoration:none;font-weight:600;">Terms</a>` +
              `&nbsp;&nbsp;<a href="mailto:${brand.supportEmail}" style="color:${colors.teal};text-decoration:none;font-weight:600;">Email us</a>`
            }
          />
        </Column>
      </Row>

      {footerRows({ variant: "web" })}
    </Page>
  );
}
