/** Gallery photo tags — safe for client + server (no Mongoose). */
export const GALLERY_PHOTO_CATEGORIES = [
  "friends-family",
  "seasons",
  "wildlife",
  "exploring",
  "fishing",
] as const;

export type GalleryPhotoCategory = (typeof GALLERY_PHOTO_CATEGORIES)[number];

/** Stored on older photos; mapped to current categories when displayed or filtered. */
export const LEGACY_GALLERY_PHOTO_CATEGORIES = [
  "lake",
  "sunset",
  "family",
  "property",
] as const;

export type LegacyGalleryPhotoCategory = (typeof LEGACY_GALLERY_PHOTO_CATEGORIES)[number];

export const GALLERY_PHOTO_CATEGORY_VALUES = [
  ...GALLERY_PHOTO_CATEGORIES,
  ...LEGACY_GALLERY_PHOTO_CATEGORIES,
] as const;

export type GalleryPhotoCategoryValue = (typeof GALLERY_PHOTO_CATEGORY_VALUES)[number];

export type GalleryPhotoStatus = "draft" | "published";

const LEGACY_TO_CURRENT: Record<LegacyGalleryPhotoCategory, GalleryPhotoCategory> = {
  lake: "exploring",
  sunset: "seasons",
  family: "friends-family",
  property: "exploring",
};

const FILTER_TO_STORED: Record<GalleryPhotoCategory, GalleryPhotoCategoryValue[]> = {
  "friends-family": ["friends-family", "family"],
  seasons: ["seasons", "sunset"],
  wildlife: ["wildlife"],
  exploring: ["exploring", "lake", "property"],
  fishing: ["fishing"],
};

export function normalizeGalleryPhotoCategory(
  value: string | undefined | null,
): GalleryPhotoCategory {
  if (!value) return "exploring";
  if ((GALLERY_PHOTO_CATEGORIES as readonly string[]).includes(value)) {
    return value as GalleryPhotoCategory;
  }
  if ((LEGACY_GALLERY_PHOTO_CATEGORIES as readonly string[]).includes(value)) {
    return LEGACY_TO_CURRENT[value as LegacyGalleryPhotoCategory];
  }
  return "exploring";
}

export function galleryCategoryFilterValues(slug: GalleryPhotoCategory): GalleryPhotoCategoryValue[] {
  return FILTER_TO_STORED[slug];
}

const SLUG_TO_PHOTO_CATEGORY: Record<string, GalleryPhotoCategory> = {
  "lake-waterfront": "exploring",
  "sunsets-starry-nights": "seasons",
  "family-lake-days": "friends-family",
  "paddleboards-lake-play": "exploring",
  "nature-wildlife": "wildlife",
  "property-outdoor-spaces": "exploring",
  "cabins-5-12": "exploring",
  "kitchens-washrooms": "exploring",
  "historic-sundial-motel": "exploring",
  "friends-and-family": "friends-family",
  seasons: "seasons",
  wildlife: "wildlife",
  exploring: "exploring",
  "fishing-fun": "fishing",
};

export function photoCategoryForGallerySlug(slug: string): GalleryPhotoCategory {
  return SLUG_TO_PHOTO_CATEGORY[slug] ?? "exploring";
}

export const LEGACY_PROPERTY_CATEGORY_SLUG = "property-outdoor-spaces";

export const UNIQUE_LEGACY_PHOTO_CATEGORIES = new Set<GalleryPhotoCategory>([
  "friends-family",
  "seasons",
  "wildlife",
  "exploring",
  "fishing",
]);

export function isGalleryPhotoCategory(value: string): value is GalleryPhotoCategory {
  return (GALLERY_PHOTO_CATEGORIES as readonly string[]).includes(value);
}

export function isGalleryPhotoCategoryValue(value: string): value is GalleryPhotoCategoryValue {
  return (GALLERY_PHOTO_CATEGORY_VALUES as readonly string[]).includes(value);
}
