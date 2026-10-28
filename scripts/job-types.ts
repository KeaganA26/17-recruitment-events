import { jobTypes } from "../src/data/site";

export function jobTypeDocumentId(title: string) {
  const slug = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `job-type-${slug}`;
}

export function jobTypeReference(title: string) {
  return {
    _type: "reference" as const,
    _ref: jobTypeDocumentId(title),
  };
}

export function defaultJobTypeDocuments() {
  return jobTypes.map((title, index) => ({
    _id: jobTypeDocumentId(title),
    _type: "jobType" as const,
    title,
    sortOrder: index,
  }));
}
