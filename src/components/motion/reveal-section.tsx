import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { cn } from "@/lib/utils/cn";

type RevealSectionProps = {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
};

/** Animated `<section>` — use when you want explicit control instead of auto-reveal. */
export function RevealSection({
  children,
  className,
  direction = "up",
  delay = 0,
}: RevealSectionProps) {
  return (
    <ScrollReveal as="section" className={className} direction={direction} delay={delay}>
      {children}
    </ScrollReveal>
  );
}

type RevealItemProps = {
  children: React.ReactNode;
  className?: string;
  index: number;
  direction?: "up" | "left" | "right";
};

/** Grid/card stagger — pair with manual section headings. */
export function RevealItem({
  children,
  className,
  index,
  direction = "up",
}: RevealItemProps) {
  const staggerDirections: Array<"up" | "left" | "right"> = ["up", "left", "right"];
  const resolved = direction === "up" && index % 3 === 1 ? staggerDirections[index % 3] : direction;

  return (
    <ScrollReveal
      className={cn(className)}
      direction={resolved}
      delay={(index % 10) * 0.07}
    >
      {children}
    </ScrollReveal>
  );
}
