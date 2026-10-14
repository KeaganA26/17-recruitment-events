import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { TalentForm } from "@/components/TalentForm";
import { FAQ } from "@/components/FAQ";

export const metadata: Metadata = {
  title: "Join The 17 Talent Network",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.",
};

export default function JoinPage() {
  return (
    <>
      <PageHero
        eyebrow="Candidates"
        title="Lorem ipsum dolor sit amet"
        description="Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      />
      <section className="container-page grid gap-12 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
        <div>
          <h2 className="font-heading text-2xl font-bold">Lorem ipsum dolor</h2>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat.
          </p>
          <ul className="mt-6 space-y-3 text-sm leading-6 text-foreground/80">
            <li>Brand ambassadors and promotional staff</li>
            <li>Hosts, ushers and registration teams</li>
            <li>Hospitality, bar and waiting staff</li>
            <li>Event crew and supervisors</li>
          </ul>
          <p className="mt-6 text-sm leading-6 text-muted-foreground">
            Your details stay on this device in the demo. When the backend is
            connected, registrations will go to the 17 recruitment team.
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-brand-paper p-5 shadow-sm md:p-8">
          <TalentForm />
        </div>
      </section>
      <section className="container-page pb-16">
        <h2 className="font-heading mb-6 text-2xl font-bold">Common questions</h2>
        <FAQ />
      </section>
    </>
  );
}
