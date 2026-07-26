/**
 * <Document> render mode — the print-ready itinerary.
 *
 * 700px fixed width, no background art, hairline borders and high contrast so
 * it survives a black-and-white laser printer. Page-break rules live in the
 * print stylesheet injected by src/render.tsx.
 */
import {
  Document,
  Row,
  Column,
  ColumnLayouts,
  Heading,
  Paragraph,
  Divider,
  Table,
} from "@unlayer/react-elements";
import {
  brand,
  booking,
  trip,
  hotel,
  pricing,
  itinerary,
  policies,
  flightTableHeaders,
  flightTableData,
} from "../lib/data";
import { colors, fonts, radius, type, hairlineBorder } from "../lib/theme";
import { icon } from "../lib/icons";
import { SectionLabel, SplitRow, DetailRow, PriceTable, DayBlock, PaidStamp } from "../lib/tools";
import { footerRows } from "./SiteFooter";

/** Hairline box around the flight table. */
const tableBorder = {
  borderTopWidth: "1px",
  borderRightWidth: "1px",
  borderBottomWidth: "1px",
  borderLeftWidth: "1px",
  borderTopColor: colors.border,
  borderRightColor: colors.border,
  borderBottomColor: colors.border,
  borderLeftColor: colors.border,
  borderTopStyle: "solid",
  borderRightStyle: "solid",
  borderBottomStyle: "solid",
  borderLeftStyle: "solid",
} as const;

/** Label above a value, repeated across the passenger block. */
function field(label: string, value: string, mono = false): string {
  return (
    `<div style="font-family:${fonts.body};font-size:10px;line-height:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${colors.warmGray};">${label}</div>` +
    `<div style="font-family:${mono ? fonts.mono : fonts.body};font-size:14px;line-height:20px;font-weight:600;color:${colors.navy};padding-top:4px;">${value}</div>`
  );
}

