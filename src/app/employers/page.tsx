import type { Metadata } from "next";
import Image from "next/image";
import { EmployerForm } from "@/components/EmployerForm";
import { SectionHeading } from "@/components/SectionHeading";
import { employerServices, employerSolutions } from "@/data/content";
import { images } from "@/data/site";

export const metadata: Metadata = {
  title: "Event Staffing For Employers",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
};

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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/75">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco.
          </p>
        </div>
      </section>

      <section className="container-page py-16 md:py-20">
        <SectionHeading
          eyebrow="Coverage"
          title="Lorem ipsum dolor sit amet"
          description="Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore."
        />
        <div className="mt-8 flex flex-wrap gap-3">
          {employerServices.map((service) => (
            <span
              key={service}
              className="rounded-full border border-border bg-brand-paper px-4 py-2 text-sm font-medium"
            >
              {service}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-brand-sand/40">
        <div className="container-page py-16 md:py-20">
          <SectionHeading
            title="Lorem ipsum dolor sit amet"
            description="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {employerSolutions.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-border bg-brand-paper p-6"
              >
                <h3 className="font-heading text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page grid gap-12 py-16 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Request staff"
            title="Lorem ipsum dolor sit amet"
            description="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum."
          />
        </div>
        <div className="rounded-2xl border border-border bg-brand-paper p-5 shadow-sm md:p-8">
          <EmployerForm />
        </div>
      </section>
    </>
  );
}
