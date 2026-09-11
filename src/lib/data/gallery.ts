import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import GalleryCategory, { type IGalleryCategory } from "@/models/GalleryCategory";
import MediaAsset from "@/models/MediaAsset";
import { demoGallery } from "@/lib/demo-images";
import { toPlain, type PlainModel } from "@/lib/data/utils";

export type GalleryCategoryData = PlainModel<IGalleryCategory>;

export type GalleryImageData = {
  _id: string;
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
  categorySlug?: string;
  featured: boolean;
};

async function fetchGalleryCategories(): Promise<GalleryCategoryData[]> {
  try {
    await connectDB();
    const categories = await GalleryCategory.find({
      status: "published",
      isArchived: false,
    })
      .sort({ sortOrder: 1 })
      .lean();
    return toPlain(categories) as GalleryCategoryData[];
  } catch {
    return [];
  }
}

async function fetchGalleryImages(categorySlug?: string): Promise<GalleryImageData[]> {
  try {
    await connectDB();
    const query: Record<string, unknown> = {
      status: "published",
      isArchived: false,
    };
    if (categorySlug) query.categorySlug = categorySlug;

    const assets = await MediaAsset.find(query)
      .sort({ featured: -1, sortOrder: 1, createdAt: -1 })
      .limit(120)
      .lean();

    if (assets.length === 0) {
      return demoGallery(31).map((item, index) => ({
        _id: `demo-${index}`,
        src: item.src,
        alt: item.alt,
        categorySlug: categorySlug ?? "lake-waterfront",
        featured: index < 3,
      }));
    }

    const plainAssets = toPlain(assets) as Array<{
      _id: string;
      publicUrl: string;
      alt?: string;
      caption?: string;
      credit?: string;
      categorySlug?: string;
      featured?: boolean;
    }>;

    return plainAssets.map((asset) => ({
      _id: String(asset._id),
      src: asset.publicUrl,
      alt: asset.alt || "Gallery image",
      caption: asset.caption,
      credit: asset.credit,
      categorySlug: asset.categorySlug,
      featured: asset.featured ?? false,
    }));
  } catch {
    return demoGallery(12).map((item, index) => ({
      _id: `demo-${index}`,
      src: item.src,
      alt: item.alt,
      featured: index < 3,
    }));
  }
}

export const getGalleryCategories = unstable_cache(
  fetchGalleryCategories,
  ["gallery-categories"],
  { tags: ["gallery"], revalidate: 300 },
);

export async function getGalleryImages(categorySlug?: string) {
  return unstable_cache(
    () => fetchGalleryImages(categorySlug),
    [`gallery-images-${categorySlug ?? "all"}`],
    { tags: ["gallery"], revalidate: 300 },
  )();
}
