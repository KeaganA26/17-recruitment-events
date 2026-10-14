import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { CTASection } from "@/components/CTASection";
import { Hero } from "@/components/Hero";
import { JobCard } from "@/components/JobCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { StatisticCard } from "@/components/StatisticCard";
import { buttonVariants } from "@/components/ui/button";
import {
  candidateBenefits,
  employerSolutions,
  howItWorks,
  staffCategories,
} from "@/data/content";
import { getFeaturedJobs } from "@/data/jobs";
import { images, stats } from "@/data/site";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const featuredJobs = await getFeaturedJobs();

  return (
    <>
      <Hero />

      <section className="container-page py-20 md:py-24">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Lorem ipsum"
            title="Lorem ipsum dolor sit amet"
            description="Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
          />
          <Link
            href="/jobs"
            className={cn(
              buttonVariants({ size: "xl", variant: "outline" }),
              "shrink-0"
            )}
          >
            View All Jobs
            <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredJobs.map((job, index) => (
            <Reveal key={job.id} delay={index * 0.04}>
              <JobCard job={job} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-brand-ink text-white">
        <div className="container-page py-20 md:py-24">
          <SectionHeading
            light
            align="center"
            eyebrow="Lorem ipsum"
            title="Lorem ipsum dolor sit amet"
            description="Consectetur adipiscing elit, sed do eiusmod tempor incididunt."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {howItWorks.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.05}>
                <article className="rounded-2xl border border-white/10 bg-white/5 p-6">
                  <p className="font-heading text-sm font-bold tracking-[0.2em] text-brand-gold">
                    {item.step}
                  </p>
                  <h3 className="font-heading mt-4 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    {item.description}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-20 md:py-24">
        <SectionHeading
          eyebrow="Lorem ipsum"
          title="Lorem ipsum dolor sit amet"
          description="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {staffCategories.map((category, index) => (
            <Reveal key={category.title} delay={index * 0.03}>
              <CategoryCard {...category} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-brand-sand/50">
        <div className="container-page grid items-center gap-10 py-20 lg:grid-cols-2 lg:gap-16 md:py-24">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl md:aspect-[5/4] lg:aspect-[4/5]">
              <Image
                src={images.staff}
                alt="Event hosts welcoming guests at a conference entrance"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 40vw, 100vw"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Lorem ipsum"
              title="Lorem ipsum dolor sit amet"
              description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
            />
            <ul className="mt-8 grid gap-4">
              {candidateBenefits.map((benefit) => (
                <li key={benefit.title} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 place-items-center rounded-full bg-brand-coral text-white">
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-heading font-bold">{benefit.title}</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page py-20 md:py-24">
        <div className="overflow-hidden rounded-[2rem] bg-brand-navy text-white lg:grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="p-8 md:p-12">
            <SectionHeading
              light
              eyebrow="Lorem ipsum"
              title="Lorem ipsum dolor sit amet"
              description="Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {employerSolutions.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="font-heading font-bold">{item.title}</p>
                  <p className="mt-1 text-sm text-white/65">{item.description}</p>
                </div>
              ))}
            </div>
            <Link
              href="/employers"
              className={cn(
                buttonVariants({ size: "xl" }),
                "mt-8 bg-brand-coral text-white hover:bg-brand-coral/90"
              )}
            >
              Request Staff
            </Link>
          </div>
          <div className="relative min-h-72">
            <Image
              src={images.activation}
              alt="Guests gathered at a branded conference and activation space"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 40vw, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="bg-brand-ink">
        <div className="container-page grid grid-cols-2 gap-8 py-16 md:grid-cols-4 md:py-20">
          {stats.map((item) => (
            <StatisticCard key={item.label} {...item} />
          ))}
        </div>
      </section>

      <CTASection />
    </>
  );
}
