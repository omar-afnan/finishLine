/**
 * <Email> render mode — the booking confirmation.
 *
 * 600px fixed width, table-based output, solid colour fills only. Cards are
 * Columns carrying their own background, radius and border, so the layout
 * survives Outlook without a single background image behind text.
 */
import {
  Email,
  Row,
  Column,
  ColumnLayouts,
  Heading,
  Paragraph,
  Button,
  Divider,
  Html,
  Image,
  Social,
} from "@unlayer/react-elements";
import {
  brand,
  booking,
  trip,
  flights,
  hotel,
  pricing,
  inclusions,
  links,
  images,
} from "../lib/data";
import { colors, fonts, radius, type, hairlineBorder } from "../lib/theme";
import { icon } from "../lib/icons";
import {
  SectionLabel,
  SplitRow,
  TripTimeline,
  IconTile,
  FlightLeg,
  DetailRow,
  PriceTable,
} from "../lib/tools";

const card = {
  backgroundColor: colors.white,
  borderRadius: radius.md,
  border: hairlineBorder(),
  padding: "20px",
};

export default function BookingEmail() {
  return (
    <Email
      backgroundColor={colors.bg}
      contentWidth="600px"
      fontFamily={fonts.body}
      previewText={`${trip.destination}, ${trip.dates}. Reference ${booking.reference}. Everything is confirmed.`}
    >
      {/* 1. Header bar */}
      <Row backgroundColor={colors.white} padding="20px 24px">
        <Column>
          <SplitRow
            left={`<span style="font-family:${fonts.body};font-size:20px;line-height:26px;font-weight:700;letter-spacing:2px;color:${colors.navy};">${brand.name}</span>`}
            right={`<span style="display:inline-block;background-color:${colors.tealLight};border-radius:${radius.pill};padding:6px 13px;font-family:${fonts.body};font-size:11px;line-height:16px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${colors.teal};white-space:nowrap;">${booking.status}</span>`}
          />
        </Column>
      </Row>

      {/* 2. Hero. Solid tint rather than a gradient, so every client agrees. */}
      <Row backgroundColor={colors.tealLight} padding="44px 24px 40px">
        <Column>
          <Heading
            level="h1"
            fontSize={type.h1.size}
            lineHeight={type.h1.line}
            fontWeight={type.h1.weight}
            letterSpacing={type.h1.spacing}
            color={colors.navy}
            text={`Your ${trip.city} adventure awaits`}
          />
          {/* Accent rule. Html rather than Divider, because Divider centres
              its width and the brief calls for a left-aligned 56px mark. */}
          <Html
            html={`<div style="width:56px;height:3px;background-color:${colors.teal};margin:16px 0 14px;font-size:0;line-height:0;">&nbsp;</div>`}
          />
          <Paragraph
            fontSize={type.body.size}
            lineHeight={type.body.line}
            color={colors.body}
            html={`Prepared for <strong style="color:${colors.navy};">${booking.passenger.name}</strong>`}
          />
          <Paragraph
            fontSize={type.small.size}
            lineHeight={type.small.line}
            color={colors.warmGray}
            text={`Booking reference: ${booking.reference}`}
          />
        </Column>
      </Row>

      {/* 3. Trip summary */}
      <Row backgroundColor={colors.bg} padding="28px 24px 0">
        <Column {...card}>
          <SplitRow
            valign="top"
            left={
              `<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>` +
              `<td valign="middle" style="line-height:0;padding-right:9px;">${icon("mapPin", colors.teal, 18)}</td>` +
              `<td valign="middle" style="font-family:${fonts.body};font-size:${type.h2.size};line-height:${type.h2.line};font-weight:${type.h2.weight};letter-spacing:${type.h2.spacing};color:${colors.navy};">${trip.destination}</td>` +
              `</tr></table>` +
              `<div style="font-family:${fonts.body};font-size:${type.body.size};line-height:${type.body.line};color:${colors.warmGray};padding-top:6px;">${trip.dates}</div>`
            }
            right={`<span style="display:inline-block;background-color:${colors.teal};border-radius:${radius.pill};padding:9px 15px;font-family:${fonts.body};font-size:12px;line-height:16px;font-weight:700;color:${colors.white};white-space:nowrap;">${trip.nights} Nights</span>`}
          />
          <Divider
            borderTopWidth="1px"
            borderTopColor={colors.hairline}
            width="100%"
            containerPadding="18px 0 16px"
          />
          <TripTimeline legs={trip.legs as unknown as never} />
        </Column>
      </Row>

      {/* 4. Flights */}
      <Row backgroundColor={colors.bg} padding="24px 24px 0">
        <Column>
          <SectionLabel text="Flight details" />
        </Column>
      </Row>
      {flights.map((f) => (
        <Row key={f.number} backgroundColor={colors.bg} padding="12px 24px 0">
          <Column>
            <FlightLeg
              direction={f.direction}
              airline={f.airline}
              number={f.number}
              fromCode={f.fromCode}
              fromCity={f.fromCity}
              toCode={f.toCode}
              toCity={f.toCity}
              departTime={f.departTime}
              departDate={f.departDate}
              duration={f.duration}
              cabin={f.cabin}
            />
          </Column>
        </Row>
      ))}

      {/* 5. Accommodation */}
      <Row backgroundColor={colors.bg} padding="26px 24px 0">
        <Column>
          <SectionLabel text="Accommodation" />
        </Column>
      </Row>
      <Row backgroundColor={colors.bg} padding="12px 24px 0" layout={ColumnLayouts.TwoNarrowWide}>
        <Column
          backgroundColor={colors.white}
          border={hairlineBorder()}
          borderRadius={radius.md}
          padding="0"
        >
          <Image src={images.hotel} alt={`Exterior of ${hotel.name}`} />
        </Column>
        <Column
          backgroundColor={colors.white}
          border={hairlineBorder()}
          borderRadius={radius.md}
          padding="18px 20px"
        >
          <Heading
            level="h3"
            fontSize={type.h3.size}
            lineHeight={type.h3.line}
            fontWeight={type.h3.weight}
            color={colors.navy}
            text={hotel.name}
          />
          <Paragraph
            fontSize={type.small.size}
            lineHeight={type.small.line}
            color={colors.warmGray}
            text={hotel.address}
          />
          <Paragraph
            fontSize={type.body.size}
            lineHeight={type.body.line}
            color={colors.body}
            text={hotel.room}
          />
          <DetailRow
            items={
              [
                { icon: "calendar", label: "Check in", value: `${hotel.checkIn}, ${hotel.checkInTime}` },
                { icon: "calendarOut", label: "Check out", value: `${hotel.checkOut}, ${hotel.checkOutTime}` },
              ] as unknown as never
            }
          />
          <Paragraph
            fontSize={type.small.size}
            lineHeight={type.small.line}
            color={colors.warmGray}
            html={`Confirmation <span style="font-family:${fonts.mono};color:${colors.navy};">${hotel.confirmation}</span>`}
          />
        </Column>
      </Row>

      {/* 6. Pricing */}
      <Row backgroundColor={colors.bg} padding="26px 24px 0">
        <Column
          backgroundColor={colors.tealLight}
          borderRadius={radius.md}
          border={hairlineBorder("#CCFBF1")}
          padding="20px"
        >
          <SectionLabel text="Pricing summary" />
          <Divider borderTopWidth="0px" width="100%" containerPadding="8px 0 0" />
          <PriceTable
            rows={
              [
                { label: "Subtotal", value: pricing.subtotal },
                { label: "Taxes and fees", value: pricing.taxes },
              ] as unknown as never
            }
            totalLabel="Total paid"
            totalValue={pricing.total}
            note={pricing.note}
          />
        </Column>
      </Row>

      {/* 7. What's included */}
      <Row backgroundColor={colors.bg} padding="28px 24px 0">
        <Column>
          <SectionLabel text="What's included" />
        </Column>
      </Row>
      <Row backgroundColor={colors.bg} padding="12px 16px 0" layout={ColumnLayouts.FourEqual}>
        {inclusions.map((item) => (
          <Column key={item.label} padding="0 8px">
            <IconTile icon={item.icon} label={item.label} detail={item.detail} />
          </Column>
        ))}
      </Row>

      {/* 8. Calls to action. Both buttons clear the 44px touch target. */}
      <Row backgroundColor={colors.bg} padding="30px 24px 0" layout={ColumnLayouts.TwoEqual}>
        <Column padding="0 6px 0 0">
          <Button
            href={links.itinerary}
            backgroundColor={colors.teal}
            color={colors.white}
            fontSize={type.body.size}
            fontWeight={600}
            width="100%"
            padding="15px 12px"
            borderRadius={radius.md}
          >
            View full itinerary
          </Button>
        </Column>
        <Column padding="0 0 0 6px">
          <Button
            href={links.pdf}
            backgroundColor={colors.white}
            color={colors.teal}
            fontSize={type.body.size}
            fontWeight={600}
            width="100%"
            padding="15px 12px"
            borderRadius={radius.md}
            border={hairlineBorder(colors.teal)}
          >
            Download PDF
          </Button>
        </Column>
      </Row>

      {/* 9. Footer */}
      <Row backgroundColor={colors.bg} padding="34px 24px 0">
        <Column>
          <Divider borderTopWidth="1px" borderTopColor={colors.border} width="100%" />
        </Column>
      </Row>
      <Row backgroundColor={colors.bg} padding="22px 24px 8px">
        <Column>
          <Paragraph
            fontSize={type.body.size}
            lineHeight={type.body.line}
            color={colors.body}
            html={`Questions? Reply to this email or call <a href="tel:+15552345678" style="display:inline-block;padding:11px 2px;color:${colors.teal};text-decoration:none;font-weight:600;">${brand.supportPhone}</a>. Your concierge is available 24 hours.`}
          />
        </Column>
      </Row>
      <Row backgroundColor={colors.bg} padding="0 24px 8px">
        <Column>
          <Social
            icons={[
              { name: "Instagram", url: "https://instagram.com/example" },
              { name: "X", url: "https://x.com/example" },
              { name: "Facebook", url: "https://facebook.com/example" },
            ]}
            iconType="circle"
            // 44 rather than the 26 the desktop mock uses: these are the only
            // icon-only targets in the email, and the email has no stylesheet
            // to grow the hit area with, so the glyph itself has to carry the
            // full thumb target.
            iconSize={44}
            spacing={10}
            align="left"
          />
        </Column>
      </Row>
      <Row backgroundColor={colors.bg} padding="6px 24px 40px">
        <Column>
          <Paragraph
            fontSize={type.small.size}
            lineHeight={type.small.line}
            color={colors.warmGray}
            text={`${brand.legalName} · ${brand.city} · ${brand.tagline}`}
          />
          <Paragraph
            fontSize="11px"
            lineHeight="16px"
            color={colors.warmGray}
            // inline-block padding rather than a stylesheet rule: this is the
            // one lever that works in every client, and it lifts the legal
            // links from a 13px line to a 44px thumb target.
            html={`<a href="${links.unsubscribe}" style="display:inline-block;padding:14px 6px;color:${colors.warmGray};text-decoration:underline;">Unsubscribe</a>&nbsp;·&nbsp;<a href="${links.privacy}" style="display:inline-block;padding:14px 6px;color:${colors.warmGray};text-decoration:underline;">Privacy</a>&nbsp;·&nbsp;<a href="${links.terms}" style="display:inline-block;padding:14px 6px;color:${colors.warmGray};text-decoration:underline;">Terms</a>`}
          />
        </Column>
      </Row>
    </Email>
  );
}
