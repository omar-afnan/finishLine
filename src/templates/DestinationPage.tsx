/**
 * <Page> render mode — the public destination page for the same booking.
 *
 * Same data object as the email, rendered as responsive flexbox. Layout
 * classes (wl-nav, wl-hero, wl-section) are the hooks the stylesheet in
 * src/render.tsx uses for the 768px and 480px breakpoints.
 */
import {
  Page,
  Row,
  Column,
  ColumnLayouts,
  Heading,
  Paragraph,
  Button,
  Divider,
  Image,
} from "@unlayer/react-elements";
import {
  brand,
  trip,
  destination,
  quickFacts,
  itinerary,
  essentials,
  forecast,
  journalEntries,
  aboutContent,
  navLinks,
  links,
  images,
} from "../lib/data";
import { colors, fonts, radius, type, hairlineBorder } from "../lib/theme";
import {
  SectionLabel,
  HeroBanner,
  FactStat,
  CheckList,
  DayCard,
  InfoCard,
  ForecastStrip,
  Anchor,
  JournalCard,
  TeamCard,
  QuoteCard,
} from "../lib/tools";
import { footerRows } from "./SiteFooter";

/** The page shows the opening three days and links out for the rest. */
const previewDays = itinerary.slice(0, 3);

export default function DestinationPage() {
  return (
    <Page backgroundColor={colors.white} contentWidth="960px" fontFamily={fonts.body}>
      {/* 1. Navigation */}
      <Row
        className="wl-nav"
        backgroundColor={colors.white}
        padding="16px 24px"
        layout={ColumnLayouts.ThreeNarrowWideNarrow}
      >
        <Column>
          <Paragraph
            textAlign="left"
            html={`<a href="${brand.websiteUrl}" class="wl-brand" style="font-family:${fonts.body};font-size:19px;line-height:26px;font-weight:700;letter-spacing:2px;color:${colors.navy};text-decoration:none;">${brand.name}</a>`}
          />
        </Column>
        <Column>
          {/* Hand-rolled rather than <Menu>: that tool hardcodes its own link
              blue and stamps target="_blank" on every item, so the in-page
              anchors opened a second copy of the page in a new tab instead of
              scrolling to the section. */}
          <Paragraph
            textAlign="center"
            html={navLinks
              .map(
                (l) =>
                  `<a href="${l.href}" class="wl-navlink" style="display:inline-block;padding:5px 15px;font-family:${fonts.body};font-size:14px;line-height:20px;color:${colors.body};text-decoration:none;">${l.text}</a>`
              )
              .join("")}
          />
        </Column>
        <Column>
          <Button
            href={links.myTrips}
            backgroundColor={colors.white}
            color={colors.teal}
            fontSize="14px"
            fontWeight={600}
            padding="11px 18px"
            borderRadius={radius.md}
            border={hairlineBorder(colors.teal)}
          >
            My Trips
          </Button>
        </Column>
      </Row>

      {/* 2. Hero */}
      <Row backgroundColor={colors.white} padding="0 24px">
        <Column>
          <HeroBanner
            image={images.hero}
            alt={`The ${trip.city} skyline at dusk`}
            eyebrow="Your upcoming trip"
            title={trip.destination}
            subtitle={`${trip.dates} · ${trip.nights} nights · ${trip.packageName}`}
            ctaText="View itinerary"
            ctaHref={links.itinerary}
          />
        </Column>
      </Row>

      {/* 3. Quick facts */}
      <Row
        className="wl-facts"
        backgroundColor={colors.white}
        padding="24px 18px 0"
        layout={ColumnLayouts.FourEqual}
      >
        {quickFacts.map((f) => (
          /* The tile itself is drawn by FactStat. The column only carries the
             6px gutter that separates the four boxes. */
          <Column key={f.label} padding="0 6px">
            <FactStat icon={f.icon} label={f.label} value={f.value} />
          </Column>
        ))}
      </Row>

      {/* 4. Destination guide  #destinations */}
      <Row
        className="wl-section"
        backgroundColor={colors.white}
        padding="64px 24px 0"
        layout={ColumnLayouts.TwoWideNarrow}
      >
        <Column padding="0 32px 0 0">
          <Anchor id="destinations" />
          <SectionLabel text="Destination guide" />
          <Heading
            level="h2"
            fontSize={type.h2.size}
            lineHeight={type.h2.line}
            fontWeight={type.h2.weight}
            letterSpacing={type.h2.spacing}
            color={colors.navy}
            text={`Discover ${trip.city}`}
            containerPadding="10px 0 0"
          />
          <Paragraph
            fontSize={type.body.size}
            lineHeight={type.body.line}
            color={colors.body}
            text={destination.intro}
          />
          <CheckList items={destination.highlights as unknown as never} />
        </Column>
        <Column>
          <Image
            src={images.street}
            alt={`A neon-lit street in ${trip.city} after rain`}
            style={{ borderRadius: radius.lg, overflow: "hidden" }}
          />
        </Column>
      </Row>

      {/* 5. Itinerary preview — #experiences */}
      <Row className="wl-section" backgroundColor={colors.white} padding="64px 24px 0">
        <Column backgroundColor={colors.bg} borderRadius={radius.lg} padding="36px 32px 32px">
          <Anchor id="experiences" />
          <SectionLabel text="Day by day" />
          <Heading
            level="h2"
            fontSize={type.h2.size}
            lineHeight={type.h2.line}
            fontWeight={type.h2.weight}
            letterSpacing={type.h2.spacing}
            color={colors.navy}
            text="Your itinerary"
            containerPadding="10px 0 20px"
          />
          {previewDays.map((day, i) => (
            <DayCard
              key={day.day}
              day={day.day}
              date={day.date}
              theme={day.theme}
              activities={day.activities as unknown as never}
              last={i === previewDays.length - 1}
            />
          ))}
          <Divider borderTopWidth="1px" borderTopColor={colors.border} width="100%" containerPadding="8px 0 18px" />
          <Paragraph
            textAlign="center"
            html={`<a href="${links.itinerary}" class="wl-tlink" style="font-family:${fonts.body};font-size:14px;line-height:20px;font-weight:600;color:${colors.teal};text-decoration:none;">View all ${itinerary.length} days &rarr;</a>`}
          />
        </Column>
      </Row>

      {/* 6. Journal — #journal */}
      <Row className="wl-section" backgroundColor={colors.white} padding="64px 24px 0">
        <Column>
          <Anchor id="journal" />
          <SectionLabel text="Journal" />
          <Heading
            level="h2"
            fontSize={type.h2.size}
            lineHeight={type.h2.line}
            fontWeight={type.h2.weight}
            letterSpacing={type.h2.spacing}
            color={colors.navy}
            text="Stories from Tokyo"
            containerPadding="10px 0 8px"
          />
          <Paragraph
            fontSize={type.body.size}
            lineHeight={type.body.line}
            color={colors.body}
            text="Travel notes, local tips, and insider guides curated by our concierge team."
          />
        </Column>
      </Row>
      {/* A Column only renders children whose type is a function, so a raw
          <div> here is dropped on the floor. The card is a registered tool
          instead, which is also how the rest of the page is built. */}
      <Row
        className="wl-cards"
        backgroundColor={colors.white}
        padding="20px 16px 0"
        layout={ColumnLayouts.ThreeEqual}
      >
        {journalEntries.map((entry) => (
          <Column key={entry.title} padding="0 8px">
            <JournalCard
              title={entry.title}
              excerpt={entry.excerpt}
              author={entry.author}
              date={entry.date}
              readTime={entry.readTime}
              tags={entry.tags as unknown as never}
            />
          </Column>
        ))}
      </Row>

      {/* 7. Essentials */}
      <Row className="wl-section" backgroundColor={colors.white} padding="64px 24px 0">
        <Column>
          <SectionLabel text="Before you go" />
          <Heading
            level="h2"
            fontSize={type.h2.size}
            lineHeight={type.h2.line}
            fontWeight={type.h2.weight}
            letterSpacing={type.h2.spacing}
            color={colors.navy}
            text="Essential information"
            containerPadding="10px 0 0"
          />
        </Column>
      </Row>
      <Row
        className="wl-cards"
        backgroundColor={colors.white}
        padding="20px 16px 0"
        layout={ColumnLayouts.ThreeEqual}
      >
        {essentials.map((e) => (
          <Column key={e.title} padding="0 8px">
            <InfoCard icon={e.icon} title={e.title} body={e.body} />
          </Column>
        ))}
      </Row>

      {/* 8. Forecast */}
      <Row className="wl-section" backgroundColor={colors.white} padding="64px 24px 64px">
        <Column>
          <SectionLabel text="Seven day outlook" />
          <Divider borderTopWidth="0px" width="100%" containerPadding="8px 0 0" />
          <ForecastStrip days={forecast as unknown as never} />
        </Column>
      </Row>

      {/* 9. About — #about
          Two balanced halves (story beside the mission quote) over a four-up
          team row, so the section fills its width instead of trailing off into
          empty cream beside a narrow list. */}
      <Row className="wl-section" backgroundColor={colors.bg} padding="64px 24px 0">
        <Column>
          <Anchor id="about" />
          <SectionLabel text="About WANDERLUST" />
          <Heading
            level="h2"
            fontSize={type.h2.size}
            lineHeight={type.h2.line}
            fontWeight={type.h2.weight}
            letterSpacing={type.h2.spacing}
            color={colors.navy}
            text="The team behind your journey"
            containerPadding="10px 0 0"
          />
        </Column>
      </Row>
      <Row backgroundColor={colors.bg} padding="24px 24px 0" layout={ColumnLayouts.TwoEqual}>
        <Column padding="0 20px 0 0">
          <Paragraph
            fontSize={type.body.size}
            lineHeight={type.body.line}
            color={colors.body}
            text={aboutContent.story}
          />
          <Divider borderTopWidth="1px" borderTopColor={colors.border} width="100%" containerPadding="18px 0 14px" />
          <Paragraph
            fontSize={type.h3.size}
            lineHeight={type.h3.line}
            fontWeight={600}
            color={colors.navy}
            text="Our values"
            containerPadding="0 0 4px"
          />
          <CheckList items={aboutContent.values as unknown as never} />
        </Column>
        <Column padding="0 0 0 20px">
          <QuoteCard text={aboutContent.mission} attribution={`${brand.name}, Est. ${brand.established}`} />
        </Column>
      </Row>
      <Row className="wl-section" backgroundColor={colors.bg} padding="40px 24px 0">
        <Column>
          <SectionLabel text="The team" color={colors.warmGray} />
        </Column>
      </Row>
      <Row
        className="wl-cards"
        backgroundColor={colors.bg}
        padding="14px 18px 64px"
        layout={ColumnLayouts.FourEqual}
      >
        {aboutContent.team.map((m) => (
          <Column key={m.name} padding="0 6px">
            <TeamCard name={m.name} role={m.role} origin={m.origin} />
          </Column>
        ))}
      </Row>

      {/* 10. Footer — shared with the email and the printed itinerary. */}
      {footerRows({ variant: "web" })}
    </Page>
  );
}
