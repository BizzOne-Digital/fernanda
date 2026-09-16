export const GALLERY_FILTER_CATEGORIES = [
  { slug: "", label: "All photos" },
  { slug: "lake", label: "Lake & waterfront" },
  { slug: "sunset", label: "Sunsets" },
  { slug: "family", label: "Family" },
  { slug: "wildlife", label: "Wildlife" },
  { slug: "property", label: "Property" },
] as const;

export function galleryCategoryLabel(slug: string) {
  return GALLERY_FILTER_CATEGORIES.find((item) => item.slug === slug)?.label ?? slug;
}
