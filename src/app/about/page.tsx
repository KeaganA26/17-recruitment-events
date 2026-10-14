import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { SectionHeading } from "@/components/SectionHeading";
import { images } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="Lorem ipsum dolor sit amet"
        description="Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />

      <section className="container-page grid items-center gap-10 py-16 lg:grid-cols-2">
        <div>
          <SectionHeading
            title="Lorem ipsum dolor sit amet"
            description="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
          />
          <ul className="mt-6 grid gap-3 text-sm font-medium sm:grid-cols-2">
            {[
              "Events",
              "Promotions",
              "Hospitality",
              "Brand activations",
              "Temporary staffing",
            ].map((item) => (
              <li
                key={item}
                className="rounded-xl border border-border bg-brand-paper px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
          <Image
            src={images.venue}
            alt="A styled event venue prepared for guests"
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>
      </section>

      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={images.about}
            alt="A large conference audience during a live session"
            fill
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-brand-ink/70" />
        </div>
        <div className="container-page relative py-24 md:py-32">
          <p className="text-xs font-semibold tracking-[0.22em] text-brand-gold uppercase">
            Lorem ipsum
          </p>
          <p className="font-heading mt-4 max-w-3xl text-3xl font-extrabold text-white md:text-5xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>
      </section>

      <section className="container-page grid gap-8 py-16 md:grid-cols-3">
        {[
          {
            title: "Lorem ipsum",
            text: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          },
          {
            title: "Dolor sit amet",
            text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
          },
          {
            title: "Consectetur",
            text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
          },
        ].map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-border bg-brand-paper p-6"
          >
            <h2 className="font-heading text-xl font-bold">{item.title}</h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
          </article>
        ))}
      </section>
    </>
  );
}
