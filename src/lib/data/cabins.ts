import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Cabin, { type ICabin } from "@/models/Cabin";
import { toPlain, type PlainModel } from "@/lib/data/utils";

export type CabinData = PlainModel<ICabin>;

async function fetchPublishedCabins(): Promise<CabinData[]> {
  try {
    await connectDB();
    const cabins = await Cabin.find({
      status: "published",
      isArchived: false,
    })
      .sort({ sortOrder: 1, cabinNumber: 1 })
      .lean();
    return toPlain(cabins) as CabinData[];
  } catch {
    return [];
  }
}

async function fetchCabinBySlug(slug: string): Promise<CabinData | null> {
  try {
    await connectDB();
    const cabin = await Cabin.findOne({
      slug,
      status: "published",
      isArchived: false,
    }).lean();
    return cabin ? (toPlain(cabin) as CabinData) : null;
  } catch {
    return null;
  }
}

export const getCabins = unstable_cache(fetchPublishedCabins, ["cabins"], {
  tags: ["cabins"],
  revalidate: 300,
});

export async function getCabinBySlug(slug: string) {
  return unstable_cache(
    () => fetchCabinBySlug(slug),
    [`cabin-${slug}`],
    { tags: ["cabins", `cabin-${slug}`], revalidate: 300 },
  )();
}

export async function getCabinSlugs(): Promise<string[]> {
  const cabins = await getCabins();
  return cabins.map((cabin) => cabin.slug);
}
