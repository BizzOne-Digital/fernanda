"use client";

import { useEffect, useRef, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils/cn";

gsap.registerPlugin(ScrollTrigger);

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  as?: ElementType;
  /** Subtle scale-in (default on). */
  scale?: boolean;
};

const offsets = {
  up: { y: 40, x: 0 },
  down: { y: -40, x: 0 },
  left: { x: 40, y: 0 },
  right: { x: -40, y: 0 },
};

export function ScrollReveal({
  children,
  className,
  direction = "up",
  delay = 0,
  as: Tag = "div",
  scale = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const { x, y } = offsets[direction];
    const ctx = gsap.context(() => {
      gsap.fromTo(
        element,
        { autoAlpha: 0, x, y, scale: scale ? 0.96 : 1 },
        {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 0.95,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: "top 86%",
            once: true,
          },
        },
      );
    }, element);

    return () => ctx.revert();
  }, [direction, delay, scale]);

  return (
    // Polymorphic `as` — ref type varies by element
    <Tag ref={ref as never} data-scroll-reveal="" className={cn(className)}>
      {children}
    </Tag>
  );
}
