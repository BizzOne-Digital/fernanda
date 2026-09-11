import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { ComponentPropsWithoutRef, forwardRef } from "react";

const variants = {
  primary:
    "bg-lake-deep text-cream hover:bg-lake-medium focus-visible:ring-golden",
  secondary:
    "bg-sand/40 text-ink border border-sand hover:bg-sand/70 focus-visible:ring-lake-medium",
  ghost: "bg-transparent text-lake-deep hover:bg-lake-deep/5 focus-visible:ring-lake-medium",
  golden: "bg-golden text-ink hover:brightness-105 focus-visible:ring-lake-deep",
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
