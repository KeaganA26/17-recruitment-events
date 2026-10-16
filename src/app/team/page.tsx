import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { buttonVariants } from "@/components/ui/button";
import { team, teamIntro } from "@/data/team";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Meet the Team",
  description:
    "Meet the people behind 17 Recruitment. A people-first team connecting talented professionals with opportunities across events and communications.",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Meet the team"
        title={teamIntro.title}
        description={teamIntro.paragraphs[0]}
      />

      <section className="container-page max-w-3xl py-12 md:py-16">
        <div className="grid gap-5 text-base leading-8 text-muted-foreground">
          {teamIntro.paragraphs.slice(1).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="grid gap-6 xl:grid-cols-3">
          {team.map((member) => (
            <article
              key={member.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-border bg-brand-paper shadow-sm"
            >
              <div className="grid aspect-[16/7] place-items-center bg-brand-ink text-brand-gold">
                <div className="text-center">
                  <p className="font-heading text-4xl font-extrabold">
                    {initials(member.name)}
                  </p>
                  <p className="mt-2 text-xs font-semibold tracking-[0.16em] text-white/55 uppercase">
                    Photo to follow
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-heading text-2xl font-bold">{member.name}</h2>
                <p className="mt-1 text-sm font-medium text-brand-coral">
                  {member.role}
                </p>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {member.bio}
                </p>
                {"note" in member && member.note ? (
                  <p className="mt-4 text-sm font-medium">{member.note}</p>
                ) : null}
                <div className="mt-5 flex gap-2">
                  {"linkedin" in member && member.linkedin ? (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      className="grid size-10 place-items-center rounded-full border border-border text-brand-ink transition-colors hover:bg-brand-ink hover:text-white"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4"
                        aria-hidden="true"
                      >
                        <path d="M6.5 9H3.8v11h2.7zm.2-3.8A1.6 1.6 0 1 1 5 3.6a1.6 1.6 0 0 1 1.7 1.6zM20.2 20h-2.7v-5.6c0-1.6-.6-2.5-1.8-2.5s-2 1.1-2 2.6V20H11V9h2.6v1.5c.5-.9 1.7-1.8 3.4-1.8 2.4 0 4.2 1.6 4.2 5z" />
                      </svg>
                    </a>
                  ) : null}
                  {"email" in member && member.email ? (
                    <a
                      href={`mailto:${member.email}`}
                      aria-label={`Email ${member.name}`}
                      className="grid size-10 place-items-center rounded-full border border-border text-brand-ink transition-colors hover:bg-brand-ink hover:text-white"
                    >
                      <Mail className="size-4" aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
                <div className="mt-6 border-t border-border pt-5">
                  <h3 className="font-heading text-sm font-bold tracking-[0.14em] uppercase">
                    Beyond the CV
                  </h3>
                  <dl className="mt-4 grid gap-4">
                    {member.facts.map((fact) => (
                      <div key={fact.label}>
                        <dt className="text-xs font-semibold tracking-wide text-brand-coral uppercase">
                          {fact.label}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                          {fact.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="rounded-2xl bg-brand-ink px-6 py-10 text-white md:px-10">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            What brings us together?
          </h2>
          <div className="mt-4 grid max-w-3xl gap-4 text-sm leading-7 text-white/75 md:text-base">
            <p>
              Different strengths, shared values and one common goal: connecting
              great people with great opportunities.
            </p>
            <p>
              We believe recruitment should be personal, honest and built on
              relationships that last. We&apos;re serious about finding the right
              fit — but we also believe a little personality, a good conversation
              and a sense of humour go a long way.
            </p>
            <p>
              Looking for your next opportunity, or the person who could make
              all the difference to your business? We&apos;d love to hear from you.
            </p>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/jobs"
              className={cn(
                buttonVariants({ size: "xl" }),
                "bg-brand-coral text-white hover:bg-brand-coral/90"
              )}
            >
              Find Jobs
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "xl", variant: "outline" }),
                "border-white/30 bg-transparent text-white hover:bg-white/10"
              )}
            >
              Get in touch with our team
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
