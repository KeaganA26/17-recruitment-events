import type { Metadata } from "next";
import { Clock3, Mail, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "@/components/ContactForm";
import { FAQ } from "@/components/FAQ";
import { PageHero } from "@/components/PageHero";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
};

export default function ContactPage() {
  const details = [
    {
      icon: Mail,
      label: "Email",
      value: site.email,
      href: `mailto:${site.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: site.phone,
      href: site.phoneHref,
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: site.whatsapp,
      href: site.whatsappHref,
    },
    {
      icon: Clock3,
      label: "Business hours",
      value: site.hours,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact Us"
        description="Tell us what you need. Whether you're hiring or looking for your next opportunity, we'd love to hear from you."
      />
      <section className="container-page grid gap-10 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <div className="grid gap-4">
          {details.map((item) => {
            const Icon = item.icon;
            const content = (
              <article className="rounded-2xl border border-border bg-brand-paper p-5">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl bg-brand-ink text-brand-gold">
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      {item.label}
                    </p>
                    <p className="mt-1 font-medium">{item.value}</p>
                  </div>
                </div>
              </article>
            );
            return item.href ? (
              <a key={item.label} href={item.href}>
                {content}
              </a>
            ) : (
              <div key={item.label}>{content}</div>
            );
          })}
          <p className="text-sm text-muted-foreground">
            Phone and WhatsApp numbers are being confirmed and will be updated
            shortly.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-brand-paper p-5 shadow-sm md:p-8">
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
