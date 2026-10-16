import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { buttonVariants } from "@/components/ui/button";
import {
  employerSolutions,
  roleGroups,
  whyWorkWithUs,
} from "@/data/content";
import { images } from "@/data/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "For Employers",
  description:
    "Specialist recruitment for the events and communications industries. Permanent and freelance talent for businesses that need the right people.",
};

const story = [
  "At 17 Recruitment, we specialise in connecting businesses across the events and communications industries with the people who make a difference.",
  "We understand that finding the right talent can be the difference between a good project and a great one. With first-hand industry experience and specialist recruitment knowledge, we understand the pace, pressures and people behind the roles we recruit for.",
  "Whether you need experienced freelance support for an upcoming event, additional resource during a busy period or the right person to join your team permanently, we'll help you find the right fit.",
  "Quality over quantity is at the heart of what we do. We take the time to understand your business, your brief and your team before identifying candidates who genuinely match your requirements. Rather than sending endless CVs, we focus on relevant, carefully considered introductions that save you time and give you confidence in your hiring decisions.",
  "We're proactive, approachable and straightforward to work with. We believe successful recruitment is built on honest communication, strong relationships and a clear understanding of what both businesses and candidates need to succeed.",
  "Our goal is to become a trusted recruitment partner you can turn to whenever you need great people.",
];

export default function EmployersPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={images.employers}
            alt="A professional team planning an event briefing"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/85 via-brand-ink/65 to-brand-ink/40" />
        </div>
        <div className="container-page relative py-20 md:py-28">
          <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-brand-gold uppercase">
            For employers
          </p>
          <h1 className="font-heading max-w-3xl text-4xl font-extrabold text-white md:text-6xl">
            Find the Right Talent for Your Business
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Specialist recruitment for the events and communications industries.
            We connect businesses with exceptional permanent and freelance
            talent to help your team deliver, grow and succeed.
          </p>
        </div>
      </section>

      <section className="container-page max-w-3xl py-16 md:py-20">
        <SectionHeading title="Recruitment That Works for Your Business" />
        <div className="mt-6 grid gap-5 text-base leading-8 text-muted-foreground">
          {story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="bg-brand-sand/40">
        <div className="container-page py-16 md:py-20">
          <SectionHeading title="Our recruitment solutions" />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {employerSolutions.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="rounded-2xl border border-border bg-brand-paper p-6"
                >
                  <span className="grid size-11 place-items-center rounded-xl bg-brand-ink text-brand-gold">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="font-heading mt-4 text-xl font-bold">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <SectionHeading title="A More Personal Approach to Recruitment" />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {whyWorkWithUs.map((item) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-brand-paper p-6"
              >
                <span className="grid size-11 place-items-center rounded-xl bg-brand-ink text-brand-gold">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="font-heading mt-4 text-xl font-bold">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bg-brand-ink text-white">
        <div className="container-page py-16 md:py-20">
          <SectionHeading
            light
            eyebrow="Roles we recruit"
            title="Connecting You With the Right People"
            description="We recruit across a range of roles within the events and communications industries, supporting businesses with the specialist skills and experience they need to deliver exceptional work."
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {roleGroups.map((group) => (
              <article
                key={group.title}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="font-heading text-xl font-bold">{group.title}</h3>
                <ul className="mt-5 grid gap-3">
                  {group.roles.map((role) => (
                    <li key={role} className="flex gap-3 text-sm leading-6">
                      <Check
                        className="mt-0.5 size-4 shrink-0 text-brand-gold"
                        aria-hidden="true"
                      />
                      <span className="text-white/80">{role}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mt-8 max-w-3xl text-sm leading-7 text-white/70 md:text-base">
            Whether you&apos;re building your core team or bringing in freelance
            expertise for a specific project, we&apos;ll work with you to find
            people whose experience aligns with your requirements.
          </p>
        </div>
      </section>

      <section className="bg-brand-coral">
        <div className="container-page flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center md:py-20">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl font-extrabold text-white md:text-4xl">
              Let&apos;s Find Your Next Great Hire
            </h2>
            <p className="mt-4 text-base leading-7 text-white/85 md:text-lg">
              Whether you&apos;re recruiting for a permanent position, need
              freelance support for an upcoming project or are planning for
              future growth, we&apos;d love to hear from you.
            </p>
            <p className="mt-3 text-base leading-7 text-white/85">
              Tell us what you need, and let&apos;s start a conversation about
              finding the right people for your business.
            </p>
          </div>
          <Link
            href="/contact"
            className={cn(
              buttonVariants({ size: "xl" }),
              "bg-brand-ink text-white hover:bg-black"
            )}
          >
            Discuss Your Recruitment Needs
          </Link>
        </div>
      </section>
    </>
  );
}
