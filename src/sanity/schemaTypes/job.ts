import { defineArrayMember, defineField, defineType } from "sanity";
import { jobCategories, regions } from "@/data/site";

const list = (values: readonly string[]) =>
  values.map((value) => ({ title: value, value }));

export const job = defineType({
  name: "job",
  title: "Job",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: "City or venue shown on the job card.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "region",
      title: "Region",
      type: "string",
      options: { list: list(regions), layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: { list: list(jobCategories), layout: "dropdown" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "type",
      title: "Job type",
      type: "reference",
      to: [{ type: "jobType" }],
      description: "Pick an existing job type, or create a new one from this field.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "rate",
      title: "Rate",
      type: "string",
      description: "Shown as written, for example £110 per shift.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "string",
      description: "Shown as written, for example 18 Sep 2026.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "responsibilities",
      title: "Responsibilities",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "expect",
      title: "What to expect",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "positions",
      title: "Positions available",
      type: "number",
      initialValue: 1,
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: "featured",
      title: "Featured on the homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isNew",
      title: "New",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "location",
    },
  },
});
