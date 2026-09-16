import Link from "next/link";
import type { SiteSettingsData } from "@/lib/data/settings";
import { SiteLogo } from "@/components/layout/site-logo";
import { GUEST_INFO_NAV, LEGAL_NAV, PRIMARY_NAV } from "@/lib/site-nav";

type FooterProps = {
  settings: SiteSettingsData;
};

function FooterNavColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-golden">{title}</p>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-cream/85 transition hover:text-golden">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer({ settings }: FooterProps) {
  const { contact, footer } = settings;
  const legalLinks =
    footer.legalLinks?.length > 0
      ? footer.legalLinks.map((link) => ({ href: link.url, label: link.label }))
      : LEGAL_NAV;

  const accommodationLinks = [
    { href: "/cabins", label: "All cabins" },
    { href: "/rates-and-seasons", label: "Rates & seasons" },
    { href: "/inquire", label: "Check availability" },
  ];

  return (
    <footer className="site-shell mt-16 w-full bg-resort-navy text-cream">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <SiteLogo tone="light" />
            <p className="mt-4 text-sm leading-relaxed text-cream/80">
              {footer.shortDescription ||
                "Eight private cabin-style accommodations under one historic roof on Vaseaux Lake, near Oliver in the South Okanagan."}
            </p>
            <Link href={footer.ctaUrl || "/inquire"} className="resort-btn-primary mt-6">
              {footer.ctaText || "Contact us"}
            </Link>
          </div>

          <FooterNavColumn title="Accommodation" links={accommodationLinks} />
          <FooterNavColumn title="Explore" links={PRIMARY_NAV.filter((l) => l.href !== "/")} />
          <FooterNavColumn title="Guest information" links={GUEST_INFO_NAV.slice(0, 5)} />
        </div>

        <div className="mt-12 grid gap-6 border-t border-cream/15 pt-8 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-golden">Contact</p>
            <ul className="mt-3 space-y-2 text-sm text-cream/85">
              <li>
                <a href={`mailto:${contact.email}`} className="hover:text-golden">{contact.email}</a>
              </li>
              <li>
                <a href={contact.phoneLink} className="hover:text-golden">{contact.phoneDisplay}</a>
              </li>
              {contact.address ? <li>{contact.address}</li> : null}
            </ul>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-golden">Policies</p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-cream/80 hover:text-golden">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 bg-[#122a36]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center text-xs text-cream/60 md:flex-row md:px-6 md:text-left">
          <p>
            {footer.copyrightText ||
              `© ${new Date().getFullYear()} Vaseaux Lake Waterfront Cabins. All rights reserved.`}
          </p>
          <p>Vaseaux Lake · Oliver, BC</p>
        </div>
      </div>
    </footer>
  );
}