export default function ItineraryDocument() {
  return (
    <Document backgroundColor={colors.white} contentWidth="700px" fontFamily={fonts.body}>
      {/* 1. Header */}
      <Row backgroundColor={colors.white} padding="40px 40px 0">
        <Column>
          <SplitRow
            valign="top"
            left={`<span style="font-family:${fonts.body};font-size:22px;line-height:28px;font-weight:700;letter-spacing:2.5px;color:${colors.navy};">${brand.name}</span>`}
            right={
              `<div style="font-family:${fonts.body};font-size:15px;line-height:21px;font-weight:600;color:${colors.navy};">Travel Itinerary</div>` +
              `<div style="font-family:${fonts.mono};font-size:11px;line-height:16px;color:${colors.warmGray};padding-top:3px;">REF ${booking.reference}</div>`
            }
          />
          <Divider borderTopWidth="2px" borderTopColor={colors.navy} width="100%" containerPadding="14px 0 0" />
        </Column>
      </Row>

      {/* 2. Passenger and trip */}
      <Row className="wl-doc-block" backgroundColor={colors.white} padding="22px 40px 0">
        <Column backgroundColor={colors.bg} borderRadius={radius.md} padding="20px 24px">
          <SplitRow
            valign="top"
            left={
              field("Passenger", booking.passenger.name) +
              `<div style="font-family:${fonts.body};font-size:12px;line-height:19px;color:${colors.body};padding-top:8px;">${booking.passenger.email}<br />${booking.passenger.phone}</div>`
            }
            right={
              field("Trip details", trip.name) +
              `<div style="font-family:${fonts.body};font-size:12px;line-height:19px;color:${colors.body};padding-top:8px;">${trip.dates}<br />${trip.destination} · ${trip.nights} nights</div>`
            }
          />
        </Column>
      </Row>

      {/* 3. Flights */}
      <Row className="wl-doc-block wl-doc-flights" backgroundColor={colors.white} padding="28px 40px 0">
        <Column>
          <SectionLabel text="Flight summary" />
          <Divider borderTopWidth="0px" width="100%" containerPadding="10px 0 0" />
          {/* The `headers`/`data` shorthand is the ergonomic path, but this
              build of the Table exporter only honours per-cell colour and
              padding: headerBackgroundColor, headerColor, contentPadding and
              stripedRows are all dropped. Going through `values` sets the
              same styling on the cells themselves, which does render. */}
          <Table
            // `values` is typed as the complete TableValues, but the component
            // merges what it gets over its defaults, so a partial is correct at
            // runtime. The cast keeps the call site readable.
            values={{
              enableHeader: true,
              columns: flightTableHeaders.length,
              rows: flightTableData.length,
              border: tableBorder,
              table: {
                headers: [
                  {
                    height: 0,
                    cells: flightTableHeaders.map((h) => ({
                      width: 0,
                      text: `<span style="font-family:${fonts.body};font-size:10px;letter-spacing:0.8px;text-transform:uppercase;">${h}</span>`,
                      backgroundColor: colors.navy,
                      color: colors.white,
                      padding: "10px 12px",
                      textAlign: "left",
                    })),
                  },
                ],
                rows: flightTableData.map((row, i) => ({
                  height: 0,
                  cells: row.map((cellText, j) => ({
                    width: 0,
                    // nowrap because browsers will happily break "14:55+1"
                    // after the plus sign, which reads as a second row.
                    text: `<span style="font-family:${fonts.body};font-size:12px;white-space:nowrap;${
                      j === 0 ? `font-weight:600;color:${colors.navy};` : ""
                    }">${cellText}</span>`,
                    // Striped rows, set per cell because stripedRows is ignored.
                    backgroundColor: i % 2 === 1 ? colors.bg : colors.white,
                    color: colors.body,
                    padding: "11px 12px",
                    textAlign: "left",
                  })),
                })),
                footers: [],
              },
            } as unknown as NonNullable<React.ComponentProps<typeof Table>["values"]>}
          />
        </Column>
      </Row>

      {/* 4. Accommodation */}
      <Row className="wl-doc-block" backgroundColor={colors.white} padding="28px 40px 0">
        <Column
          backgroundColor={colors.white}
          border={{
            borderTopWidth: "1px",
            borderRightWidth: "1px",
            borderBottomWidth: "1px",
            borderLeftWidth: "4px",
            borderTopColor: colors.border,
            borderRightColor: colors.border,
            borderBottomColor: colors.border,
            borderLeftColor: colors.teal,
            borderTopStyle: "solid",
            borderRightStyle: "solid",
            borderBottomStyle: "solid",
            borderLeftStyle: "solid",
          }}
          borderRadius={radius.md}
          padding="20px 24px"
        >
          <SplitRow
            valign="top"
            left={
              `<div style="font-family:${fonts.body};font-size:10px;line-height:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${colors.teal};">Accommodation</div>` +
              `<div style="font-family:${fonts.body};font-size:${type.h3.size};line-height:${type.h3.line};font-weight:700;color:${colors.navy};padding-top:6px;">${hotel.name}</div>` +
              `<div style="font-family:${fonts.body};font-size:12px;line-height:18px;color:${colors.body};padding-top:4px;">${hotel.address}</div>`
            }
            right={
              `<div style="font-family:${fonts.body};font-size:10px;line-height:14px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:${colors.warmGray};">Confirmation</div>` +
              `<div style="font-family:${fonts.mono};font-size:14px;line-height:20px;font-weight:500;color:${colors.navy};padding-top:5px;white-space:nowrap;">${hotel.confirmation}</div>`
            }
          />
          <Divider borderTopWidth="1px" borderTopColor={colors.hairline} width="100%" containerPadding="16px 0 14px" />
          <DetailRow
            items={
              [
                { icon: "calendar", label: "Check in", value: `${hotel.checkIn}, ${hotel.checkInTime}` },
                { icon: "calendarOut", label: "Check out", value: `${hotel.checkOut}, ${hotel.checkOutTime}` },
                { icon: "bed", label: "Room", value: hotel.room },
              ] as unknown as never
            }
          />
        </Column>
      </Row>

      {/* 5. Day by day */}
      <Row backgroundColor={colors.white} padding="30px 40px 0">
        <Column>
          <SectionLabel text="Detailed itinerary" />
          <Divider borderTopWidth="0px" width="100%" containerPadding="10px 0 0" />
        </Column>
      </Row>
      {itinerary.map((day) => (
        <Row key={day.day} className="wl-doc-day" backgroundColor={colors.white} padding="0 40px">
          <Column>
            <DayBlock
              day={day.day}
              date={day.dateShort}
              theme={day.theme}
              activities={day.activities as unknown as never}
            />
          </Column>
        </Row>
      ))}

      {/* 6. Pricing */}
      <Row
        className="wl-doc-block"
        backgroundColor={colors.white}
        padding="22px 40px 0"
        layout={ColumnLayouts.TwoEqual}
      >
        <Column padding="16px 0 0">
          <PaidStamp text={pricing.paidLabel} />
        </Column>
        <Column>
          <PriceTable
            rows={
              [
                { label: "Subtotal", value: pricing.subtotal },
                { label: "Taxes and fees", value: pricing.taxes },
              ] as unknown as never
            }
            totalLabel={`Total ${pricing.currency}`}
            totalValue={pricing.total}
            note={pricing.note}
          />
        </Column>
      </Row>

      {/* 7. Policies */}
      <Row className="wl-doc-block" backgroundColor={colors.white} padding="30px 40px 0">
        <Column>
          <Divider borderTopWidth="1px" borderTopColor={colors.border} width="100%" containerPadding="0 0 18px" />
          <SectionLabel text="Important notes and policies" color={colors.navy} />
        </Column>
      </Row>
      <Row
        className="wl-doc-block"
        backgroundColor={colors.white}
        padding="14px 40px 0"
        layout={ColumnLayouts.ThreeEqual}
      >
        {policies.map((p) => (
          <Column key={p.title} padding="0 12px 0 0">
            <Heading
              level="h4"
              fontSize="12px"
              lineHeight="17px"
              fontWeight={700}
              color={colors.navy}
              text={p.title}
            />
            <Paragraph
              fontSize={type.print.size}
              lineHeight="16px"
              color={colors.body}
              text={p.body}
            />
          </Column>
        ))}
      </Row>

      {/* 8. Footer — the same three columns as the page and the email, in the
          print variant: no dark fill to soak a sheet in toner. */}
      {footerRows({ variant: "print", padding: "40px" })}
      <Row backgroundColor={colors.white} padding="0 40px 40px">
        <Column>
          <SplitRow
            left={
              `<span style="font-family:${fonts.body};font-size:10px;line-height:15px;color:${colors.warmGray};"><span class="wl-pagenum">Page 1</span>, ${icon("phone", colors.warmGray, 10)} ${brand.supportPhone}</span>`
            }
            right={
              `<span style="font-family:${fonts.body};font-size:10px;line-height:15px;color:${colors.warmGray};">${brand.website}</span>`
            }
          />
        </Column>
      </Row>
    </Document>
  );
}
