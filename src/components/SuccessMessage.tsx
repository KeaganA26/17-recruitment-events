import { CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type SuccessMessageProps = {
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
};

export function SuccessMessage({
  title,
  description,
  primaryHref = "/jobs",
  primaryLabel = "Browse more jobs",
}: SuccessMessageProps) {
  return (
    <div className="rounded-2xl border border-border bg-brand-paper p-8 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-700">
        <CheckCircle2 className="size-7" aria-hidden="true" />
      </div>
      <h3 className="font-heading mt-5 text-2xl font-bold">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
        {description}
      </p>
      <Link
        href={primaryHref}
        className={cn(
          buttonVariants({ size: "xl" }),
          "mt-6 bg-brand-ink text-white hover:bg-brand-ink/90"
        )}
      >
        {primaryLabel}
      </Link>
    </div>
  );
}
