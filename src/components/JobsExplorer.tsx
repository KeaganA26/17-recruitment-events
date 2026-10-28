"use client";

import { useMemo, useState } from "react";
import { JobCard } from "@/components/JobCard";
import { JobFilters, type JobFilterState } from "@/components/JobFilters";
import type { Job } from "@/data/jobs";

const emptyFilters: JobFilterState = {
  keyword: "",
  location: "",
  category: "",
  type: "",
};

export function JobsExplorer({
  jobs,
  jobTypes,
}: {
  jobs: Job[];
  jobTypes: readonly string[];
}) {
  const [filters, setFilters] = useState<JobFilterState>(emptyFilters);

  const results = useMemo(() => {
    const keyword = filters.keyword.trim().toLowerCase();
    return jobs.filter((job) => {
      const matchesKeyword =
        !keyword ||
        `${job.title} ${job.description} ${job.location} ${job.category}`
          .toLowerCase()
          .includes(keyword);
      const matchesLocation = !filters.location || job.region === filters.location;
      const matchesCategory = !filters.category || job.category === filters.category;
      const matchesType = !filters.type || job.type === filters.type;
      return matchesKeyword && matchesLocation && matchesCategory && matchesType;
    });
  }, [filters, jobs]);

  return (
    <div className="space-y-8">
      <JobFilters
        value={filters}
        onChange={setFilters}
        resultCount={results.length}
        jobTypes={jobTypes}
      />
      {results.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border bg-brand-paper px-6 py-16 text-center">
          <h2 className="font-heading text-2xl font-bold">No matching roles</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Try another keyword or clear the filters. You can also join the talent
            pool and we will keep you in mind for upcoming events.
          </p>
        </div>
      )}
    </div>
  );
}
