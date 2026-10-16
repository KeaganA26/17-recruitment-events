import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "About",
  description:
    "Recruitment built around people, relationships and industry expertise across the events and communications industries.",
};

const paragraphs = [
  "At 17 Recruitment, we specialise in connecting exceptional talent with outstanding opportunities across the events and communications industries.",
  "We understand that great recruitment is about more than matching a CV to a job description. It's about understanding people, recognising potential and building relationships that create lasting success for both businesses and candidates.",
  "With industry knowledge and a genuine passion for connecting people, we take a tailored, relationship-led approach to recruitment. We work closely with businesses to understand their teams, culture and ambitions, while helping talented professionals find opportunities that align with their skills, experience and career goals.",
  "From event production, project management and event operations and logistics to communications, content and marketing roles, we connect the right people with the right opportunities.",
  "Whether you're a business looking for exceptional talent or a professional ready for your next move, we're here to make the process straightforward, personal and effective.",
  "We recruit for both permanent and freelance opportunities, supporting businesses with the talent they need to deliver, grow and succeed.",
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="About 17 Recruitment"
        description="Recruitment built around people, relationships and industry expertise."
      />

      <section className="container-page max-w-3xl py-16 md:py-20">
        <div className="grid gap-5 text-base leading-8 text-muted-foreground">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="bg-brand-ink">
        <div className="container-page py-20 md:py-24">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand-gold uppercase">
            17 Recruitment
          </p>
          <p className="font-heading mt-4 max-w-3xl text-3xl font-extrabold text-white md:text-5xl">
            It&apos;s all about people. The right connections make all the
            difference.
          </p>
        </div>
      </section>
    </>
  );
}
