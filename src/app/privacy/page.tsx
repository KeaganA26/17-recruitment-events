import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Placeholder privacy policy for 17 Recruitment Events. This page requires final legal review before launch.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="This is a placeholder policy for the customer demo. It must receive final legal review before the website goes live."
      />
      <article className="container-page max-w-3xl space-y-8 py-12 leading-7 text-muted-foreground md:py-16">
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Candidate information
          </h2>
          <p className="mt-3">
            When you apply for a role or join the talent network, we collect
            information such as your name, email, mobile number, city, region,
            preferred roles, availability and any message you choose to send.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            CV information
          </h2>
          <p className="mt-3">
            Your CV may include employment history, education and contact
            details. In this demo, files are not uploaded or stored. In
            production, CV files would be used only to assess suitability for
            event and hospitality placements.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Recruitment purposes
          </h2>
          <p className="mt-3">
            We use personal information to review applications, contact
            shortlisted candidates, match people to client briefs and
            communicate about upcoming opportunities.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Contact information
          </h2>
          <p className="mt-3">
            Employer and general enquiry forms collect company and contact
            details so we can respond to staffing requests. We do not sell
            personal information.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            UK GDPR
          </h2>
          <p className="mt-3">
            17 Recruitment Events intends to process personal information in
            line with UK GDPR and the Data Protection Act 2018. Access,
            correction and deletion requests will be handled through the
            contact channels published on this website.
          </p>
        </section>
        <section>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            User consent
          </h2>
          <p className="mt-3">
            Application and talent forms include a consent checkbox. Submitting
            those forms indicates that you agree to 17 Recruitment Events using
            your information for recruitment purposes.
          </p>
        </section>
        <p className="rounded-2xl bg-brand-sand/70 p-5 text-sm text-foreground">
          This page is not legal advice and is not a final privacy policy. A
          qualified professional should review and complete it before launch.
        </p>
      </article>
    </>
  );
}
