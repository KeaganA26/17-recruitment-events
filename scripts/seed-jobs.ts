import { getCliClient } from "sanity/cli";
import { sampleJobs } from "../src/data/jobs";
import { defaultJobTypeDocuments, jobTypeReference } from "./job-types";

const client = getCliClient({ apiVersion: "2026-10-14" });

const documents = sampleJobs.map((job) => ({
  _id: job.id,
  _type: "job",
  title: job.title,
  slug: { _type: "slug", current: job.slug },
  location: job.location,
  region: job.region,
  category: job.category,
  type: jobTypeReference(job.type),
  rate: job.rate,
  date: job.date,
  description: job.description,
  requirements: job.requirements,
  responsibilities: job.responsibilities,
  expect: job.expect,
  positions: job.positions,
  featured: job.featured,
  isNew: job.new,
}));

const transaction = client.transaction();
for (const document of defaultJobTypeDocuments()) {
  transaction.createIfNotExists(document);
}
for (const document of documents) {
  transaction.createOrReplace(document);
}

const result = await transaction.commit();
console.log(`Seeded ${documents.length} jobs (${result.transactionId}).`);
