import type { MetadataRoute } from "next";
import { getJobs } from "@/data/jobs";
import { site } from "@/data/site";

const pages: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/team", changeFrequency: "monthly", priority: 0.8 },
  { path: "/jobs", changeFrequency: "daily", priority: 0.9 },
  { path: "/employers", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/join", changeFrequency: "monthly", priority: 0.7 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

function modified(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return undefined;
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${parsed.getFullYear()}-${month}-${day}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobs = await getJobs();

  return [
    ...pages.map((page) => ({
      url: `${site.url}${page.path}`,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    })),
    ...jobs
      .filter((job) => job.slug)
      .map((job) => ({
        url: `${site.url}/jobs/${job.slug}`,
        lastModified: modified(job.date),
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
  ];
}
