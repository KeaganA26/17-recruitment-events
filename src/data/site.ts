export const site = {
  name: "17 Recruitment Events",
  shortName: "17",
  tagline: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  description:
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  url: "https://17recruitmentevents.co.uk",
  email: "hello@17recruitmentevents.co.uk",
  phone: "+44 20 7946 1717",
  phoneHref: "tel:+442079461717",
  whatsapp: "+44 7700 900171",
  whatsappHref: "https://wa.me/447700900171",
  hours: "Monday to Friday, 09:00 – 17:30 GMT",
  location: "London, United Kingdom",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    linkedin: "https://linkedin.com",
    tiktok: "https://tiktok.com",
  },
} as const;

/* DEMO STATS — replace with live figures later */
export const stats = [
  { value: 500, suffix: "+", label: "Candidates" },
  { value: 100, suffix: "+", label: "Events Supported" },
  { value: 50, suffix: "+", label: "Clients" },
  { value: 1000, suffix: "+", label: "Placements" },
] as const;

export const regions = [
  "Greater London",
  "South East",
  "South West",
  "Midlands",
  "North West",
  "Yorkshire",
  "North East",
  "Scotland",
  "Wales",
  "Northern Ireland",
] as const;

export const jobCategories = [
  "Events",
  "Promotions",
  "Hospitality",
  "Brand Activations",
  "Corporate Events",
] as const;

export const jobTypes = [
  "Event / Casual",
  "Temporary",
  "Campaign",
  "Event",
  "Contract",
  "Casual",
] as const;

export const preferredRoles = [
  "Brand Ambassador",
  "Promotional Staff",
  "Event Host",
  "Hospitality Staff",
  "Bartender",
  "Registration Staff",
  "Event Crew",
  "Usher",
  "Supervisor",
  "Event Manager",
] as const;

export const availabilityOptions = [
  "Weekends only",
  "Weekdays only",
  "Evenings",
  "Flexible / as needed",
  "Available immediately",
] as const;

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/jobs", label: "Find Jobs" },
  { href: "/team", label: "Meet the Team" },
  { href: "/employers", label: "For Employers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export const images = {
  hero: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=2000&q=80",
  staff: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
  hospitality:
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80",
  activation:
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80",
  team: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1600&q=80",
  venue: "https://images.unsplash.com/photo-1519167758481-83f29da8c0c0?auto=format&fit=crop&w=1600&q=80",
  crowd: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=1600&q=80",
  bartender:
    "https://images.unsplash.com/photo-1572116469696-31de0f17cc88?auto=format&fit=crop&w=1600&q=80",
  about: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1800&q=80",
  employers:
    "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80",
} as const;
