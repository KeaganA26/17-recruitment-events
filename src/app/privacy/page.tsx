import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { site } from "@/data/site";

const updated = "17 November 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} collects, uses and protects personal information when you apply for work, join the talent network, or contact us.`,
};

const contact = (
  <Link href="/contact" className="font-medium text-foreground underline underline-offset-4">
    contact form
  </Link>
);

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-2xl font-bold text-foreground">{title}</h2>
      <div className="mt-3 space-y-3">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="What we collect when you use this website, why we collect it, who we share it with, and the choices you have."
      />
      <article className="container-page max-w-3xl space-y-10 py-12 leading-7 text-muted-foreground md:py-16">
        <p className="text-sm text-foreground">Last updated {updated}.</p>

        <Section title="Who we are">
          <p>
            {site.name} operates this website at {site.url.replace("https://", "")}. We are a
            recruitment business based in {site.location}, specialising in permanent and freelance
            recruitment for the events and communications industries.
          </p>
          <p>
            We are the controller of the personal information described in this policy. That means
            we decide why and how it is used. Questions about this policy, or requests about your
            information, can be sent through our {contact}. Our office hours are {site.hours}.
          </p>
        </Section>

        <Section title="Information we collect">
          <p>The information we hold depends on how you deal with us.</p>
          <p className="font-medium text-foreground">Job applications</p>
          <p>When you apply for a listed role, we collect:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>your first and last name, email address and UK mobile number;</li>
            <li>your city and region;</li>
            <li>the role you applied for;</li>
            <li>any message you choose to add;</li>
            <li>your CV, as a PDF or Word file of up to 5MB.</li>
          </ul>
          <p className="font-medium text-foreground">Talent network</p>
          <p>
            If you join the talent network, we collect the same contact and CV details, plus your
            preferred role, a short note about your experience, and your availability.
          </p>
          <p className="font-medium text-foreground">Employer requests</p>
          <p>When a business asks us for staff, we collect:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>company name and the name of the person contacting us;</li>
            <li>email address and phone number;</li>
            <li>event date, location, number of staff and the type of staff needed;</li>
            <li>the message describing the booking.</li>
          </ul>
          <p className="font-medium text-foreground">General enquiries</p>
          <p>
            The contact form collects your name, email address, phone number, a subject and your
            message.
          </p>
          <p className="font-medium text-foreground">Information inside a CV</p>
          <p>
            A CV can include employment history, education, qualifications and other details you
            choose to include. We do not ask for special category information, such as health,
            ethnicity or religion. If a CV contains it, we treat it as confidential and use it only
            where it is relevant to considering you for work or where the law requires it.
          </p>
          <p className="font-medium text-foreground">Technical information</p>
          <p>
            When you use the site, our hosting and security providers process technical information
            such as your IP address, browser type and the pages you request. We use this to deliver
            the site and to block spam and abuse. We do not use it to build an advertising profile.
          </p>
          <p>
            Some photographs on the site are loaded from Unsplash. Your browser may send technical
            information, including your IP address, to Unsplash when those images load.
          </p>
        </Section>

        <Section title="How we use it, and why">
          <p>We use personal information for these purposes:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              to review a job application, contact you about it, and decide whether to put you
              forward. We do this to take the steps you asked for before any contract, and because
              you consent by ticking the box on the form;
            </li>
            <li>
              to keep you in the talent network and tell you about roles that match the preferences
              you gave us. We do this with your consent, which you can withdraw at any time;
            </li>
            <li>
              to reply to employer and general enquiries, prepare a proposal, and provide the
              recruitment service you asked for. We do this because you asked us to, and because it
              is in our legitimate interests to respond to people who contact the business;
            </li>
            <li>
              to keep records of bookings and introductions where we need them for accounting, tax,
              or to deal with a complaint or legal claim;
            </li>
            <li>
              to protect the website from spam and misuse, using Cloudflare Turnstile on each form.
              This is in our legitimate interests in keeping the site secure.
            </li>
          </ul>
          <p>
            We do not sell personal information. We do not add you to a marketing list, and we do
            not send newsletters. We contact candidates about roles they applied for, or about work
            that fits the talent-network preferences they gave us.
          </p>
          <p>
            People at {site.name} review applications. We do not make decisions about you by
            automated means that have a legal or similarly significant effect.
          </p>
        </Section>

        <Section title="Who we share it with">
          <p>We share personal information only where it is needed:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              with a client business, when we put you forward for a role or a booking. We share
              what that client needs to consider you, typically your name, contact details,
              relevant experience and CV. Once a client has that information for an engagement,
              they are responsible for how they use it;
            </li>
            <li>
              with the providers who run this website for us: our website host and database host,
              which store the site and the records you submit; Cloudflare, which checks forms for
              spam and stores CV files privately; and Microsoft 365, which delivers an email to our
              team when a form is sent. That email contains your name and the role or subject, not
              the full application;
            </li>
            <li>
              with professional advisers, or with a regulator, court or law-enforcement body, where
              the law requires it or where we need to establish or defend a legal claim;
            </li>
            <li>
              with a buyer of the business, if we sell or reorganise it, and only under
              confidentiality terms.
            </li>
          </ul>
          <p>
            Our providers process information on our instructions and are required to protect it.
            CV files are stored privately. They are not published on the website.
          </p>
        </Section>

        <Section title="Information sent outside the United Kingdom">
          <p>
            Some of our providers, including Cloudflare and Microsoft, may process information
            outside the United Kingdom. Where they do, we rely on a safeguard recognised by UK data
            protection law. That is an adequacy regulation, where one applies, or a contract such
            as the UK International Data Transfer Agreement or Addendum and the Standard
            Contractual Clauses.
          </p>
        </Section>

        <Section title="How long we keep it">
          <p>We keep personal information only for as long as we need it for the reason we collected it.</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              Job applications that do not lead to work are kept for 12 months, so we can answer
              questions about the application and consider you for a similar role, unless you ask
              us to delete them sooner.
            </li>
            <li>
              Talent-network records are kept while you want to stay registered, and for up to 24
              months after we last hear from you. You can ask us to remove you at any time.
            </li>
            <li>
              If we place you, or we work with you or your business, we keep the records for the
              relationship and then for up to 6 years where we need them for tax, accounting, or
              legal claims.
            </li>
            <li>
              Employer requests and contact messages that do not lead to work are kept for 24
              months.
            </li>
            <li>Your CV is deleted when the record it belongs to is deleted.</li>
            <li>
              Spam-check and security information is kept only for as long as needed to protect
              the site.
            </li>
          </ul>
        </Section>

        <Section title="Cookies">
          <p>
            This website does not use advertising cookies or analytics cookies, and it does not ask
            you to accept a cookie banner for optional tracking.
          </p>
          <p>
            Cloudflare Turnstile may set a strictly necessary cookie when you submit a form, so we
            can tell a person from automated spam. That cookie is required for the form to work.
            You can block cookies in your browser, but the forms may then fail.
          </p>
        </Section>

        <Section title="How we protect it">
          <p>
            The site is served over encrypted connections (HTTPS). Access to applications, CVs and
            our inbox is limited to the people who need them for their work. We collect only what
            the forms ask for, and CV files are stored in private storage rather than on public
            pages.
          </p>
          <p>
            No online service can guarantee absolute security. If a breach affects you and the law
            requires us to tell you, we will do so.
          </p>
        </Section>

        <Section title="Your rights">
          <p>Under the UK GDPR and the Data Protection Act 2018, you can ask us to:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>tell you whether we hold personal information about you, and for a copy of it;</li>
            <li>correct information that is inaccurate or incomplete;</li>
            <li>delete it, in the circumstances the law allows;</li>
            <li>restrict how we use it, or object to use based on our legitimate interests;</li>
            <li>receive information you provided to us in a portable format, where the law applies;</li>
            <li>
              withdraw consent. This stops future use that depends on consent, including the talent
              network. It does not affect use that took place before you withdrew it, or use we can
              lawfully continue for another reason, such as a legal duty.
            </li>
          </ul>
          <p>
            Use our {contact}. We may need to confirm it is you before we act. We will respond within
            one month, or tell you if we need longer and why. We do not charge for a reasonable
            request.
          </p>
          <p>
            If you are unhappy with how we handle your information, contact us first and we will try
            to put it right. You can also complain to the Information Commissioner&apos;s Office at{" "}
            <a
              className="font-medium text-foreground underline underline-offset-4"
              href="https://ico.org.uk/make-a-complaint/"
              rel="noopener noreferrer"
            >
              ico.org.uk/make-a-complaint
            </a>
            . The ICO&apos;s address is Wycliffe House, Water Lane, Wilmslow, Cheshire, SK9 5AF.
          </p>
        </Section>

        <Section title="Children">
          <p>
            This website and the work we recruit for are aimed at people aged 18 and over. We do
            not knowingly collect personal information from children. If you believe we have,
            tell us through the {contact} and we will delete it.
          </p>
        </Section>

        <Section title="Changes to this policy">
          <p>
            We will update this page if our services or the law change. The date at the top is the
            date of the current version. Please check it when you use the site.
          </p>
        </Section>
      </article>
    </>
  );
}
