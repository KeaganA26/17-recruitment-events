import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  compact = false,
}: {
  className?: string;
  light?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("inline-flex shrink-0 rounded-md", className)}
      aria-label="17 Recruitment home"
    >
      <Image
        src="/logo.png"
        alt="17 Recruitment — Events & Communications"
        width={1090}
        height={642}
        priority
        className={cn("h-14 w-auto sm:h-16", compact && "h-12 sm:h-14")}
      />
    </Link>
  );
}
