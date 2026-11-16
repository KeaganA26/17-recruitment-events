import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { FAQ } from "@/components/FAQ";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact Us"
        description="Tell us what you need. Whether you're hiring or looking for your next opportunity, we'd love to hear from you."
      />
      <section className="container-page py-12 lg:py-16">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-brand-paper p-5 shadow-sm md:p-8">
          <ContactForm />
        </div>
      </section>
      <section className="container-page pb-16">
        <h2 className="font-heading mb-6 text-2xl font-bold">FAQ</h2>
        <FAQ />
      </section>
    </>
  );
}
