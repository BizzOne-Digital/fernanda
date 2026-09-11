"use client";

import { SessionProvider } from "next-auth/react";
import { RouteTransitionProvider } from "@/components/motion/route-transition-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <RouteTransitionProvider>{children}</RouteTransitionProvider>
    </SessionProvider>
  );
}
