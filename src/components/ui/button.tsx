import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { ComponentPropsWithoutRef, forwardRef } from "react";

const variants = {
  primary:
    "bg-lake-medium text-cream shadow-[0_4px_16px_rgb(77_184_212_/_25%)] hover:bg-lake-deep hover:shadow-[0_6px_20px_rgb(42_125_148_/_30%)] focus-visible:ring-golden",
  secondary:
    "bg-white text-lake-deep border border-lake-medium/30 shadow-sm hover:border-lake-medium/60 hover:bg-sky-bright/15 focus-visible:ring-lake-medium",
  ghost: "bg-transparent text-lake-deep hover:bg-sky-bright/20 focus-visible:ring-lake-medium",
  golden:
    "bg-golden text-ink shadow-[0_4px_16px_rgb(240_180_41_/_30%)] hover:brightness-110 focus-visible:ring-lake-deep",
} as const;

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: keyof typeof variants;
  href?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", href, children, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:opacity-50",
      variants[variant],
      className,
    );

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
