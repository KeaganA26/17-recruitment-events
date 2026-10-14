import type { Metadata } from "next";
import { JobsExplorer } from "@/components/JobsExplorer";
import { PageHero } from "@/components/PageHero";
import { getJobs } from "@/data/jobs";

export const metadata: Metadata = {
  title: "Event Jobs in the UK",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
};

export default async function JobsPage() {
  const jobs = await getJobs();

  return (
    <>
      <PageHero
        eyebrow="Find jobs"
        title="Lorem ipsum dolor sit amet"
        description="Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />
      <section className="container-page py-12 md:py-16">
        <JobsExplorer jobs={jobs} />
      </section>
    </>
  );
}
