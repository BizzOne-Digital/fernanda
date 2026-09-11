export type SiteNavItem = {
  href: string;
  label: string;
};

export const PRIMARY_NAV: SiteNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/cabins", label: "Cabins" },
  { href: "/about", label: "About" },
  { href: "/gallery", label: "Gallery" },
  { href: "/things-to-do", label: "Things to Do" },
  { href: "/contact", label: "Contact" },
];

/** Footer-only links — not used in the site header. */
export const FOOTER_SECONDARY_NAV: SiteNavItem[] = [
  { href: "/services", label: "Experiences" },
  { href: "/rates-and-seasons", label: "Rates & Seasons" },
  { href: "/inquire", label: "Check Availability" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/faqs", label: "FAQs" },
  { href: "/blog", label: "Journal" },
];

export const SECONDARY_NAV = FOOTER_SECONDARY_NAV;

export const LEGAL_NAV: SiteNavItem[] = [
  { href: "/policies", label: "Policies" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];
