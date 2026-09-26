import { HERO_IMAGE, PROPERTY_GALLERY } from "@/lib/demo-images";
import { normalizeGalleryPhotoCategory } from "@/lib/gallery/photo-constants";
import type { GalleryPhotoCategoryValue } from "@/lib/gallery/photo-constants";

function asCategory(value: string): GalleryPhotoCategoryValue {
  const normalized = normalizeGalleryPhotoCategory(value);
  if (normalized === "exploring" && value === "lake") return "lake";
  if (normalized === "seasons" && value === "sunset") return "sunset";
  if (normalized === "friends-family" && value === "family") return "family";
  if (value === "wildlife") return "wildlife";
  if (normalized === "exploring" && value === "property") return "property";
  return normalized;
}

export const galleryPhotoSeeds = [
  {
    url: HERO_IMAGE,
    alt: "Waterfront cabins on Vaseaux Lake at golden hour",
    category: "exploring" as const,
    sortOrder: -1,
    featured: true,
    status: "published" as const,
    isArchived: false,
  },
  ...PROPERTY_GALLERY.map((item, index) => ({
    url: item.path,
    alt: item.alt,
    category: asCategory(item.category),
    sortOrder: index,
    featured: index < 4,
    status: "published" as const,
    isArchived: false,
  })),
];
