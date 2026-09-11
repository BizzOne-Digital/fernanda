import Link from "next/link";
import type { SiteSettingsData } from "@/lib/data/settings";
import { SiteLogo } from "@/components/layout/site-logo";
import { FOOTER_SECONDARY_NAV, LEGAL_NAV, PRIMARY_NAV } from "@/lib/site-nav";

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
      <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-golden">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-serif text-sm tracking-[0.04em] text-cream/82 transition hover:text-golden"
            >
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

  return (
    <footer className="site-shell mt-20 w-full border-t border-sky-bright/30 bg-gradient-to-br from-lake-medium to-lake-deep text-cream">
      <div className="h-1.5 bg-gradient-to-r from-summer-yellow/60 via-golden to-summer-yellow/60" />

      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.9fr_0.9fr_1fr]">
          <div className="max-w-sm">
            <SiteLogo tone="light" />
            <p className="mt-5 text-sm leading-relaxed text-cream/78">
              {footer.shortDescription ||
                "Eight private cabin-style accommodations under one historic roof on the shores of Vaseaux Lake."}
            </p>
            <Link
              href={footer.ctaUrl || "/inquire"}
              className="mt-6 inline-flex rounded-sm bg-golden px-5 py-2.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-ink transition hover:brightness-105"
            >
              {footer.ctaText || "Check availability"}
            </Link>
          </div>

          <FooterNavColumn title="Navigate" links={PRIMARY_NAV} />

          <FooterNavColumn title="Plan your stay" links={FOOTER_SECONDARY_NAV} />

          <div>
            <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-golden">Contact</p>
            <ul className="mt-4 space-y-3 text-sm text-cream/82">
              <li>
                <a href={`mailto:${contact.email}`} className="break-all transition hover:text-golden">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.phoneLink} className="transition hover:text-golden">
                  {contact.phoneDisplay}
                </a>
              </li>
              {contact.facebookUrl ? (
                <li>
                  <a
                    href={contact.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition hover:text-golden"
                  >
                    Facebook
                  </a>
                </li>
              ) : null}
              {contact.address ? <li className="text-cream/70">{contact.address}</li> : null}
              {contact.businessHours ? (
                <li className="text-cream/70">{contact.businessHours}</li>
              ) : null}
            </ul>

            <p className="mt-8 text-[0.68rem] font-medium uppercase tracking-[0.28em] text-golden">
              Legal
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/75 transition hover:text-golden"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center text-xs text-cream/65 md:flex-row md:px-6 md:text-left">
          <p>
            {footer.copyrightText ||
              `© ${new Date().getFullYear()} Vaseaux Lake Waterfront Cabins. All rights reserved.`}
          </p>
          <p className="max-w-full break-words font-serif tracking-[0.12em] text-cream/50">
            Vaseaux Lake • Oliver, BC • Wine Country
          </p>
        </div>
      </div>
    </footer>
  );
}
