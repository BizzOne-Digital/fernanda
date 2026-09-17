"use client";

import { RouteTransitionProvider } from "@/components/motion/route-transition-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return <RouteTransitionProvider>{children}</RouteTransitionProvider>;
}
