/** Page section types — safe for client + server (no Mongoose). */
export const PAGE_SECTION_TYPES = [
  "hero",
  "rich-text",
  "image-text",
  "cta",
  "stats",
  "timeline",
  "faq-preview",
  "cabin-rail",
  "testimonials",
  "gallery",
  "seasons",
  "inquiry-bar",
  "custom",
] as const;

export type PageSectionType = (typeof PAGE_SECTION_TYPES)[number];
