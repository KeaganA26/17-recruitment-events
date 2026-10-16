import type { Metadata } from "next";
import { FAQ } from "@/components/FAQ";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about hiring and finding roles with 17 Recruitment.",
};

export default function FAQPage() {
  return (
    <>
      <PageHero
        eyebrow="Help"
        title="Frequently Asked Questions"
        description="How we work with businesses and candidates across the events and communications industries."
      />
      <section className="container-page max-w-4xl py-12 md:py-16">
        <FAQ />
      </section>
    </>
  );
}
