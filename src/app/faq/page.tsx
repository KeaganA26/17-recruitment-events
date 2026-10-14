import type { Metadata } from "next";
import { FAQ } from "@/components/FAQ";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
};

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="Help"
        title="Frequently Asked Questions"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt."
      />
      <section className="container-page max-w-4xl py-12 md:py-16">
        <FAQ />
      </section>
    </>
  );
}
