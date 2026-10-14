import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Banknote, Briefcase, CalendarDays, MapPin, Users } from "lucide-react";
import { ApplyDialog } from "@/components/ApplyDialog";
import { JobCard } from "@/components/JobCard";
import { Badge } from "@/components/ui/badge";
import { getJobBySlug, getJobs, getRelatedJobs } from "@/data/jobs";

type JobPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const jobs = await getJobs();
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) return { title: "Job not found" };
  return {
    title: `${job.title} in ${job.location}`,
    description: job.description,
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  if (!job) notFound();
  const related = await getRelatedJobs(job.slug);

  return (
    <article className="container-page py-10 md:py-16">
      <Link
        href="/jobs"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Jobs
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{job.category}</Badge>
            {job.new ? <Badge className="bg-brand-coral text-white">New</Badge> : null}
          </div>
          <h1 className="font-heading mt-4 text-4xl font-extrabold md:text-5xl">
            {job.title}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-7 text-muted-foreground">
            {job.description}
          </p>

          <dl className="mt-8 grid gap-4 sm:grid-cols-2">
            <Meta icon={MapPin} label="Location" value={job.location} />
            <Meta icon={Briefcase} label="Job type" value={job.type} />
            <Meta icon={Banknote} label="Rate" value={job.rate} />
            <Meta icon={CalendarDays} label="Date posted" value={job.date} />
            <Meta
              icon={Users}
              label="Positions available"
              value={`${job.positions} positions`}
            />
          </dl>

          <section className="mt-12">
            <h2 className="font-heading text-2xl font-bold">Job description</h2>
            <p className="mt-3 max-w-3xl text-base leading-7 text-muted-foreground">
              {job.description} This role is booked through 17 Recruitment Events
              and forms part of a professionally briefed event team.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="font-heading text-2xl font-bold">Responsibilities</h2>
            <List items={job.responsibilities} />
          </section>

          <section className="mt-10">
            <h2 className="font-heading text-2xl font-bold">Requirements</h2>
            <List items={job.requirements} />
          </section>

          <section className="mt-10">
            <h2 className="font-heading text-2xl font-bold">What to expect</h2>
            <List items={job.expect} />
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 h-fit rounded-2xl border border-border bg-brand-paper p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">Lorem ipsum dolor?</p>
          <p className="font-heading mt-2 text-2xl font-bold">{job.rate}</p>
          <p className="mt-1 text-sm text-muted-foreground">{job.location}</p>
          <div className="mt-6">
            <ApplyDialog jobTitle={job.title} />
          </div>
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Applications are simulated in this demo. No CV is stored or emailed.
          </p>
        </aside>
      </div>

      <section className="mt-16">
        <h2 className="font-heading text-2xl font-bold">Similar opportunities</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {related.map((item) => (
            <JobCard key={item.id} job={item} />
          ))}
        </div>
      </section>
    </article>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-brand-paper p-4">
      <dt className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <Icon className="size-4 text-brand-coral" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-2 font-medium">{value}</dd>
    </div>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 max-w-3xl space-y-2 text-base leading-7 text-muted-foreground">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-coral" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
