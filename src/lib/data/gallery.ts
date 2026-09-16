import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import GalleryCategory, { type IGalleryCategory } from "@/models/GalleryCategory";
import GalleryPhoto from "@/models/GalleryPhoto";
import { HERO_IMAGE, PROPERTY_GALLERY } from "@/lib/demo-images";
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

function staticGalleryFallback(): GalleryImageData[] {
  const hero: GalleryImageData = {
    _id: "static-hero",
    src: HERO_IMAGE,
    alt: "Waterfront cabins on Vaseaux Lake at golden hour",
    categorySlug: "property",
    featured: true,
  };

  const property = PROPERTY_GALLERY.map((item, index) => ({
    _id: `static-${index}`,
    src: item.path,
    alt: item.alt,
    categorySlug: item.category,
    featured: index < 4,
  }));

  return [hero, ...property];
}

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
    if (categorySlug) query.category = categorySlug;

    const photos = await GalleryPhoto.find(query)
      .sort({ featured: -1, sortOrder: 1, createdAt: -1 })
      .lean();

    if (photos.length === 0) {
      const fallback = staticGalleryFallback();
      if (!categorySlug) return fallback;
      return fallback.filter((item) => item.categorySlug === categorySlug);
    }

    const plain = toPlain(photos) as Array<{
      _id: string;
      url: string;
      alt: string;
      caption?: string;
      category: string;
      featured?: boolean;
    }>;

    return plain.map((photo) => ({
      _id: String(photo._id),
      src: photo.url,
      alt: photo.alt,
      caption: photo.caption,
      categorySlug: photo.category,
      featured: photo.featured ?? false,
    }));
  } catch {
    const fallback = staticGalleryFallback();
    if (!categorySlug) return fallback;
    return fallback.filter((item) => item.categorySlug === categorySlug);
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
