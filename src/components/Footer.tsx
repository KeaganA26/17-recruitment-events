import type { ReactNode, SVGProps } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { site } from "@/data/site";

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zm8 2H8a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3zm-4 3.2A3.8 3.8 0 1 1 8.2 12 3.8 3.8 0 0 1 12 8.2zm0 1.8a2 2 0 1 0 2 2 2 2 0 0 0-2-2zm4.35-2.55a.95.95 0 1 1-.95.95.95.95 0 0 1 .95-.95z" />
    </Icon>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h3l1-3h-4v-2c0-.6.4-1 1-1z" />
    </Icon>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M6.5 9H3.8v11h2.7zm.2-3.8A1.6 1.6 0 1 1 5 3.6a1.6 1.6 0 0 1 1.7 1.6zM20.2 20h-2.7v-5.6c0-1.6-.6-2.5-1.8-2.5s-2 1.1-2 2.6V20H11V9h2.6v1.5c.5-.9 1.7-1.8 3.4-1.8 2.4 0 4.2 1.6 4.2 5z" />
    </Icon>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <Icon className={className}>
      <path d="M14.5 3c.4 2.4 1.8 4.2 4.1 4.6v3.1c-1.4 0-2.7-.4-3.9-1.2v6.8c0 3.6-2.8 6.2-6.4 6.2S2 19.9 2 16.3c0-3.5 2.8-6.2 6.3-6.2.4 0 .8 0 1.2.1v3.3c-.4-.2-.8-.3-1.2-.3-1.8 0-3.2 1.4-3.2 3.1s1.4 3.2 3.2 3.2 3.3-1.4 3.3-3.2V3z" />
    </Icon>
  );
}

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Meet the Team" },
  { href: "/contact", label: "Contact" },
  { href: "/employers", label: "For Employers" },
];

const candidateLinks = [
  { href: "/jobs", label: "Find Jobs" },
  { href: "/join", label: "Join the Talent Pool" },
  { href: "/faq", label: "FAQ" },
];

const legalLinks = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms & Conditions" },
];

export function Footer() {
  return (
    <footer className="bg-brand-ink text-white">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">
            {site.description}
          </p>
          <div className="mt-6 flex items-center gap-3">
            <SocialLink href={site.social.instagram} label="Instagram">
              <InstagramIcon className="size-4" />
            </SocialLink>
            <SocialLink href={site.social.facebook} label="Facebook">
              <FacebookIcon className="size-4" />
            </SocialLink>
            <SocialLink href={site.social.linkedin} label="LinkedIn">
              <LinkedInIcon className="size-4" />
            </SocialLink>
            <SocialLink href={site.social.tiktok} label="TikTok">
              <TikTokIcon className="size-4" />
            </SocialLink>
          </div>
        </div>

        <FooterColumn title="Company" links={companyLinks} />
        <FooterColumn title="Candidates" links={candidateLinks} />
        <FooterColumn title="Legal" links={legalLinks} />
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {site.name}. All rights reserved.</p>
          <p>London · Manchester · Birmingham · Edinburgh</p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="font-heading text-sm font-bold uppercase tracking-[0.16em] text-white/80">
        {title}
      </h3>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="grid size-10 place-items-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white"
    >
      {children}
    </a>
  );
}
