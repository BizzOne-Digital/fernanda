"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils/cn";
import type { SiteSettingsData } from "@/lib/data/settings";

const INTRO_KEY = "vaseaux-intro-seen";

type CinematicIntroProps = {
  settings: SiteSettingsData;
  children: React.ReactNode;
};

export function CinematicIntro({ settings, children }: CinematicIntroProps) {
  const [showIntro, setShowIntro] = useState(false);
  const [done, setDone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headline = settings.general.primaryHeadline;
  const brand = settings.general.shortBrandName;

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const oncePerSession = settings.motion.introOncePerSession;
    const seen = oncePerSession && sessionStorage.getItem(INTRO_KEY);

    if (!settings.motion.introEnabled || seen || reducedMotion) {
      setDone(true);
      return;
    }

    setShowIntro(true);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        onComplete: () => {
          sessionStorage.setItem(INTRO_KEY, "1");
          setShowIntro(false);
          setDone(true);
        },
      });

      tl.fromTo(
        ".intro-horizon",
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 1, duration: 0.8 },
      )
        .fromTo(".intro-tag", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.2")
        .fromTo(
          ".intro-line",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.15, duration: 0.45 },
          "-=0.1",
        )
        .fromTo(
          ".intro-brand",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5 },
          "-=0.05",
        )
        .to(overlayRef.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.9,
          ease: "power3.inOut",
        });
    }, overlayRef);

    return () => ctx.revert();
  }, [settings.motion.introEnabled, settings.motion.introOncePerSession]);

  const skip = () => {
    sessionStorage.setItem(INTRO_KEY, "1");
    setShowIntro(false);
    setDone(true);
  };

  return (
    <>
      {showIntro ? (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-lake-deep text-cream"
          role="dialog"
          aria-label="Welcome introduction"
        >
          <button
            type="button"
            onClick={skip}
            className="absolute right-4 top-4 rounded-full border border-cream/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-cream/90 transition hover:bg-cream/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-golden"
          >
            Skip intro
          </button>

          <div className="intro-horizon mb-10 h-px w-48 origin-center bg-golden shadow-[0_8px_24px_rgb(213_154_69_/_0.35)]" />
          <p className="intro-tag mb-8 rounded border border-sand/40 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-sand">
            {brand} • Summer
          </p>
          <div className="space-y-2 text-center font-serif text-3xl uppercase tracking-[0.25em] md:text-5xl">
            <p className="intro-line">Lake days</p>
            <p className="intro-line text-golden">Slow mornings</p>
            <p className="intro-line">Lasting memories</p>
          </div>
          <p className="intro-brand mt-10 max-w-md px-6 text-center text-sm text-cream/85 md:text-base">
            {headline}
          </p>
        </div>
      ) : null}
      <div className={cn(showIntro && !done && "opacity-0")}>{children}</div>
    </>
  );
}
