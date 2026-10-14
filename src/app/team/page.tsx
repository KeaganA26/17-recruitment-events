import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { buttonVariants } from "@/components/ui/button";
import { team } from "@/data/team";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Meet the Team",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        eyebrow="Lorem ipsum"
        title="Meet the Team"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
      />

      <section className="container-page py-12 md:py-16">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {team.map((member) => (
            <article
              key={member.name}
              className="overflow-hidden rounded-2xl border border-border bg-brand-paper shadow-sm"
            >
              <div className="relative aspect-[4/5]">
                <Image
                  src={member.image}
                  alt={`${member.name}, ${member.role} at 17 Recruitment Events`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 100vw"
                />
              </div>
              <div className="p-5">
                <h2 className="font-heading text-xl font-bold">{member.name}</h2>
                <p className="mt-1 text-sm font-medium text-brand-coral">
                  {member.role}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {member.bio}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="rounded-2xl bg-brand-ink px-6 py-10 text-white md:px-10">
          <h2 className="font-heading text-2xl font-bold md:text-3xl">
            Lorem ipsum dolor sit amet
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70 md:text-base">
            Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
            labore et dolore magna aliqua.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/join"
              className={cn(
                buttonVariants({ size: "xl" }),
                "bg-brand-coral text-white hover:bg-brand-coral/90"
              )}
            >
              Join the Talent Pool
            </Link>
            <Link
              href="/employers"
              className={cn(
                buttonVariants({ size: "xl", variant: "outline" }),
                "border-white/30 bg-transparent text-white hover:bg-white/10"
              )}
            >
              Request Staff
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
