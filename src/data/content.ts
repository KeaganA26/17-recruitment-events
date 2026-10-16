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
  CalendarRange,
  Layers,
  Compass,
  HeartHandshake,
  BadgeCheck,
  MessagesSquare,
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
    title: "Permanent Recruitment",
    description:
      "Find the right people to strengthen your team for the long term. We take the time to understand your business, company culture and requirements to connect you with professionals who have the skills and experience to make a lasting impact.",
    icon: Briefcase,
  },
  {
    title: "Freelance & Contract Recruitment",
    description:
      "Access experienced freelance and contract professionals when you need additional expertise. From upcoming events and project launches to peak periods and short-term assignments, we'll help you find the right talent when it matters most.",
    icon: CalendarRange,
  },
  {
    title: "Flexible Talent Solutions",
    description:
      "Every business has different resourcing needs. We work with you to understand your requirements and identify suitable talent for changing workloads, new projects and evolving business priorities.",
    icon: Layers,
  },
] as const;

export const whyWorkWithUs = [
  {
    title: "Specialist Industry Knowledge",
    description:
      "We understand the events and communications sectors, the roles within them and the skills needed to succeed. That insight helps us identify talent that fits your brief and your business.",
    icon: Compass,
  },
  {
    title: "People First, Always",
    description:
      "We believe the best recruitment starts with relationships. By getting to know your business and understanding your priorities, we create a more personal and considered hiring experience.",
    icon: HeartHandshake,
  },
  {
    title: "Quality Over Quantity",
    description:
      "Your time matters. We focus on relevant, carefully selected candidates rather than overwhelming you with CVs that don't fit the brief.",
    icon: BadgeCheck,
  },
  {
    title: "Straightforward & Responsive",
    description:
      "Recruitment doesn't need to be complicated. We pride ourselves on clear communication, a proactive approach and being easy to work with from the first conversation.",
    icon: MessagesSquare,
  },
] as const;

export const roleGroups = [
  {
    title: "Events & Event Production",
    roles: [
      "Event Managers & Project Managers",
      "Event Producers & Project Directors",
      "Event Operations & Logistics",
      "Account Managers & Account Directors",
      "Conference & Content Producers",
      "Experiential, Brand Activation & Live Events Professionals",
    ],
  },
  {
    title: "Communications, Content & Marketing",
    roles: [
      "Communications Managers & Specialists",
      "Marketing Managers & Executives",
      "Content Producers & Content Managers",
      "Creative Project Managers",
      "Corporate Communications & Campaign Specialists",
    ],
  },
] as const;

export const faqs = [
  {
    question: "What industries do you specialise in?",
    answer:
      "We specialise in recruitment across the events and communications industries, connecting businesses with talented professionals across event production, project management, event operations, marketing, content and communications. We work with a range of organisations, from agencies and corporate teams to venues and event suppliers.",
  },
  {
    question: "Do you recruit for both permanent and freelance roles?",
    answer:
      "Yes. We support businesses with both permanent recruitment and freelance or contract requirements. Whether you're looking for a long-term addition to your team or experienced professionals to support a specific project, we'll work with you to understand your needs.",
  },
  {
    question: "How do I get started if I'm looking to hire?",
    answer:
      "Simply get in touch and tell us a little about your business, the role you're looking to fill and the type of support you need. We'll discuss your requirements, answer any questions and talk you through the next steps.",
  },
  {
    question: "How do I register as a candidate?",
    answer:
      "We'd love to hear from you. You can browse our latest vacancies and apply for roles that match your experience, or contact us directly with your CV and a little information about the type of opportunity you're looking for.",
  },
  {
    question: "What if I can't find a suitable job on your website?",
    answer:
      "Not every opportunity is advertised, and our vacancies are continually evolving. If you can't see a role that's right for you, send us your CV and let us know what you're looking for. We'll keep your details in mind for relevant opportunities, subject to your preferences and consent.",
  },
  {
    question: "How do you match candidates with businesses?",
    answer:
      "We take a considered, relationship-led approach to recruitment. We look beyond job titles and CVs to understand each candidate's experience, skills, ambitions and working preferences, alongside the client's requirements and team culture. Our aim is to make relevant introductions that work for both sides.",
  },
  {
    question: "How quickly can you fill a vacancy?",
    answer:
      "Timescales depend on the role, the experience required and the availability of suitable candidates. Freelance requirements can sometimes be fulfilled more quickly, while permanent appointments may require a longer search and interview process. We'll agree priorities with you and keep communication clear throughout.",
  },
  {
    question: "Which locations do you recruit in?",
    answer:
      "We support recruitment across the events and communications sectors, with opportunities depending on each client's requirements and the role. Contact us to discuss your location, whether you're hiring or looking for your next opportunity.",
  },
] as const;
