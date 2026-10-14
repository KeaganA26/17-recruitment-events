import { unstable_cache } from "next/cache";
import type { Job } from "@/data/jobs";
import { client } from "@/sanity/client";

type SanityJob = Omit<Job, "new"> & { isNew?: boolean | null };

const jobsQuery = `*[_type == "job" && defined(slug.current) && defined(region)] | order(_id asc) {
  "id": _id,
  "slug": slug.current,
  title,
  location,
  region,
  category,
  type,
  rate,
  date,
  description,
  requirements,
  responsibilities,
  expect,
  positions,
  featured,
  isNew
}`;

function toJob(job: SanityJob): Job {
  return {
    id: job.id,
    slug: job.slug,
    title: job.title,
    location: job.location,
    region: job.region,
    category: job.category,
    type: job.type,
    rate: job.rate,
    date: job.date,
    description: job.description,
    requirements: job.requirements ?? [],
    responsibilities: job.responsibilities ?? [],
    expect: job.expect ?? [],
    positions: job.positions ?? 1,
    featured: Boolean(job.featured),
    new: Boolean(job.isNew),
  };
}

export const loadJobs = unstable_cache(
  async () => {
    const jobs = await client.fetch<SanityJob[]>(jobsQuery);
    return jobs.map(toJob);
  },
  ["jobs"],
  { tags: ["jobs"] },
);
