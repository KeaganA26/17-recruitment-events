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
      aria-label="Seventeen Recruitment home"
    >
      <Image
        src="/logo.png"
        alt="Seventeen Recruitment"
        width={777}
        height={225}
        priority
        className={cn(
          "h-9 w-auto rounded-md sm:h-10",
          compact && "h-8 sm:h-9"
        )}
      />
    </Link>
  );
}
