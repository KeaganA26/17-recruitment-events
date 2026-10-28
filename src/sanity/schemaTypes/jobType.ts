import { defineField, defineType } from "sanity";

export const jobType = defineType({
  name: "jobType",
  title: "Job type",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "Shown in the job type dropdown and on the website.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "sortOrder",
      title: "Sort order",
      type: "number",
      hidden: true,
      initialValue: 100,
    }),
  ],
  preview: {
    select: { title: "title" },
  },
});
