import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CTASectionProps = {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function CTASection({
  title = "The right connections make all the difference.",
  description = "Looking for your next opportunity, or the person who could make all the difference to your business? We'd love to hear from you.",
  primaryHref = "/jobs",
  primaryLabel = "Find Jobs",
  secondaryHref = "/contact",
  secondaryLabel = "Get in touch with our team",
}: CTASectionProps) {
  return (
    <section className="bg-brand-coral">
      <div className="container-page flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-center md:py-20">
        <div className="max-w-2xl">
          <h2 className="font-heading text-3xl font-extrabold text-white md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-base leading-7 text-white/85 md:text-lg">
            {description}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href={primaryHref}
            className={cn(
              buttonVariants({ size: "xl" }),
              "bg-brand-ink text-white hover:bg-black"
            )}
          >
            {primaryLabel}
          </Link>
          <Link
            href={secondaryHref}
            className={cn(
              buttonVariants({ size: "xl", variant: "outline" }),
              "border-white/40 bg-transparent text-white hover:bg-white/10"
            )}
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
