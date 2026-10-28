import { getCliClient } from "sanity/cli";
import { defaultJobTypeDocuments, jobTypeDocumentId } from "./job-types";

const client = getCliClient({ apiVersion: "2026-10-14" }).withConfig({
  perspective: "raw",
});

type StoredType = string | { _ref?: string } | null | undefined;

const [jobs, existingTypes] = await Promise.all([
  client.fetch<Array<{ _id: string; type?: StoredType }>>(`*[_type == "job"]{ _id, type }`),
  client.fetch<Array<{ _id: string; title?: string; sortOrder?: number }>>(
    `*[_type == "jobType"]{ _id, title, sortOrder }`,
  ),
]);

const transaction = client.transaction();
const ensured = new Set<string>();

function ensure(title: string, sortOrder: number) {
  const id = jobTypeDocumentId(title);
  if (ensured.has(id)) return id;
  ensured.add(id);
  transaction.createIfNotExists({
    _id: id,
    _type: "jobType",
    title,
    sortOrder,
  });
  return id;
}

for (const document of defaultJobTypeDocuments()) {
  ensure(document.title, document.sortOrder);
}

const titleById = new Map<string, string>();
for (const document of existingTypes) {
  if (document._id === "job-type-visibility-test") continue;
  if (!document.title) continue;
  titleById.set(document._id, document.title);
  ensure(document.title, document.sortOrder ?? 100);
}

let patched = 0;
for (const job of jobs) {
  let title: string | undefined;
  if (typeof job.type === "string") title = job.type.trim();
  else if (job.type?._ref) title = titleById.get(job.type._ref);
  if (!title) continue;
  const id = ensure(title, 100);
  if (job.type && typeof job.type === "object" && job.type._ref === id) continue;
  transaction.patch(job._id, {
    set: { type: { _type: "reference", _ref: id } },
  });
  patched += 1;
}

let removed = 0;
for (const document of existingTypes) {
  if (document._id === "job-type-visibility-test") {
    transaction.delete(document._id);
    removed += 1;
    continue;
  }
  const canonical = document.title ? jobTypeDocumentId(document.title) : undefined;
  if (document._id === canonical) continue;
  transaction.delete(document._id);
  removed += 1;
}

const result = await transaction.commit();
console.log(
  `Job types ready (${ensured.size}). Linked ${patched} jobs. Removed ${removed} old ids (${result.transactionId}).`,
);
