/**
 * Shared race data — the single source of truth consumed by all three
 * templates (Email, Page, Document). Swap this object for a row from your
 * timing database and every output updates together.
 */

export interface Split {
  point: string;
  time: string; // cumulative clock at this point
  segment: string; // time for this 5K segment
  pace: string; // pace over this segment, min/km
}

export const raceData = {
  event: {
    name: "Aurora Bay Marathon",
    edition: "12th Annual",
    date: "Sunday, October 18, 2026",
    location: "Aurora Bay, California",
    distance: "42.195 km · Marathon",
    website: "https://example.com/aurora-bay-marathon",
    resultsUrl: "https://example.com/results/TRK-2026-78432",
    certificateUrl: "https://example.com/certificate/TRK-2026-78432",
    photosUrl: "https://example.com/photos/bib-1204",
  },

  runner: {
    firstName: "Maya",
    lastName: "Chen",
    bib: "1204",
    division: "F 30–34",
    hometown: "Portland, Oregon",
  },

  result: {
    chipTime: "3:41:27",
    gunTime: "3:42:05",
    avgPace: "5:15", // min per km
    overallPlace: 187,
    overallField: 6240,
    genderPlace: 41,
    genderField: 2913,
    divisionPlace: 9,
    divisionField: 486,
    fasterThanPct: 97, // faster than % of the field
    negativeSplit: "1:52", // second half faster by
    verificationId: "TRK-2026-78432",
  },

  splits: [
    { point: "5 km", time: "26:41", segment: "26:41", pace: "5:20" },
    { point: "10 km", time: "53:04", segment: "26:23", pace: "5:17" },
    { point: "15 km", time: "1:19:31", segment: "26:27", pace: "5:17" },
    { point: "20 km", time: "1:45:48", segment: "26:17", pace: "5:15" },
    { point: "Half", time: "1:51:40", segment: "—", pace: "5:17" },
    { point: "25 km", time: "2:11:54", segment: "26:06", pace: "5:13" },
    { point: "30 km", time: "2:37:46", segment: "25:52", pace: "5:10" },
    { point: "35 km", time: "3:03:53", segment: "26:07", pace: "5:13" },
    { point: "40 km", time: "3:29:48", segment: "25:55", pace: "5:11" },
    { point: "Finish", time: "3:41:27", segment: "11:39", pace: "5:19" },
  ] satisfies Split[],
} as const;

export type RaceData = typeof raceData;

/** Splits formatted as string[][] for the <Table> component's `data` prop. */
export const splitsTableData: string[][] = raceData.splits.map((s) => [
  s.point,
  s.time,
  s.segment,
  `${s.pace} /km`,
]);

export const splitsTableHeaders = ["Checkpoint", "Race Clock", "Segment", "Pace"];
