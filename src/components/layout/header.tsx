"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CabinData } from "@/lib/data/cabins";
import type { SiteSettingsData } from "@/lib/data/settings";
import { SiteLogo } from "@/components/layout/site-logo";
import { cn } from "@/lib/utils/cn";
import { PRIMARY_NAV } from "@/lib/site-nav";

const NAV = PRIMARY_NAV.filter(
  (item) => item.href !== "/" && item.href !== "/cabins" && item.href !== "/faqs",
);

type HeaderProps = {
  settings: SiteSettingsData;
  cabins: CabinData[];
};

export function Header({ settings, cabins }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [open, setOpen] = useState(false);
  const [cabinsOpen, setCabinsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    setCabinsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setCabinsOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ctaText = settings.footer.ctaText || "Check availability";
  const ctaUrl = settings.footer.ctaUrl || "/inquire";

  const navLinkClass = (href: string) =>
    cn(
      "text-sm font-medium text-ink/75 transition hover:text-lake-deep",
      pathname === href && "text-lake-deep",
    );

  const shellClass = cn(
    "mx-auto flex w-full min-w-0 max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4 md:px-6",
    isHome &&
      "rounded-sm border border-white/40 bg-white/85 shadow-[0_8px_32px_rgb(30_95_115_/_8%)] backdrop-blur-md",
    !isHome && "max-w-7xl border-b border-sand/50 bg-cream/90 py-3 backdrop-blur-md",
  );

  return (
    <header
      className={cn(
        "site-shell z-50 w-full",
        isHome ? "absolute inset-x-0 top-0 px-3 pt-3 sm:px-4 sm:pt-4 md:px-8 md:pt-5" : "sticky top-0",
      )}
    >
      <div className={shellClass}>
        <SiteLogo className="min-w-0 shrink" />

        <nav className="hidden min-w-0 items-center gap-4 xl:gap-6 xl:flex" aria-label="Main">
          <Link href="/" className={navLinkClass("/")}>
            Home
          </Link>

          <div
            ref={menuRef}
            className="relative"
            onMouseEnter={() => setCabinsOpen(true)}
            onMouseLeave={() => setCabinsOpen(false)}
          >
            <button
              type="button"
              className={cn(
                "text-sm font-medium text-ink/75 transition hover:text-lake-deep",
                pathname.startsWith("/cabins") && "text-lake-deep",
              )}
              aria-expanded={cabinsOpen}
              aria-haspopup="true"
              onClick={() => setCabinsOpen((value) => !value)}
            >
              Cabins
            </button>
            {cabinsOpen ? (
              <div className="absolute left-1/2 top-full z-50 mt-3 w-72 -translate-x-1/2 rounded-sm border border-sand/70 bg-cream p-3 shadow-lg">
                <p className="mb-2 px-2 text-[10px] uppercase tracking-[0.2em] text-ink/50">
                  Units 5–12
                </p>
                <ul className="space-y-1">
                  {cabins.map((cabin) => (
                    <li key={cabin.slug}>
                      <Link
                        href={`/cabins/${cabin.slug}`}
                        className="block rounded px-2 py-1.5 text-sm hover:bg-sand/30"
                      >
                        {cabin.name} · sleeps {cabin.capacity}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/cabins"
                  className="mt-2 block border-t border-sand/50 px-2 pt-2 text-sm text-lake-medium"
                >
                  View all cabins
                </Link>
              </div>
            ) : null}
          </div>

          {NAV.filter((item) => item.href !== "/").map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={ctaUrl}
            className="hidden rounded-full bg-golden px-4 py-2 text-sm font-medium text-ink transition hover:brightness-105 md:inline-flex"
          >
            {ctaText}
          </Link>
          <button
            type="button"
            className="inline-flex rounded-sm border border-sand/70 px-3 py-2 font-serif text-[0.68rem] font-bold uppercase tracking-[0.18em] xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className={cn(
            "site-shell border border-sand/70 bg-cream px-4 py-4 xl:hidden",
            isHome ? "mx-3 mt-2 rounded-sm sm:mx-4 md:mx-8" : "border-t",
          )}
          aria-label="Mobile"
        >
          <ul className="space-y-2">
            <li>
              <Link href="/" className={cn("block py-2", navLinkClass("/"))}>
                Home
              </Link>
            </li>
            <li>
              <Link
                href="/cabins"
                className={cn("block py-2 font-serif font-bold uppercase tracking-[0.22em]", pathname.startsWith("/cabins") && "text-lake-deep")}
              >
                Cabins
              </Link>
            </li>
            {cabins.map((cabin) => (
              <li key={cabin.slug} className="pl-3">
                <Link href={`/cabins/${cabin.slug}`} className="block py-1 text-sm">
                  {cabin.name}
                </Link>
              </li>
            ))}
            {NAV.filter((item) => item.href !== "/").map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={cn("block py-2", navLinkClass(item.href))}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href={ctaUrl}
                className="inline-flex w-full items-center justify-center rounded-sm border border-lake-deep/70 px-4 py-3 font-serif text-[0.68rem] font-bold uppercase tracking-[0.22em] text-lake-deep"
              >
                {ctaText}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
