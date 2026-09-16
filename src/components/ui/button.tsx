import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import { ComponentPropsWithoutRef, forwardRef } from "react";

const variants = {
  primary: "resort-btn-primary focus-visible:ring-2 focus-visible:ring-golden focus-visible:ring-offset-2",
  secondary: "resort-btn-outline focus-visible:ring-2 focus-visible:ring-lake-medium focus-visible:ring-offset-2",
  ghost:
    "inline-flex items-center justify-center rounded-sm border border-transparent bg-transparent px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-resort-navy transition hover:bg-sand/40",
  golden: "resort-btn-primary",
} as const;

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: keyof typeof variants;
  href?: string;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", href, children, ...props }, ref) => {
    const classes = cn(variants[variant], "disabled:opacity-50", className);

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
