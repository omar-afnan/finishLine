/**
 * Single source of truth for the whole booking.
 *
 * All three templates import from here, so swapping this object for a row out
 * of a real reservation system updates the email, the destination page and the
 * printed itinerary together. Nothing below is duplicated in a template.
 *
 * Sample data is fictional.
 */

export const brand = {
  name: "WANDERLUST",
  tagline: "Curated Journeys, Crafted for You",
  legalName: "WANDERLUST Inc.",
  city: "San Francisco, CA",
  website: "wanderlust.example.com",
  websiteUrl: "https://wanderlust.example.com",
  supportEmail: "concierge@wanderlust.example.com",
  supportPhone: "+1 (555) 234-5678",
  established: 2018,
} as const;

export const booking = {
  reference: "TRV-2026-78432",
  status: "Booking Confirmed",
  issued: "July 26, 2026",
  passenger: {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    phone: "+1 (555) 908-4471",
  },
} as const;

export const trip = {
  name: "Tokyo Explorer",
  destination: "Tokyo, Japan",
  city: "Tokyo",
  country: "Japan",
  dates: "Aug 15 to Aug 22, 2026",
  datesShort: "Aug 15 to 22",
  startDate: "August 15, 2026",
  endDate: "August 22, 2026",
  nights: 6,
  packageName: "Premium Package",
  /** Journey beads for the horizontal trip timeline. */
  legs: [
    { code: "SFO", label: "Depart", state: "done" as const },
    { code: "NRT", label: "Arrive", state: "done" as const },
    { code: "6 NIGHTS", label: "Stay", state: "current" as const },
    { code: "NRT", label: "Depart", state: "upcoming" as const },
    { code: "SFO", label: "Home", state: "upcoming" as const },
  ],
} as const;

export const flights = [
  {
    direction: "Outbound",
    airline: "Japan Airlines",
    number: "JL061",
    fromCode: "SFO",
    fromCity: "San Francisco",
    toCode: "NRT",
    toCity: "Tokyo Narita",
    departTime: "11:30 AM",
    departDate: "Aug 15",
    arriveTime: "2:55 PM",
    arriveDate: "Aug 16",
    duration: "11h 25m",
    cabin: "Premium Economy",
    /** 24-hour forms for the printed table, where column width is tight.
     *  "+1" marks arrival on the following day. */
    depart24: "11:30",
    arrive24: "14:55+1",
  },
  {
    direction: "Return",
    airline: "Japan Airlines",
    number: "JL060",
    fromCode: "NRT",
    fromCity: "Tokyo Narita",
    toCode: "SFO",
    toCity: "San Francisco",
    departTime: "5:45 PM",
    departDate: "Aug 22",
    arriveTime: "11:20 AM",
    arriveDate: "Aug 22",
    duration: "9h 35m",
    cabin: "Premium Economy",
    depart24: "17:45",
    arrive24: "11:20",
  },
] as const;

export const hotel = {
  name: "The Prince Park Tower Tokyo",
  address: "4-8-1 Shibakoen, Minato City, Tokyo 105-8563, Japan",
  checkIn: "Aug 15, 2026",
  checkInTime: "3:00 PM",
  checkOut: "Aug 22, 2026",
  checkOutTime: "11:00 AM",
  room: "Premium Twin with City View",
  confirmation: "HTL-99821",
  note: "Tower Club floor access with breakfast for two included daily.",
} as const;

/**
 * Subtotal is 3,239.80 rather than the round 3,240.00 in the brief so the
 * column actually sums to the 3,661.00 headline total shown on every template.
 */
export const pricing = {
  currency: "USD",
  subtotal: "$3,239.80",
  taxes: "$421.20",
  total: "$3,661.00",
  note: "All charges in USD. Paid in full on July 26, 2026.",
  paidLabel: "Paid in Full",
} as const;

/** The four inclusions grid. `icon` keys match src/lib/icons.ts. */
export const inclusions = [
  { icon: "plane", label: "Round-trip flights", detail: "Premium Economy" },
  { icon: "bed", label: "6 nights hotel", detail: "Tower Club floor" },
  { icon: "compass", label: "4 guided tours", detail: "Private guides" },
  { icon: "utensils", label: "Dining experience", detail: "Omakase tasting" },
] as const;

/** Quick facts strip on the destination page. */
export const quickFacts = [
  { icon: "calendar", label: "Dates", value: "Aug 15 to 22" },
  { icon: "thermometer", label: "Forecast", value: "Avg 28°C" },
  { icon: "clock", label: "Flight time", value: "11h 25m" },
  { icon: "coins", label: "Exchange", value: "1 USD = 148 JPY" },
] as const;

export const destination = {
  intro:
    "Tokyo holds two cities in the same frame. Neon corridors in Shinjuku give way to gravel gardens where the loudest sound is water on stone. Your week is paced to move between them without rushing either. Every transfer, reservation and guide is booked, so the only thing left to decide is where to linger.",
  highlights: [
    "Private omakase seating at a two-star counter in Ginza",
    "Guided dawn walk through Meiji Shrine before the gates open",
    "First-class Shinkansen access for the Mt. Fuji day trip",
    "24/7 English-speaking concierge on the ground in Minato",
  ],
} as const;

