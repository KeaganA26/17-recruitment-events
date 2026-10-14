export type JobCategory =
  | "Events"
  | "Promotions"
  | "Hospitality"
  | "Brand Activations"
  | "Corporate Events";

export type JobType =
  | "Event / Casual"
  | "Temporary"
  | "Campaign"
  | "Event"
  | "Contract"
  | "Casual";

export type Job = {
  id: string;
  slug: string;
  title: string;
  location: string;
  region: string;
  category: JobCategory;
  type: JobType;
  rate: string;
  date: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  expect: string[];
  positions: number;
  featured: boolean;
  new: boolean;
};

export const jobs: Job[] = [
  {
    id: "job-001",
    slug: "brand-ambassador-brighton",
    title: "Brand Ambassador",
    location: "Brighton, East Sussex",
    region: "South East",
    category: "Promotions",
    type: "Event / Casual",
    rate: "£110 per shift",
    date: "18 Sep 2026",
    description:
      "Represent a national lifestyle brand at a high-energy seafront activation in Brighton. You will greet guests, share product samples and keep the brand experience warm, confident and memorable.",
    requirements: [
      "Confident communicator with a polished, approachable presence",
      "Comfortable engaging the public for a full shift",
      "Available for weekend and late-afternoon activations",
      "Previous brand or promotional experience is useful, not essential",
    ],
    responsibilities: [
      "Welcome guests and introduce the brand in a natural, genuine way",
      "Demonstrate products and answer common questions",
      "Keep the stand tidy, stocked and on-brand throughout the shift",
      "Capture simple guest feedback as requested by the brand team",
    ],
    expect: [
      "A briefing before the event with brand guidelines and talking points",
      "A branded uniform provided on the day",
      "A lively outdoor activation with a supportive supervisor on site",
    ],
    positions: 8,
    featured: true,
    new: true,
  },
  {
    id: "job-002",
    slug: "event-host-manchester",
    title: "Event Host",
    location: "Manchester",
    region: "North West",
    category: "Events",
    type: "Temporary",
    rate: "£100 per shift",
    description:
      "Host guests at a multi-day entertainment event in Manchester. You will welcome arrivals, guide people to the right spaces and keep the atmosphere friendly from doors-open to close.",
    date: "16 Sep 2026",
    requirements: [
      "Warm, professional communication skills",
      "Able to stay on your feet for long event days",
      "Comfortable working in busy, high-volume venues",
      "Own black and white event wardrobe preferred",
    ],
    responsibilities: [
      "Meet and greet guests at designated entry points",
      "Direct attendees to stages, lounges and facilities",
      "Support VIP arrivals when requested",
      "Escalate issues quickly to the event supervisor",
    ],
    expect: [
      "A structured run-of-show and radio or WhatsApp comms on the day",
      "Shifts across afternoon and evening sessions",
      "A collaborative floor team with a clear reporting line",
    ],
    positions: 12,
    featured: true,
    new: false,
  },
  {
    id: "job-003",
    slug: "promotional-staff-london",
    title: "Promotional Staff",
    location: "London",
    region: "Greater London",
    category: "Promotions",
    type: "Campaign",
    rate: "£120 per day",
    date: "15 Sep 2026",
    description:
      "Join a retail campaign across selected London stores. You will drive product awareness, encourage trial and help the brand team hit daily engagement targets.",
    requirements: [
      "Outgoing personality and a neat, professional appearance",
      "Reliable transport to allocated store locations",
      "Comfortable working independently after briefing",
      "Retail or promotions experience is an advantage",
    ],
    responsibilities: [
      "Set up a compact promotional stand each morning",
      "Engage shoppers and explain the campaign offer",
      "Record daily activity numbers for the brand report",
      "Represent the brand professionally at all times",
    ],
    expect: [
      "A paid briefing and product training before the first store day",
      "Clear daily targets and a campaign WhatsApp group",
      "Multi-day work across the campaign window",
    ],
    positions: 10,
    featured: true,
    new: false,
  },
  {
    id: "job-004",
    slug: "hospitality-staff-edinburgh",
    title: "Hospitality Staff",
    location: "Edinburgh",
    region: "Scotland",
    category: "Hospitality",
    type: "Event",
    rate: "£95 per shift",
    date: "14 Sep 2026",
    description:
      "Support a premium hospitality event in Edinburgh with polished floor service. You will help with guest seating, canapé service and keep service areas running smoothly.",
    requirements: [
      "Previous waiting, barista or hospitality experience preferred",
      "Smart black event attire and closed shoes",
      "Able to work a late finish",
      "Food hygiene awareness is helpful",
    ],
    responsibilities: [
      "Assist with pre-service setup and post-event pack-down",
      "Serve guests courteously and at the required pace",
      "Keep stations clean and stocked",
      "Follow the event manager’s service cues",
    ],
    expect: [
      "A walkthrough of the venue before guest arrival",
      "A professional kitchen and floor team",
      "Tips may apply depending on the client brief",
    ],
    positions: 16,
    featured: true,
    new: false,
  },
  {
    id: "job-005",
    slug: "registration-staff-birmingham",
    title: "Registration Staff",
    location: "Birmingham",
    region: "Midlands",
    category: "Corporate Events",
    type: "Temporary",
    rate: "£90 per shift",
    date: "12 Sep 2026",
    description:
      "Run a calm, efficient registration desk for a corporate conference in Birmingham. You will check guests in, print or hand out badges and keep the arrival experience organised.",
    requirements: [
      "Strong attention to detail and a calm manner under pressure",
      "Comfortable using a laptop or tablet after a short briefing",
      "Clear spoken English",
      "Corporate event experience is useful, not required",
    ],
    responsibilities: [
      "Check attendees in against the guest list",
      "Issue badges, lanyards and welcome packs",
      "Answer basic venue and agenda questions",
      "Flag VIP or missing-name arrivals for the organiser",
    ],
    expect: [
      "An early call time before doors open",
      "A structured desk with a lead registrar",
      "A professional conference environment",
    ],
    positions: 6,
    featured: true,
    new: false,
  },
  {
    id: "job-006",
    slug: "event-supervisor-brighton",
    title: "Event Supervisor",
    location: "Brighton, East Sussex",
    region: "South East",
    category: "Events",
    type: "Contract",
    rate: "£180 per day",
    date: "11 Sep 2026",
    description:
      "Lead a floor team at a large Brighton event. You will brief staff, hold service standards and be the first point of contact between the client and the 17 team on site.",
    requirements: [
      "Proven experience supervising event or hospitality teams",
      "Calm decision-making during busy service",
      "Confident radio or group-chat communication",
      "Available for pre-event recce and debrief",
    ],
    responsibilities: [
      "Brief and position staff before doors open",
      "Monitor guest flow, breaks and service quality",
      "Resolve floor issues without disrupting the event",
      "Complete a short end-of-day report for the account manager",
    ],
    expect: [
      "A smaller leadership team and a larger floor crew",
      "Direct contact with the client’s event manager",
      "A multi-day contract across the event window",
    ],
    positions: 2,
    featured: true,
    new: true,
  },
  {
    id: "job-007",
    slug: "bartender-bristol",
    title: "Bartender",
    location: "Bristol",
    region: "South West",
    category: "Hospitality",
    type: "Event",
    rate: "£110 per shift",
    date: "10 Sep 2026",
    description:
      "Work a high-volume event bar in Bristol. You will pour a set menu efficiently, keep the bar presentation sharp and deliver friendly, professional service.",
    requirements: [
      "Solid bartending experience in events or busy venues",
      "Knowledge of standard pours and responsible service",
      "Able to work standing for a full evening shift",
      "Own black bar kit is an advantage",
    ],
    responsibilities: [
      "Prepare and serve drinks from the approved menu",
      "Keep the bar clean, stocked and guest-ready",
      "Process cashless or ticketed orders as briefed",
      "Support pack-down after last pour",
    ],
    expect: [
      "A pre-shift tasting or menu recap",
      "A bar captain on each station",
      "A lively evening event with a defined close time",
    ],
    positions: 8,
    featured: false,
    new: false,
  },
  {
    id: "job-008",
    slug: "usher-canary-wharf",
    title: "Usher",
    location: "Canary Wharf, London",
    region: "Greater London",
    category: "Corporate Events",
    type: "Temporary",
    rate: "£85 per shift",
    date: "9 Sep 2026",
    description:
      "Guide guests at a seated corporate awards evening in Canary Wharf. You will help with arrivals, seating and a smooth transition between programme moments.",
    requirements: [
      "Polished presentation and a calm, helpful manner",
      "Comfortable reading a seating plan",
      "Able to stand and move throughout the programme",
      "Previous ushering or hosting experience preferred",
    ],
    responsibilities: [
      "Direct guests to the correct tables or rows",
      "Support late arrivals without disrupting the programme",
      "Assist with prize or stage cues if briefed",
      "Remain visible and radio-ready during the event",
    ],
    expect: [
      "A black-tie or formal black-and-white dress code",
      "A detailed seating briefing on arrival",
      "A premium indoor venue",
    ],
    positions: 14,
    featured: false,
    new: false,
  },
  {
    id: "job-009",
    slug: "event-crew-leeds",
    title: "Event Crew",
    location: "Leeds",
    region: "Yorkshire",
    category: "Events",
    type: "Casual",
    rate: "£90 per shift",
    date: "8 Sep 2026",
    description:
      "Join a hands-on crew for a large outdoor event in Leeds. You will help with setup, guest flow, pack-down and the practical jobs that keep an event moving.",
    requirements: [
      "Physically comfortable with setup and pack-down work",
      "Reliable, punctual and coachable",
      "Able to follow safety instructions on site",
      "Steel-toe or closed shoes required",
    ],
    responsibilities: [
      "Assist with furniture, branding and equipment moves",
      "Support crowd flow and queue management",
      "Keep back-of-house areas tidy and safe",
      "Help restore the site at the end of the event",
    ],
    expect: [
      "An early call time and a practical site briefing",
      "Team-based work with a crew lead",
      "Outdoor conditions — dress for the weather",
    ],
    positions: 20,
    featured: false,
    new: true,
  },
  {
    id: "job-010",
    slug: "brand-activation-assistant-manchester",
    title: "Brand Activation Assistant",
    location: "Manchester",
    region: "North West",
    category: "Brand Activations",
    type: "Campaign",
    rate: "£125 per day",
    date: "7 Sep 2026",
    description:
      "Support a travelling brand activation across Manchester shopping centres. You will help run the experience, look after guests and keep the stand operating at a high standard.",
    requirements: [
      "Energetic, brand-ready presentation",
      "Comfortable in busy retail environments",
      "Able to work a full campaign day including weekends",
      "Promotions or activation experience is an advantage",
    ],
    responsibilities: [
      "Help assemble and reset the activation between sessions",
      "Host guests through the brand experience",
      "Manage samples, collaterals and giveaways",
      "Support the lead ambassador with daily counts",
    ],
    expect: [
      "A campaign roster shared in advance",
      "Branded kit supplied by the client",
      "A mix of weekday and weekend shopping-centre days",
    ],
    positions: 6,
    featured: false,
    new: false,
  },
  {
    id: "job-011",
    slug: "exhibition-host-london",
    title: "Exhibition Host",
    location: "ExCeL London",
    region: "Greater London",
    category: "Brand Activations",
    type: "Temporary",
    rate: "£110 per shift",
    date: "5 Sep 2026",
    description:
      "Host a trade exhibition stand at ExCeL London. You will draw visitors in, qualify interest and keep conversations moving so the sales team can follow up.",
    requirements: [
      "Confident in starting conversations with strangers",
      "Able to learn a short product brief quickly",
      "Professional exhibition attire",
      "Trade-show or hosting experience preferred",
    ],
    responsibilities: [
      "Welcome visitors and introduce the exhibitor’s offer",
      "Collect leads according to the client’s form",
      "Keep the stand presentation sharp throughout the day",
      "Hand qualified conversations to the client team",
    ],
    expect: [
      "A morning briefing before the hall opens",
      "A multi-day exhibition roster",
      "A busy indoor expo environment",
    ],
    positions: 4,
    featured: false,
    new: false,
  },
  {
    id: "job-012",
    slug: "front-of-house-bath",
    title: "Front of House",
    location: "Bath, Somerset",
    region: "South West",
    category: "Hospitality",
    type: "Event",
    rate: "£95 per shift",
    date: "4 Sep 2026",
    description:
      "Provide polished table service at a private function in Bath. You will serve plated meals, refresh drinks and help the floor stay calm and well timed.",
    requirements: [
      "Waiting experience in restaurants or events",
      "Knowledge of plated and tray service",
      "Black event uniform and closed shoes",
      "Available for a Saturday evening service",
    ],
    responsibilities: [
      "Set tables to the client’s specification",
      "Serve food and beverages to timing cues",
      "Clear and reset between courses",
      "Support the host team with guest requests",
    ],
    expect: [
      "A sit-down briefing with the chef and event manager",
      "A refined private-event atmosphere",
      "A defined start, service and pack-down window",
    ],
    positions: 10,
    featured: false,
    new: false,
  },
];

export function getJobBySlug(slug: string) {
  return jobs.find((job) => job.slug === slug);
}

export function getFeaturedJobs() {
  return jobs.filter((job) => job.featured).slice(0, 6);
}

export function getRelatedJobs(slug: string, limit = 3) {
  const current = getJobBySlug(slug);
  if (!current) return jobs.slice(0, limit);
  return jobs
    .filter((job) => job.slug !== slug && job.category === current.category)
    .concat(jobs.filter((job) => job.slug !== slug))
    .filter((job, index, list) => list.findIndex((item) => item.id === job.id) === index)
    .slice(0, limit);
}
