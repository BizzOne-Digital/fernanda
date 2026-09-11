import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type SiteLogoProps = {
  className?: string;
  compact?: boolean;
  tone?: "dark" | "light";
};

export function SiteLogo({ className, compact, tone = "dark" }: SiteLogoProps) {
  const textClass = tone === "light" ? "text-cream" : "text-lake-deep";
  const subTextClass = tone === "light" ? "text-cream/75" : "text-lake-deep/80";
  const iconWrapClass =
    tone === "light"
      ? "border-cream/20 bg-lake-deep/40"
      : "border-lake-deep/15 bg-cream";

  return (
    <Link href="/" className={cn("group flex min-w-0 items-center gap-2.5 sm:gap-3", className)}>
      <span
        aria-hidden
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border",
          iconWrapClass,
        )}
      >
        <svg viewBox="0 0 48 48" className={cn("h-7 w-7", textClass)} fill="none">
          <path
            d="M8 30c6-8 12-8 16-4s10 4 16-2"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M6 34c8-6 14-6 20-2s12 4 16 0"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.55"
          />
          <circle cx="36" cy="14" r="5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M36 19v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </span>
      <span className={cn("min-w-0 leading-none", compact && "hidden sm:block")}>
        <span className={cn("block truncate font-serif text-base font-bold tracking-[0.06em] sm:text-[1.05rem] sm:tracking-[0.08em] md:text-lg", textClass)}>
          Vaseaux Lake
        </span>
        <span className={cn("mt-1 block truncate font-serif text-[0.58rem] font-bold tracking-[0.2em] sm:text-[0.62rem] sm:tracking-[0.28em] md:text-[0.68rem]", subTextClass)}>
          Waterfront Cabins
        </span>
      </span>
    </Link>
  );
}
