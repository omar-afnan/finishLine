/**
 * <Page> render mode — the public results page for the same runner.
 * Same data, rendered as responsive flexbox web HTML.
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
  Table,
  Image,
  Menu,
  Social,
} from "@unlayer/react-elements";
import { raceData, splitsTableData, splitsTableHeaders } from "../lib/data";
import { colors, fonts } from "../lib/theme";
import { StatTile, FieldBar } from "../lib/tools";

const { event, runner, result } = raceData;

const heroImage =
  "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&w=1600&q=80";
const galleryImages = [
  "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1502904550040-7534597429ae?auto=format&fit=crop&w=800&q=80",
];

export default function ResultsPage() {
  return (
    <Page backgroundColor={colors.paper} contentWidth="960px" fontFamily={fonts.body}>
      {/* Nav */}
      <Row layout={ColumnLayouts.TwoWideNarrow} backgroundColor={colors.night} padding="18px 48px">
        <Column>
          <Paragraph
            color="#ffffff"
            fontSize="16px"
            fontWeight={800}
            fontFamily={fonts.display}
            textAlign="left"
            html={`FINISH LINE&nbsp;&nbsp;<span style="color:${colors.accent};">/</span>&nbsp;&nbsp;<span style="color:#9aa7b8;font-weight:500;">Results</span>`}
          />
        </Column>
        <Column>
          <Menu
            items={[
              { text: "Results", href: event.resultsUrl },
              { text: "Photos", href: event.photosUrl },
              { text: "2027 Entry", href: event.website },
            ]}
            fontSize="14px"
            textColor="#c6cfda"
            align="right"
          />
        </Column>
      </Row>

      {/* Hero */}
      <Row backgroundColor={colors.night} padding="0">
        <Column>
          <Image src={heroImage} alt="Runners crossing the marathon finish line at dawn" />
        </Column>
      </Row>

      <Row backgroundColor={colors.night} padding="40px 48px 48px">
        <Column>
          <Paragraph
            color={colors.accent}
            fontSize="13px"
            fontWeight={700}
            letterSpacing="2px"
            text={`${event.edition.toUpperCase()} · ${event.date.toUpperCase()}`}
          />
          <Heading
            level="h1"
            fontFamily={fonts.display}
            fontSize="46px"
            lineHeight="54px"
            fontWeight={800}
            color="#ffffff"
            text={`${runner.firstName} ${runner.lastName}`}
          />
          <Paragraph color="#9aa7b8" fontSize="16px" lineHeight="26px">
            {`Bib #${runner.bib} · ${runner.division} · ${runner.hometown} · ${event.distance}`}
          </Paragraph>
          <Heading
            level="h2"
            fontFamily={fonts.display}
            fontSize="72px"
            lineHeight="80px"
            fontWeight={800}
            color="#ffffff"
            text={result.chipTime}
          />
          <Paragraph color="#9aa7b8" fontSize="15px">
            {`Chip time · avg pace ${result.avgPace} /km`}
          </Paragraph>
        </Column>
      </Row>

      {/* Stat tiles */}
      <Row layout={ColumnLayouts.ThreeEqual} padding="40px 40px 8px">
        <Column padding="0 8px">
          <StatTile
            value={`#${result.overallPlace}`}
            label="Overall"
            sub={`of ${result.overallField.toLocaleString()} finishers`}
          />
        </Column>
        <Column padding="0 8px">
          <StatTile
            value={`#${result.genderPlace}`}
            label="Women"
            sub={`of ${result.genderField.toLocaleString()}`}
          />
        </Column>
        <Column padding="0 8px">
          <StatTile
            value={`#${result.divisionPlace}`}
            label={`Division ${runner.division}`}
            sub={`of ${result.divisionField}`}
            valueColor={colors.accent}
          />
        </Column>
      </Row>

      <Row padding="24px 48px 8px">
        <Column>
          <FieldBar
            percent={result.fasterThanPct}
            label={`Faster than ${result.fasterThanPct}% of the field · negative split by ${result.negativeSplit}`}
          />
        </Column>
      </Row>

      {/* Splits table */}
      <Row padding="32px 48px 8px">
        <Column>
          <Heading
            level="h3"
            fontFamily={fonts.display}
            fontSize="24px"
            fontWeight={700}
            color={colors.ink}
            text="Split analysis"
          />
          <Paragraph color={colors.slate} fontSize="15px" lineHeight="24px">
            Chip-timed checkpoints every 5 kilometres. Maya held her pace through the wall and
            closed with her fastest 10K of the day.
          </Paragraph>
          <Table
            headers={[...splitsTableHeaders]}
            data={splitsTableData}
            contentFontSize="14px"
            headerFontSize="14px"
            contentPadding="10px 14px"
            headerPadding="10px 14px"
            headerBackgroundColor={colors.night}
            headerColor="#ffffff"
            contentColor={colors.ink}
            stripedRows
            stripedRowsBackgroundColor={colors.mist}
            border={{
              borderTopWidth: "0px",
              borderRightWidth: "0px",
              borderBottomWidth: "1px",
              borderLeftWidth: "0px",
              borderBottomColor: colors.line,
              borderBottomStyle: "solid",
            }}
          />
        </Column>
      </Row>

      {/* Photo gallery */}
      <Row layout={ColumnLayouts.ThreeEqual} padding="32px 40px 8px">
        {galleryImages.map((src, i) => (
          <Column key={i} padding="0 8px">
            <Image src={src} alt={`Race day photo ${i + 1}`} />
          </Column>
        ))}
      </Row>

      {/* CTA band */}
      <Row backgroundColor={colors.mist} padding="48px 48px" style={{ marginTop: "32px" }}>
        <Column>
          <Heading
            level="h3"
            fontFamily={fonts.display}
            fontSize="26px"
            fontWeight={800}
            color={colors.ink}
            textAlign="center"
            text="Make it official."
          />
          <Paragraph color={colors.slate} fontSize="15px" lineHeight="24px" textAlign="center">
            Download your finisher certificate, grab your photos, and lock in your 2027 entry
            before early-bird pricing ends.
          </Paragraph>
        </Column>
      </Row>
      <Row layout={ColumnLayouts.ThreeEqual} backgroundColor={colors.mist} padding="0 40px 48px">
        <Column padding="0 8px">
          <Button
            href={event.certificateUrl}
            backgroundColor={colors.accent}
            color="#ffffff"
            fontWeight={700}
            width="100%"
            padding="14px 10px"
            borderRadius="8px"
          >
            Finisher certificate
          </Button>
        </Column>
        <Column padding="0 8px">
          <Button
            href={event.photosUrl}
            backgroundColor={colors.night}
            color="#ffffff"
            fontWeight={700}
            width="100%"
            padding="14px 10px"
            borderRadius="8px"
          >
            Race photos
          </Button>
        </Column>
        <Column padding="0 8px">
          <Button
            href={event.website}
            backgroundColor="#ffffff"
            color={colors.ink}
            fontWeight={700}
            width="100%"
            padding="14px 10px"
            borderRadius="8px"
            border={{
              borderTopWidth: "1px",
              borderRightWidth: "1px",
              borderBottomWidth: "1px",
              borderLeftWidth: "1px",
              borderTopColor: colors.line,
              borderRightColor: colors.line,
              borderBottomColor: colors.line,
              borderLeftColor: colors.line,
              borderTopStyle: "solid",
              borderRightStyle: "solid",
              borderBottomStyle: "solid",
              borderLeftStyle: "solid",
            }}
          >
            Enter 2027
          </Button>
        </Column>
      </Row>

      {/* Footer */}
      <Row backgroundColor={colors.night} padding="36px 48px">
        <Column>
          <Social
            icons={[
              { name: "Instagram", url: "https://instagram.com/example" },
              { name: "X", url: "https://x.com/example" },
              { name: "Facebook", url: "https://facebook.com/example" },
            ]}
            iconType="circle"
            iconSize={32}
            spacing={12}
            align="center"
          />
          <Paragraph color="#9aa7b8" fontSize="13px" textAlign="center">
            {`${event.name} · ${event.location} · Result ID ${result.verificationId}`}
          </Paragraph>
          <Divider borderTopWidth="1px" borderTopColor="#1e2b40" width="40%" />
          <Paragraph color="#5b6b80" fontSize="12px" textAlign="center">
            Built with Unlayer Elements — one codebase, three render modes.
          </Paragraph>
        </Column>
      </Row>
    </Page>
  );
}
