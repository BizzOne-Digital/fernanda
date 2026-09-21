import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export const SITE_LOGO_PATH = "/images/vaseaux-lake-logo.png";

type SiteLogoProps = {
  className?: string;
  compact?: boolean;
  tone?: "dark" | "light";
  /** @deprecated Full logo image includes wordmark; kept for API compatibility. */
  showText?: boolean;
};

export function SiteLogo({ className, compact }: SiteLogoProps) {
  return (
    <Link
      href="/"
      aria-label="Vaseaux Lake Waterfront Cabins — home"
      className={cn("group inline-flex min-w-0 max-w-full items-center", className)}
    >
      <Image
        src={SITE_LOGO_PATH}
        alt="Vaseaux Lake Waterfront Cabins"
        width={280}
        height={84}
        priority
        className={cn(
          "h-9 w-auto max-w-[min(200px,52vw)] object-contain object-left sm:h-10 md:h-11",
          compact && "max-w-[min(180px,48vw)]",
        )}
      />
    </Link>
  );
}
