"use client";

import Link from "next/link";
import { Banknote, Briefcase, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import type { Job } from "@/data/jobs";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function JobCard({ job }: { job: Job }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="flex h-full flex-col rounded-2xl border border-border bg-brand-paper p-5 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading text-xl font-bold text-foreground">
            {job.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">Posted {job.date}</p>
        </div>
        {job.new ? (
          <Badge className="bg-brand-coral text-white">New</Badge>
        ) : null}
      </div>

      <ul className="mt-4 space-y-2 text-sm text-foreground/80">
        <li className="flex items-center gap-2">
          <MapPin className="size-4 text-brand-coral" aria-hidden="true" />
          <span>{job.location}</span>
        </li>
        <li className="flex items-center gap-2">
          <Briefcase className="size-4 text-brand-coral" aria-hidden="true" />
          <span>{job.type}</span>
        </li>
        <li className="flex items-center gap-2">
          <Banknote className="size-4 text-brand-coral" aria-hidden="true" />
          <span>{job.rate}</span>
        </li>
      </ul>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
        {job.description}
      </p>

      <div className="mt-auto pt-5">
        <Link
          href={`/jobs/${job.slug}`}
          className={cn(
            buttonVariants({ size: "xl" }),
            "w-full bg-brand-ink text-white hover:bg-brand-ink/90"
          )}
        >
          View Job
        </Link>
      </div>
    </motion.article>
  );
}
