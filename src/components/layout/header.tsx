"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { CabinData } from "@/lib/data/cabins";
import type { SiteSettingsData } from "@/lib/data/settings";
import { SiteLogo } from "@/components/layout/site-logo";
import { cn } from "@/lib/utils/cn";
import { GUEST_INFO_NAV, PRIMARY_NAV } from "@/lib/site-nav";

const MAIN_NAV = PRIMARY_NAV.filter((item) => item.href !== "/");

type HeaderProps = {
  settings: SiteSettingsData;
  cabins: CabinData[];
};

export function Header({ settings, cabins }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [cabinsOpen, setCabinsOpen] = useState(false);
  const [guestOpen, setGuestOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setOpen(false);
    setCabinsOpen(false);
    setGuestOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setCabinsOpen(false);
        setGuestOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const ctaText = settings.footer.ctaText || "Request a Reservation";
  const ctaUrl = settings.footer.ctaUrl || "/inquire";
  const phone = settings.contact.phoneDisplay;
  const phoneLink = settings.contact.phoneLink;

  const navLinkClass = (href: string) =>
    cn(
      "text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-resort-navy/80 transition hover:text-lake-medium",
      (pathname === href || (href !== "/" && pathname.startsWith(href))) && "text-lake-medium",
    );

  return (
    <header className="site-shell sticky top-0 z-50 w-full shadow-sm">
      <div className="bg-resort-navy text-cream">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs md:px-6">
          <p className="font-serif tracking-[0.14em] text-cream/90">
            An Okanagan lakeside classic · Oliver, B.C.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            {phone ? (
              <a href={phoneLink} className="font-semibold tracking-wide hover:text-golden">
                {phone}
              </a>
            ) : null}
            <Link href={ctaUrl} className="font-semibold uppercase tracking-[0.14em] hover:text-golden">
              {ctaText}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-b border-sand/80 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <SiteLogo className="min-w-0 shrink" />

          <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Main">
            <Link href="/" className={navLinkClass("/")}>Home</Link>

            <div
              ref={menuRef}
              className="relative"
              onMouseEnter={() => setCabinsOpen(true)}
              onMouseLeave={() => setCabinsOpen(false)}
            >
              <Link href="/cabins" className={navLinkClass("/cabins")}>Accommodation</Link>
              {cabinsOpen ? (
                <div className="absolute left-0 top-full z-50 mt-0 w-72 border border-sand bg-white p-3 shadow-lg">
                  <p className="mb-2 px-2 text-[10px] uppercase tracking-[0.2em] text-ink/50">Cabins 5–12</p>
                  <ul className="max-h-64 space-y-1 overflow-y-auto">
                    {cabins.map((cabin) => (
                      <li key={cabin.slug}>
                        <Link href={`/cabins/${cabin.slug}`} className="block px-2 py-1.5 text-sm hover:bg-sand/40">
                          {cabin.name} · sleeps {cabin.capacity}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            {MAIN_NAV.filter((item) => item.href !== "/cabins").map((item) => (
              <Link key={item.href} href={item.href} className={navLinkClass(item.href)}>
                {item.label}
              </Link>
            ))}

            <div
              className="relative"
              onMouseEnter={() => setGuestOpen(true)}
              onMouseLeave={() => setGuestOpen(false)}
            >
              <button
                type="button"
                className={cn(navLinkClass("/faqs"), "inline-flex items-center gap-1")}
                aria-expanded={guestOpen}
              >
                Guest Information
              </button>
              {guestOpen ? (
                <div className="absolute right-0 top-full z-50 mt-0 w-56 border border-sand bg-white p-2 shadow-lg">
                  {GUEST_INFO_NAV.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-3 py-2 text-sm text-ink/80 hover:bg-sand/40"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </nav>

          <div className="flex items-center gap-2">
            <Link href={ctaUrl} className="resort-btn-primary hidden sm:inline-flex">
              {ctaText}
            </Link>
            <button
              type="button"
              className="resort-btn-outline px-3 py-2 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() => setOpen((value) => !value)}
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" className="border-t border-sand bg-white px-4 py-4 lg:hidden" aria-label="Mobile">
          <ul className="space-y-1">
            <li><Link href="/" className={cn("block py-2", navLinkClass("/"))}>Home</Link></li>
            <li><Link href="/cabins" className={cn("block py-2", navLinkClass("/cabins"))}>Accommodation</Link></li>
            {cabins.map((cabin) => (
              <li key={cabin.slug} className="pl-3">
                <Link href={`/cabins/${cabin.slug}`} className="block py-1 text-sm text-ink/75">{cabin.name}</Link>
              </li>
            ))}
            {MAIN_NAV.filter((item) => item.href !== "/cabins").map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={cn("block py-2", navLinkClass(item.href))}>{item.label}</Link>
              </li>
            ))}
            <li className="pt-2 border-t border-sand/80">
              <p className="py-2 text-[10px] uppercase tracking-[0.2em] text-ink/50">Guest Information</p>
              {GUEST_INFO_NAV.map((item) => (
                <Link key={item.href} href={item.href} className="block py-1.5 text-sm text-ink/75">{item.label}</Link>
              ))}
            </li>
            <li className="pt-3">
              <Link href={ctaUrl} className="resort-btn-primary w-full">{ctaText}</Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
