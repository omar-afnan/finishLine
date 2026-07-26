/**
 * <Document> render mode — the official finisher certificate + results record.
 * Print-optimized output for PDF generation.
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
import { raceData, splitsTableData, splitsTableHeaders } from "../lib/data";
import { colors, fonts } from "../lib/theme";
import { StatTile } from "../lib/tools";

const { event, runner, result } = raceData;

export default function FinisherCertificate() {
  return (
    <Document backgroundColor="#ffffff" contentWidth="700px" fontFamily={fonts.body}>
      {/* Formal header */}
      <Row padding="48px 56px 0">
        <Column>
          <Paragraph
            color={colors.gold}
            fontSize="11px"
            fontWeight={700}
            letterSpacing="3px"
            textAlign="center"
            text="OFFICIAL FINISHER CERTIFICATE"
          />
          <Heading
            level="h1"
            fontFamily={fonts.display}
            fontSize="34px"
            lineHeight="42px"
            fontWeight={800}
            color={colors.night}
            textAlign="center"
            text={event.name}
          />
          <Paragraph color={colors.slate} fontSize="13px" lineHeight="20px" textAlign="center">
            {`${event.edition} · ${event.date} · ${event.location}`}
          </Paragraph>
        </Column>
      </Row>

      <Row padding="14px 56px 0">
        <Column>
          <Divider borderTopWidth="2px" borderTopColor={colors.gold} width="120px" />
          <Divider borderTopWidth="1px" borderTopColor={colors.line} width="100%" />
        </Column>
      </Row>

      {/* Certificate statement */}
      <Row padding="30px 56px 0">
        <Column>
          <Paragraph color={colors.slate} fontSize="14px" lineHeight="22px" textAlign="center" text="This certifies that" />
          <Heading
            level="h2"
            fontFamily={fonts.display}
            fontSize="48px"
            lineHeight="58px"
            fontWeight={800}
            color={colors.ink}
            textAlign="center"
            text={`${runner.firstName} ${runner.lastName}`}
          />
          <Paragraph color={colors.slate} fontSize="14px" lineHeight="22px" textAlign="center">
            {`Bib #${runner.bib} · ${runner.hometown} · Division ${runner.division}`}
          </Paragraph>
          <Paragraph
            color={colors.ink}
            fontSize="15px"
            lineHeight="24px"
            textAlign="center"
            text={`completed the ${event.name} (42.195 km) in an official chip time of`}
          />
          <Heading
            level="h3"
            fontFamily={fonts.display}
            fontSize="44px"
            lineHeight="52px"
            fontWeight={800}
            color={colors.accent}
            textAlign="center"
            text={result.chipTime}
          />
          <Paragraph color={colors.faint} fontSize="12px" lineHeight="18px" textAlign="center">
            {`Gun time ${result.gunTime} · Average pace ${result.avgPace} /km`}
          </Paragraph>
        </Column>
      </Row>

      {/* Placement tiles */}
      <Row layout={ColumnLayouts.ThreeEqual} padding="18px 48px 6px">
        <Column padding="0 6px">
          <StatTile
            value={`#${result.overallPlace}`}
            label="Overall"
            sub={`of ${result.overallField.toLocaleString()}`}
            background={colors.mist}
          />
        </Column>
        <Column padding="0 6px">
          <StatTile
            value={`#${result.genderPlace}`}
            label="Women"
            sub={`of ${result.genderField.toLocaleString()}`}
            background={colors.mist}
          />
        </Column>
        <Column padding="0 6px">
          <StatTile
            value={`#${result.divisionPlace}`}
            label={runner.division}
            sub={`of ${result.divisionField}`}
            valueColor={colors.gold}
            background={colors.mist}
          />
        </Column>
      </Row>

      {/* Official results record */}
      <Row padding="26px 56px 0">
        <Column>
          <Heading
            level="h4"
            fontFamily={fonts.display}
            fontSize="16px"
            fontWeight={700}
            letterSpacing="1px"
            color={colors.night}
            text="OFFICIAL RESULTS RECORD"
          />
          <Table
            headers={[...splitsTableHeaders]}
            data={splitsTableData}
            padding="8px 10px"
            contentFontSize="13px"
            headerFontSize="13px"
            headerBackgroundColor={colors.night}
            headerColor="#ffffff"
            stripedRows={true}
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

      {/* Verification footer */}
      <Row padding="30px 56px 0">
        <Column>
          <Divider borderTopWidth="1px" borderTopColor={colors.line} width="100%" />
        </Column>
      </Row>

      <Row layout={ColumnLayouts.TwoEqual} padding="14px 56px 0">
        <Column padding="0 10px 0 0">
          <Paragraph color={colors.slate} fontSize="12px" lineHeight="18px" textAlign="left">
            {`Verification ID ${result.verificationId}`}
          </Paragraph>
          <Paragraph
            color={colors.faint}
            fontSize="12px"
            lineHeight="18px"
            textAlign="left"
            text="Times certified by the race referee."
          />
        </Column>
        <Column padding="26px 0 0 10px">
          <Divider borderTopWidth="1px" borderTopColor={colors.ink} width="80%" />
          <Paragraph color={colors.slate} fontSize="12px" lineHeight="18px" textAlign="right" text="Race Director" />
        </Column>
      </Row>

      <Row padding="10px 56px 48px">
        <Column>
          <Paragraph color={colors.faint} fontSize="11px" lineHeight="16px" textAlign="center">
            {`Chip timing and results by Aurora Bay Timing Partners · ${event.resultsUrl}`}
          </Paragraph>
        </Column>
      </Row>
    </Document>
  );
}
