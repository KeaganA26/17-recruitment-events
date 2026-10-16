import type { Metadata } from "next";
import { JobsExplorer } from "@/components/JobsExplorer";
import { PageHero } from "@/components/PageHero";
import { getJobs } from "@/data/jobs";

export const metadata: Metadata = {
  title: "Find Jobs",
  description:
    "Explore the latest events and communications jobs, from permanent positions to freelance opportunities.",
};

const intro = [
  "Looking for your next role in events or communications? You're in the right place.",
  "At 17 Recruitment, we connect talented professionals with exciting career opportunities across the events and communications industries. From event production and project management to marketing, content and communications, we're here to help you find a role that matches your skills, experience and ambitions.",
  "Whether you're looking for your next permanent position or your next freelance project, explore our latest vacancies and discover where your next opportunity could take you.",
];

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <>
      <PageHero
        eyebrow="Find jobs"
        title="Find Your Next Opportunity"
        description="Explore the latest events and communications jobs, from permanent positions to freelance opportunities. Find your next role with 17 Recruitment."
      />
      <section className="container-page max-w-3xl pt-12 md:pt-16">
        <div className="grid gap-5 text-base leading-8 text-muted-foreground">
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <section className="container-page py-12 md:py-16">
        <JobsExplorer jobs={jobs} />
      </section>
    </>
  );
}
