import type { GalleryPhotoCategory } from "@/lib/gallery/photo-constants";

export const GALLERY_FILTER_CATEGORIES: ReadonlyArray<{
  slug: GalleryPhotoCategory | "";
  label: string;
}> = [
  { slug: "", label: "All photos" },
  { slug: "friends-family", label: "Friends & family" },
  { slug: "seasons", label: "Seasons" },
  { slug: "wildlife", label: "Wildlife" },
  { slug: "exploring", label: "Exploring" },
  { slug: "fishing", label: "Fishing fun" },
];

export function galleryCategoryLabel(slug: string) {
  const normalized = GALLERY_FILTER_CATEGORIES.find((item) => item.slug === slug);
  if (normalized) return normalized.label;
  const legacyLabels: Record<string, string> = {
    lake: "Exploring",
    sunset: "Seasons",
    family: "Friends & family",
    property: "Exploring",
  };
  return legacyLabels[slug] ?? slug;
}
