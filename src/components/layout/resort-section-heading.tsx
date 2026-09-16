import { cn } from "@/lib/utils/cn";

type ResortSectionHeadingProps = {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
};

export function ResortSectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: ResortSectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <h2 className="font-serif text-3xl font-semibold text-resort-navy md:text-4xl">{title}</h2>
      <div
        className={cn(
          "mt-3 h-0.5 w-16 bg-golden",
          align === "center" ? "mx-auto" : "",
        )}
        aria-hidden
      />
      {subtitle ? (
        <p className={cn("mt-4 max-w-3xl text-base leading-relaxed text-ink/75", align === "center" && "mx-auto")}>
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
