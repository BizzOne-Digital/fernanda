import "server-only";

import type { Types } from "mongoose";
import GalleryPhoto from "@/models/GalleryPhoto";
import {
  LEGACY_PROPERTY_CATEGORY_SLUG,
  photoCategoryForGallerySlug,
  UNIQUE_LEGACY_PHOTO_CATEGORIES,
} from "@/lib/gallery/photo-constants";

export function buildGalleryPhotosQueryForCategory(category: {
  _id: Types.ObjectId | string;
  slug: string;
}) {
  const categoryId = String(category._id);
  const photoCategory = photoCategoryForGallerySlug(category.slug);
  const or: Record<string, unknown>[] = [{ galleryCategoryId: categoryId }];

  if (UNIQUE_LEGACY_PHOTO_CATEGORIES.has(photoCategory)) {
    or.push({
      category: photoCategory,
      $or: [{ galleryCategoryId: null }, { galleryCategoryId: { $exists: false } }],
    });
  } else if (category.slug === LEGACY_PROPERTY_CATEGORY_SLUG) {
    or.push({
      category: "property",
      $or: [{ galleryCategoryId: null }, { galleryCategoryId: { $exists: false } }],
    });
  }

  return {
    isArchived: false,
    $or: or,
  };
}

export async function listGalleryPhotosForAdminCategory(category: {
  _id: Types.ObjectId | string;
  slug: string;
}) {
  const query = buildGalleryPhotosQueryForCategory(category);
  return GalleryPhoto.find(query)
    .sort({ sortOrder: 1, createdAt: -1 })
    .lean();
}
