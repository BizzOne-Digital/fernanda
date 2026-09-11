"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

type MagneticButtonProps = React.ComponentPropsWithoutRef<"button"> & {
  strength?: number;
};

export function MagneticButton({
  children,
  className,
  strength = 0.18,
  ...props
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [enabled, setEnabled] = useState(false);

  const onMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = event.clientX - (rect.left + rect.width / 2);
    const y = event.clientY - (rect.top + rect.height / 2);
    ref.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  };

  const reset = () => {
    if (!ref.current) return;
    ref.current.style.transform = "";
  };

  return (
    <button
      ref={ref}
      className={cn("transition-transform duration-200 will-change-transform", className)}
      onMouseEnter={() => {
        const fine = window.matchMedia("(pointer: fine)").matches;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setEnabled(fine && !reduced);
      }}
      onMouseMove={onMove}
      onMouseLeave={() => {
        setEnabled(false);
        reset();
      }}
      onBlur={reset}
      {...props}
    >
      {children}
    </button>
  );
}
