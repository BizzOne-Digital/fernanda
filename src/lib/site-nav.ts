export type SiteNavItem = {
  href: string;
  label: string;
};

/** Main header navigation — classic resort style. */
export const PRIMARY_NAV: SiteNavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/cabins", label: "Accommodation" },
  { href: "/things-to-do", label: "Activities" },
  { href: "/gallery", label: "Gallery" },
  { href: "/policies", label: "Policies" },
  { href: "/contact", label: "Contact" },
];

export const GUEST_INFO_NAV: SiteNavItem[] = [
  { href: "/faqs", label: "FAQs" },
  { href: "/rates-and-seasons", label: "Rates & Seasons" },
  { href: "/services", label: "Stay Types" },
  { href: "/inquire", label: "Check Availability" },
  { href: "/testimonials", label: "Guest Reviews" },
  { href: "/blog", label: "Journal" },
];

/** Footer “Plan your stay” column. */
export const FOOTER_SECONDARY_NAV: SiteNavItem[] = GUEST_INFO_NAV;

export const SECONDARY_NAV = FOOTER_SECONDARY_NAV;

export const LEGAL_NAV: SiteNavItem[] = [
  { href: "/policies", label: "Policies" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
];
