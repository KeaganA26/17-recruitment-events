"use client";

import type { ComponentProps, ReactNode } from "react";
import { Search, X } from "lucide-react";
import { jobCategories, regions } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type JobFilterState = {
  keyword: string;
  location: string;
  category: string;
  type: string;
};

type JobFiltersProps = {
  value: JobFilterState;
  onChange: (next: JobFilterState) => void;
  resultCount: number;
  jobTypes: readonly string[];
};

export function JobFilters({ value, onChange, resultCount, jobTypes }: JobFiltersProps) {
  const update = (key: keyof JobFilterState, next: string) => {
    onChange({ ...value, [key]: next });
  };

  const hasFilters = Object.values(value).some(Boolean);

  return (
    <section
      aria-label="Search and filter jobs"
      className="rounded-2xl border border-border bg-brand-paper p-4 shadow-sm md:p-6"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <FilterField id="keyword" label="Keyword">
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              id="keyword"
              value={value.keyword}
              onChange={(event) => update("keyword", event.target.value)}
              placeholder="Role, brand or skill"
              className="h-12 rounded-xl bg-white pl-10"
            />
          </div>
        </FilterField>

        <FilterField id="location" label="Location">
          <NativeSelect
            id="location"
            value={value.location}
            onChange={(event) => update("location", event.target.value)}
          >
            <option value="">All locations</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </NativeSelect>
        </FilterField>

        <FilterField id="category" label="Category">
          <NativeSelect
            id="category"
            value={value.category}
            onChange={(event) => update("category", event.target.value)}
          >
            <option value="">All categories</option>
            {jobCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </NativeSelect>
        </FilterField>

        <FilterField id="type" label="Job Type">
          <NativeSelect
            id="type"
            value={value.type}
            onChange={(event) => update("type", event.target.value)}
          >
            <option value="">All job types</option>
            {jobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </NativeSelect>
        </FilterField>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          {resultCount} {resultCount === 1 ? "opportunity" : "opportunities"} found
        </p>
        {hasFilters ? (
          <Button
            type="button"
            variant="outline"
            className="h-11 rounded-xl"
            onClick={() =>
              onChange({ keyword: "", location: "", category: "", type: "" })
            }
          >
            <X className="size-4" />
            Clear filters
          </Button>
        ) : null}
      </div>
    </section>
  );
}

function FilterField({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}

function NativeSelect({
  className,
  ...props
}: ComponentProps<"select">) {
  return (
    <select
      className="h-12 w-full rounded-xl border border-input bg-white px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      {...props}
    />
  );
}