/**
 * Day-by-day plan. The page shows the first three, the printed itinerary
 * carries all six.
 */
export const itinerary = [
  {
    day: 1,
    date: "Saturday, August 15",
    dateShort: "Aug 15",
    theme: "Arrival and Shinjuku after dark",
    activities: [
      {
        time: "3:30 PM",
        type: "transfer",
        title: "Private airport transfer",
        description:
          "Chauffeur meets you at Narita Arrivals Exit 2 with a name board and takes you door to door to Minato.",
        note: "Driver contact is in your concierge thread. Journey runs about 75 minutes.",
      },
      {
        time: "7:00 PM",
        type: "dining",
        title: "Welcome dinner at Omoide Yokocho",
        description:
          "Yakitori counter in the lantern-lit alleys behind Shinjuku station. Private booth held under Morgan.",
        note: "Smart casual. The counter seats six, so arrive together.",
      },
    ],
  },
  {
    day: 2,
    date: "Sunday, August 16",
    dateShort: "Aug 16",
    theme: "Market mornings and tea",
    activities: [
      {
        time: "8:00 AM",
        type: "tour",
        title: "Tsukiji outer market food tour",
        description:
          "Chef-led walk through the stalls that still supply the city, tasting seasonal sashimi and single-origin matcha.",
        note: "Roughly three hours on foot. Wear shoes you can stand in.",
      },
      {
        time: "2:00 PM",
        type: "tour",
        title: "Hamarikyu Gardens tea ceremony",
        description:
          "Traditional sado service in the tea house on the tidal pond, surrounded by the Shiodome skyline.",
        note: "Seating is on tatami. Socks recommended.",
      },
    ],
  },
  {
    day: 3,
    date: "Monday, August 17",
    dateShort: "Aug 17",
    theme: "Old Tokyo",
    activities: [
      {
        time: "9:00 AM",
        type: "tour",
        title: "Senso-ji Temple and Asakusa",
        description:
          "Private guide through Tokyo's oldest temple, arriving before the Nakamise-dori crowds build.",
        note: "Modest dress. Photography is allowed outside the main hall only.",
      },
    ],
  },
  {
    day: 4,
    date: "Tuesday, August 18",
    dateShort: "Aug 18",
    theme: "The counter",
    activities: [
      {
        time: "7:00 PM",
        type: "dining",
        title: "Omakase tasting in Ginza",
        description:
          "Twenty courses at a two-star counter, paced by the chef. The centrepiece of your dining inclusion.",
        note: "No fragrance, no photography at the counter. Reserved under Morgan.",
      },
    ],
  },
  {
    day: 5,
    date: "Wednesday, August 19",
    dateShort: "Aug 19",
    theme: "Mt. Fuji day trip",
    activities: [
      {
        time: "7:15 AM",
        type: "tour",
        title: "Mt. Fuji and Lake Kawaguchi",
        description:
          "First-class Shinkansen out, private car around the fifth station and the lake, back in Tokyo by early evening.",
        note: "Full day. Bring a layer, the fifth station runs cool even in August.",
      },
    ],
  },
  {
    day: 6,
    date: "Thursday, August 20",
    dateShort: "Aug 20",
    theme: "Unscheduled",
    activities: [
      {
        time: "All day",
        type: "free",
        title: "Free day",
        description:
          "Nothing booked, on purpose. Your concierge can arrange same-day tickets to teamLab, the Ghibli Museum or a Harajuku styling session.",
        note: "Same-day requests before 9:00 AM have the best availability.",
      },
    ],
  },
] as const;

/** Journal entries — travel stories and tips for the destination. */
export const journalEntries = [
  {
    title: "A Local's Guide to Shinjuku's Hidden Alleys",
    excerpt: "Beyond the neon glare of the main crossing, narrow lanes hold yakitori counters that seat six and pour sake from unmarked jugs. Here is where Tokyo eats after midnight.",
    author: "Maya K.",
    date: "July 2026",
    readTime: "4 min read",
    tags: ["Food & Drink", "Neighbourhoods"],
  },
  {
    title: "The Art of the Japanese Onsen: A First-Timer's Primer",
    excerpt: "From scrubbing stations to the perfect post-bath vending-machine milk, everything you need to know before you step into the waters.",
    author: "Concierge Team",
    date: "June 2026",
    readTime: "6 min read",
    tags: ["Wellness", "Culture"],
  },
  {
    title: "Packing for Tokyo in August: Heat, Humidity, and Etiquette",
    excerpt: "Lightweight linen, a hand towel for every bag, and why you should leave the perfume at home. The seasonal packing list our guests ask for most.",
    author: "Alex M.",
    date: "May 2026",
    readTime: "3 min read",
    tags: ["Travel Tips", "Packing"],
  },
] as const;

