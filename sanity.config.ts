"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { dataset, projectId } from "@/sanity/env";
import { schemaTypes } from "@/sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "17 Recruitment Events",
  basePath: "/studio",
  projectId: projectId || "missing-project-id",
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([
            S.documentTypeListItem("job").title("Jobs"),
            S.documentTypeListItem("jobType").title("Job types"),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
