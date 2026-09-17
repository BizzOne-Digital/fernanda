"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type AutoSectionRevealProps = {
  children: React.ReactNode;
};

function sectionHasManualReveal(section: Element) {
  return section.hasAttribute("data-scroll-reveal") || Boolean(section.querySelector("[data-scroll-reveal]"));
}

function animateHero(section: HTMLElement) {
  const copyRoot = section.querySelector("[data-hero-copy]");
  const targets = copyRoot?.children.length
    ? copyRoot.children
    : section.querySelectorAll("h1, p");
  if (targets.length) {
    gsap.fromTo(
      targets,
      { y: 32, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 1.05,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.12,
      },
    );
  }

  const media = section.querySelector("[data-hero-media]");
  if (media) {
    gsap.fromTo(
      media,
      { scale: 1.12, autoAlpha: 0.85 },
      { scale: 1, autoAlpha: 1, duration: 1.5, ease: "power2.out" },
    );
  }
}

function animateSectionBlock(section: HTMLElement) {
  const heading = section.querySelector(":scope > h1, :scope > h2, :scope > p.text-center");
  const grid = section.querySelector(
    ":scope > .grid, :scope > div.grid, :scope > .mt-8.grid, :scope > .mt-6.grid, :scope > .mt-10.grid",
  );

  const trigger = {
    trigger: section,
    start: "top 86%",
    once: true,
  };

  if (heading) {
    gsap.fromTo(
      heading,
      { y: 28, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.85, ease: "power3.out", scrollTrigger: trigger },
    );
  }

  if (grid && grid.children.length > 1) {
    gsap.fromTo(
      grid.children,
      { y: 40, autoAlpha: 0, scale: 0.97 },
      {
        y: 0,
        autoAlpha: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.09,
        ease: "power2.out",
        scrollTrigger: trigger,
      },
    );
    return;
  }

  gsap.fromTo(
    section,
    { y: 48, autoAlpha: 0, scale: 0.985 },
    {
      y: 0,
      autoAlpha: 1,
      scale: 1,
      duration: 0.95,
      ease: "power3.out",
      scrollTrigger: trigger,
    },
  );
}

export function AutoSectionReveal({ children }: AutoSectionRevealProps) {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      root.querySelectorAll<HTMLElement>("section[data-hero]").forEach((hero) => animateHero(hero));

      root.querySelectorAll<HTMLElement>("section").forEach((section) => {
        if (section.hasAttribute("data-hero")) return;
        if (sectionHasManualReveal(section)) return;
        animateSectionBlock(section);
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div ref={rootRef} className="contents">
      {children}
    </div>
  );
}
