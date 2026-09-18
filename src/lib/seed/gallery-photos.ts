import { HERO_IMAGE, PROPERTY_GALLERY } from "@/lib/demo-images";
import type { GalleryPhotoCategory } from "@/lib/gallery/photo-constants";

function asCategory(value: string): GalleryPhotoCategory {
  if (value === "lake" || value === "sunset" || value === "family" || value === "wildlife") {
    return value;
  }
  return "property";
}

export const galleryPhotoSeeds = [
  {
    url: HERO_IMAGE,
    alt: "Waterfront cabins on Vaseaux Lake at golden hour",
    category: "property" as const,
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
