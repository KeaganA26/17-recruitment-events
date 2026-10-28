import { createClient } from "next-sanity";
import { assertSanityConfig } from "@/sanity/env";

const { projectId, dataset, apiVersion } = assertSanityConfig();

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});