/** About — company story, team, and values. */
export const aboutContent = {
  story:
    "WANDERLUST was founded in 2018 on a simple conviction: the best journeys feel effortless because someone thought of everything before you left. What began as a single curated itinerary for Tokyo has grown into a boutique travel platform serving twelve destinations across Asia, with a concierge team that handles every transfer, reservation, and recommendation.",
  mission:
    "We believe luxury in travel is not about excess. It is about removing friction. Every detail, from the airport transfer to the omakase reservation, is pre-arranged so our guests can focus on what matters: being present in a place they have never been.",
  team: [
    { name: "Haruki Tanaka", role: "Founder & CEO", origin: "Tokyo / San Francisco" },
    { name: "Sofia Reyes", role: "Head of Concierge", origin: "Mexico City" },
    { name: "James Park", role: "Director of Experiences", origin: "Seoul" },
    { name: "Lena Fischer", role: "Design & Product", origin: "Berlin" },
  ],
  values: [
    "Thoughtful over extravagant",
    "Local knowledge over generic recommendations",
    "Reliability over surprise",
    "Quiet luxury over loud branding",
  ],
} as const;

/** Three-up essentials cards on the destination page. */
export const essentials = [
  {
    icon: "planeTakeoff",
    title: "Getting there",
    body: "Narita (NRT) handles your inbound and outbound. Your private transfer covers both directions, roughly 75 minutes each way to Minato. Haneda is the closer airport if you extend the trip domestically.",
  },
  {
    icon: "building",
    title: "Where you'll stay",
    body: "The Prince Park Tower Tokyo sits inside Shiba Park with Tokyo Tower directly overhead. Tower Club floor, breakfast for two daily, and the Hamamatsucho metro interchange eight minutes on foot.",
  },
  {
    icon: "info",
    title: "Need to know",
    body: "Tipping is not customary and can cause confusion. Carry a Suica card for the metro, and some cash: smaller restaurants remain card-free. Emergency numbers are 119 for medical and 110 for police.",
  },
] as const;

/** Forecast strip. Short day codes keep the row readable on a phone. */
export const forecast = [
  { day: "Sat", icon: "sun", high: "31°", low: "25°" },
  { day: "Sun", icon: "sun", high: "30°", low: "25°" },
  { day: "Mon", icon: "sun", high: "29°", low: "24°" },
  { day: "Tue", icon: "sun", high: "28°", low: "24°" },
  { day: "Wed", icon: "sun", high: "27°", low: "23°" },
  { day: "Thu", icon: "sun", high: "29°", low: "24°" },
  { day: "Fri", icon: "sun", high: "30°", low: "25°" },
] as const;

export const policies = [
  {
    title: "Cancellation",
    body: "Cancellations more than 48 hours before departure are refundable less a 5% booking fee. Inside 48 hours the fare and lodging are non-refundable. Hotel changes are subject to seasonal availability and property surcharges.",
  },
  {
    title: "Check-in times",
    body: "Hotel check-in from 3:00 PM, check-out by 11:00 AM. Airline counters close 60 minutes before departure on international routes. Carry your passport and a copy of this itinerary.",
  },
  {
    title: "Emergency contact",
    body: "24/7 global concierge on +1 (555) 234-5678. Local Tokyo partner on +81 3-5400-1111. Japan emergency services: 119 medical and fire, 110 police.",
  },
] as const;

/**
 * Pre-shaped rows for the <Table> component in the printed itinerary.
 *
 * Six columns inside 700px leaves roughly 115px each, so this uses the 24-hour
 * times and a shortened cabin label. Spelling out "11:30 AM, Aug 15" wraps to
 * three lines and breaks the row rhythm.
 */
export const flightTableHeaders = [
  "Flight",
  "Route",
  "Date",
  "Dep / Arr",
  "Duration",
  "Class",
] as const;

export const flightTableData: string[][] = flights.map((f) => [
  f.number,
  `${f.fromCode} → ${f.toCode}`,
  f.departDate,
  `${f.depart24}&nbsp;/&nbsp;${f.arrive24}`,
  f.duration,
  f.cabin.replace("Premium Economy", "Prem. Econ."),
]);

/** Navigation shared by the page header — anchor links scroll to sections. */
export const navLinks = [
  { text: "Destinations", href: "#destinations" },
  { text: "Experiences", href: "#experiences" },
  { text: "Journal", href: "#journal" },
  { text: "About", href: "#about" },
] as const;

export const links = {
  itinerary: `${brand.websiteUrl}/trips/${booking.reference}`,
  /**
   * The generated PDF sits next to the other deliverables, so a relative
   * href works from the email, the page and the document alike. A real send
   * would swap in an absolute CDN URL; `npm run pdf` writes the file.
   */
  pdf: "itinerary.pdf",
  myTrips: `${brand.websiteUrl}/my-trips`,
  unsubscribe: `${brand.websiteUrl}/preferences`,
  privacy: `${brand.websiteUrl}/privacy`,
  terms: `${brand.websiteUrl}/terms`,
  contact: `${brand.websiteUrl}/contact`,
} as const;

/** Photography. Unsplash source URLs, sized per usage. */
export const images = {
  /** Tokyo Tower at dusk. Deliberately different in mood from `street` below. */
  hero: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?auto=format&fit=crop&w=1800&q=80",
  street:
    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80",
  hotel:
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=600&q=80",
} as const;
