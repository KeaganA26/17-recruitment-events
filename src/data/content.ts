import {
  Sparkles,
  CalendarDays,
  Users,
  Wine,
  ClipboardCheck,
  Megaphone,
  Armchair,
  Shield,
  Briefcase,
  GlassWater,
} from "lucide-react";

export const howItWorks = [
  {
    step: "01",
    title: "Lorem ipsum",
    description:
      "Dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
  },
  {
    step: "02",
    title: "Dolor sit amet",
    description:
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  },
  {
    step: "03",
    title: "Consectetur elit",
    description:
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
  },
  {
    step: "04",
    title: "Adipiscing elit",
    description:
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.",
  },
] as const;

export const staffCategories = [
  {
    title: "Brand Ambassadors",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: Sparkles,
  },
  {
    title: "Promotional Staff",
    description: "Sed do eiusmod tempor incididunt ut labore et dolore magna.",
    icon: Megaphone,
  },
  {
    title: "Event Hosts",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    icon: Users,
  },
  {
    title: "Hospitality Staff",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit.",
    icon: Wine,
  },
  {
    title: "Bartenders",
    description: "Excepteur sint occaecat cupidatat non proident sunt in culpa.",
    icon: GlassWater,
  },
  {
    title: "Registration Staff",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    icon: ClipboardCheck,
  },
  {
    title: "Event Crew",
    description: "Sed do eiusmod tempor incididunt ut labore et dolore magna.",
    icon: CalendarDays,
  },
  {
    title: "Ushers",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
    icon: Armchair,
  },
  {
    title: "Supervisors",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit.",
    icon: Shield,
  },
  {
    title: "Event Managers",
    description: "Excepteur sint occaecat cupidatat non proident sunt in culpa.",
    icon: Briefcase,
  },
] as const;

export const candidateBenefits = [
  {
    title: "Lorem ipsum",
    description: "Dolor sit amet, consectetur adipiscing elit sed do eiusmod.",
  },
  {
    title: "Dolor sit amet",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  },
  {
    title: "Consectetur elit",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit.",
  },
  {
    title: "Adipiscing elit",
    description: "Excepteur sint occaecat cupidatat non proident sunt in culpa.",
  },
  {
    title: "Sed do eiusmod",
    description: "Tempor incididunt ut labore et dolore magna aliqua enim.",
  },
  {
    title: "Tempor incididunt",
    description: "Ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
  },
] as const;

export const employerSolutions = [
  {
    title: "Event Staff",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    title: "Promotional Staff",
    description: "Sed do eiusmod tempor incididunt ut labore et dolore magna.",
  },
  {
    title: "Hospitality Teams",
    description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
  },
  {
    title: "Brand Ambassadors",
    description: "Duis aute irure dolor in reprehenderit in voluptate velit.",
  },
  {
    title: "Supervisors",
    description: "Excepteur sint occaecat cupidatat non proident sunt in culpa.",
  },
  {
    title: "Temporary Staff",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
] as const;

export const employerServices = [
  "Brand activations",
  "Corporate events",
  "Hospitality events",
  "Promotions",
  "Exhibitions",
  "Product launches",
  "Private events",
  "Large-scale events",
] as const;

export const faqs = [
  {
    question: "How do I apply for a job?",
    answer:
      "Open any role on the Find Jobs page and tap Apply Now. Complete the short form, attach your CV and give consent for us to use your details for recruitment. You will see a confirmation as soon as the application is received.",
  },
  {
    question: "Do I need previous event experience?",
    answer:
      "Not always. Many hosting, crew and promotional roles welcome first-time event staff if you are reliable, presentable and coachable. Supervisor, bartender and some hospitality roles usually need proven experience.",
  },
  {
    question: "How will I know if I have been selected?",
    answer:
      "If you are shortlisted, our recruitment team will contact you by phone, WhatsApp or email with the event brief, call time and uniform. If a role is filled, we keep your profile for future opportunities.",
  },
  {
    question: "Can I apply for multiple jobs?",
    answer:
      "Yes. You can apply for as many suitable roles as you like. Joining the talent pool is also useful if you want to be considered for upcoming work that is not listed yet.",
  },
  {
    question: "How do I join the talent pool?",
    answer:
      "Visit Join the Talent Pool, tell us your preferred roles, availability and city, then upload your CV. We review new registrations regularly when clients brief us for events.",
  },
  {
    question: "How do businesses request staff?",
    answer:
      "Go to For Employers and send a staffing enquiry with the event date, location, staff type and numbers. An account contact will follow up to confirm availability and next steps.",
  },
] as const;
