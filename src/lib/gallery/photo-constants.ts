/** Gallery photo tags — safe for client + server (no Mongoose). */
export const GALLERY_PHOTO_CATEGORIES = ["lake", "sunset", "family", "wildlife", "property"] as const;

export type GalleryPhotoCategory = (typeof GALLERY_PHOTO_CATEGORIES)[number];

export type GalleryPhotoStatus = "draft" | "published";

const SLUG_TO_PHOTO_CATEGORY: Record<string, GalleryPhotoCategory> = {
  "lake-waterfront": "lake",
  "sunsets-starry-nights": "sunset",
  "family-lake-days": "family",
  "paddleboards-lake-play": "lake",
  "nature-wildlife": "wildlife",
  "property-outdoor-spaces": "property",
  "cabins-5-12": "property",
  "kitchens-washrooms": "property",
  "historic-sundial-motel": "property",
};

export function photoCategoryForGallerySlug(slug: string): GalleryPhotoCategory {
  return SLUG_TO_PHOTO_CATEGORY[slug] ?? "property";
}

export const LEGACY_PROPERTY_CATEGORY_SLUG = "property-outdoor-spaces";

export const UNIQUE_LEGACY_PHOTO_CATEGORIES = new Set<GalleryPhotoCategory>([
  "lake",
  "sunset",
  "family",
  "wildlife",
]);

export function isGalleryPhotoCategory(value: string): value is GalleryPhotoCategory {
  return (GALLERY_PHOTO_CATEGORIES as readonly string[]).includes(value);
}
