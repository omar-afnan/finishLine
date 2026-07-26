/**
 * <Page> render mode — the shell behind privacy.html and terms.html.
 *
 * Both pages are the same document with different clauses, so they share one
 * template and differ only by the key passed in. Same chrome as the contact
 * page: nav, serif hero on cream, then the clauses beside their index.
 */
import { Page, Row, Column, ColumnLayouts, Paragraph } from "@unlayer/react-elements";
import { brand, legalPages, links } from "../lib/data";
import { colors, fonts, radius, type } from "../lib/theme";
import { PageHero, LegalSection, TocList } from "../lib/tools";
import { navRow } from "./SiteNav";
import { footerRows } from "./SiteFooter";

export default function LegalPage({ page }: { page: keyof typeof legalPages }) {
  const content = legalPages[page];
  const other = page === "privacy" ? legalPages.terms : legalPages.privacy;
  const otherHref = page === "privacy" ? links.terms : links.privacy;

  return (
    <Page backgroundColor={colors.white} contentWidth="960px" fontFamily={fonts.body}>
      {navRow({ prefix: links.destination, ctaText: "Home", ctaHref: links.home })}

      {/* 1. Hero */}
      <Row className="wl-section" backgroundColor={colors.bg} padding="72px 24px 72px">
        <Column>
          <PageHero
            eyebrow={content.eyebrow}
            title={content.title}
            lede={content.lede}
            meta={content.updated}
          />
        </Column>
      </Row>

      {/* 2. Clauses, with their index alongside. */}
      <Row
        className="wl-section wl-legal"
        backgroundColor={colors.white}
        padding="64px 24px 0"
        layout={ColumnLayouts.TwoNarrowWide}
      >
        <Column padding="0 32px 0 0">
          <TocList
            items={
              content.sections.map((s) => ({ id: s.id, heading: s.heading })) as unknown as never
            }
          />
        </Column>
        <Column>
          {content.sections.map((s, i) => (
            <LegalSection
              key={s.id}
              id={s.id}
              number={String(i + 1).padStart(2, "0")}
              heading={s.heading}
              body={s.body as unknown as never}
              last={i === content.sections.length - 1}
            />
          ))}
        </Column>
      </Row>

      {/* 3. Where to go next. */}
      <Row className="wl-section" backgroundColor={colors.white} padding="56px 24px 72px">
        <Column backgroundColor={colors.tealLight} borderRadius={radius.lg} padding="26px 28px">
          <Paragraph
            fontSize={type.body.size}
            lineHeight={type.body.line}
            color={colors.body}
            html={
              `Questions about this page? Write to ` +
              `<a href="mailto:${brand.supportEmail}" style="color:${colors.teal};text-decoration:none;font-weight:600;">${brand.supportEmail}</a>` +
              ` or call the concierge on ${brand.supportPhone}. You may also want ` +
              `<a href="${otherHref}" style="color:${colors.teal};text-decoration:none;font-weight:600;">${other.title}</a>` +
              ` or the <a href="${links.contact}" style="color:${colors.teal};text-decoration:none;font-weight:600;">contact page</a>.`
            }
          />
        </Column>
      </Row>

      {footerRows({ variant: "web" })}
    </Page>
  );
}
