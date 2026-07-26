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
  Menu,
  Social,
} from "@unlayer/react-elements";
import {
  brand,
  booking,
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
  TeamList,
} from "../lib/tools";

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
          <Menu
            items={navLinks.map((l) => ({ text: l.text, href: l.href }))}
            fontSize="14px"
            textColor={colors.body}
            align="center"
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
        padding="24px 24px 0"
        layout={ColumnLayouts.FourEqual}
      >
        {quickFacts.map((f) => (
          <Column
            key={f.label}
            backgroundColor={colors.bg}
            padding="18px 20px"
            borderRadius={radius.md}
          >
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

      {/* 9. About — #about */}
      <Row className="wl-section" backgroundColor={colors.bg} padding="64px 24px 24px">
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
      <Row backgroundColor={colors.bg} padding="0 24px 64px" layout={ColumnLayouts.TwoWideNarrow}>
        <Column padding="0 32px 0 0">
          <Paragraph
            fontSize={type.body.size}
            lineHeight={type.body.line}
            color={colors.body}
            text={aboutContent.story}
          />
          <Divider borderTopWidth="1px" borderTopColor={colors.border} width="100%" containerPadding="20px 0 16px" />
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
        <Column>
          <Paragraph
            fontSize={type.h3.size}
            lineHeight={type.h3.line}
            fontWeight={600}
            color={colors.navy}
            text="Team"
            containerPadding="0 0 6px"
          />
          <TeamList members={aboutContent.team as unknown as never} />
        </Column>
      </Row>

      {/* 10. Footer */}
      <Row backgroundColor={colors.navy} padding="56px 24px 24px" layout={ColumnLayouts.ThreeEqual}>
        <Column padding="0 24px 0 0">
          <Paragraph
            html={`<span style="font-family:${fonts.body};font-size:19px;line-height:26px;font-weight:700;letter-spacing:2px;color:${colors.white};">${brand.name}</span>`}
          />
          <Paragraph
            fontSize={type.small.size}
            lineHeight={type.small.line}
            color={colors.onNavyMuted}
            text={`${brand.tagline}. Crafting journeys for the mindful explorer since ${brand.established}.`}
          />
        </Column>
        <Column>
          <Paragraph
            html={`<span style="font-family:${fonts.body};font-size:11px;line-height:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${colors.white};">Support</span>`}
          />
          <Paragraph
            fontSize={type.small.size}
            lineHeight="24px"
            color={colors.onNavyMuted}
            html={
              `<a href="${links.contact}" class="wl-flink" style="color:${colors.onNavyMuted};text-decoration:none;">Contact concierge</a><br />` +
              `<a href="tel:+15552345678" class="wl-flink" style="color:${colors.onNavyMuted};text-decoration:none;">${brand.supportPhone}</a><br />` +
              `<a href="mailto:${brand.supportEmail}" class="wl-flink" style="color:${colors.onNavyMuted};text-decoration:none;">${brand.supportEmail}</a>`
            }
          />
        </Column>
        <Column>
          <Paragraph
            html={`<span style="font-family:${fonts.body};font-size:11px;line-height:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${colors.white};">Legal</span>`}
          />
          <Paragraph
            fontSize={type.small.size}
            lineHeight="24px"
            color={colors.onNavyMuted}
            html={
              `<a href="${links.privacy}" class="wl-flink" style="color:${colors.onNavyMuted};text-decoration:none;">Privacy policy</a><br />` +
              `<a href="${links.terms}" class="wl-flink" style="color:${colors.onNavyMuted};text-decoration:none;">Terms of service</a><br />` +
              `<a href="${links.unsubscribe}" class="wl-flink" style="color:${colors.onNavyMuted};text-decoration:none;">Email preferences</a>`
            }
          />
        </Column>
      </Row>
      <Row backgroundColor={colors.navy} padding="0 24px 40px">
        <Column>
          <Divider borderTopWidth="1px" borderTopColor="#1E293B" width="100%" containerPadding="0 0 20px" />
          <Social
            icons={[
              { name: "Instagram", url: "https://instagram.com/example" },
              { name: "X", url: "https://x.com/example" },
              { name: "Facebook", url: "https://facebook.com/example" },
            ]}
            iconType="circle"
            iconSize={28}
            spacing={10}
            align="left"
          />
          <Paragraph
            fontSize="11px"
            lineHeight="16px"
            color={colors.onNavyMuted}
            text={`© ${brand.established + 8} ${brand.legalName} · ${brand.city} · Booking ${booking.reference}`}
          />
        </Column>
      </Row>
    </Page>
  );
}
