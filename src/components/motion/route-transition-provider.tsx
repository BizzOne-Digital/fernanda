"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

type RouteTransitionProviderProps = {
  children: React.ReactNode;
};

export function RouteTransitionProvider({ children }: RouteTransitionProviderProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [phase, setPhase] = useState<"idle" | "exit" | "enter">("idle");
  const previousPath = useRef(pathname);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (pathname === previousPath.current) {
      setDisplayChildren(children);
      return;
    }

    if (reducedMotion) {
      previousPath.current = pathname;
      setDisplayChildren(children);
      return;
    }

    setPhase("exit");
    const exitTimer = window.setTimeout(() => {
      previousPath.current = pathname;
      setDisplayChildren(children);
      setPhase("enter");
      window.setTimeout(() => setPhase("idle"), 600);
    }, 450);

    return () => window.clearTimeout(exitTimer);
  }, [pathname, children, reducedMotion]);

  return (
    <div
      className={cn(
        "route-transition site-shell min-h-screen transition-[opacity,transform,filter] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        phase === "exit" && "pointer-events-none scale-[0.985] opacity-0 blur-[1px]",
        phase === "enter" && "scale-100 opacity-100 blur-0",
        phase === "idle" && "scale-100 opacity-100 blur-0",
      )}
      style={{
        backgroundImage:
          phase === "exit"
            ? "linear-gradient(180deg, rgb(78 130 144 / 0.08), transparent 40%)"
            : undefined,
      }}
    >
      {displayChildren}
    </div>
  );
}
