import connectDB from "@/lib/mongodb";
import Attraction, { type IAttraction } from "@/models/Attraction";
import { createDataFetcher } from "@/lib/data/cache";
import { FALLBACK_ATTRACTIONS } from "@/lib/data/fallbacks";
import { toPlain, type PlainModel } from "@/lib/data/utils";

export type AttractionData = PlainModel<IAttraction>;

async function fetchPublishedAttractions(): Promise<AttractionData[]> {
  try {
    await connectDB();
    const attractions = await Attraction.find({
      status: "published",
      isArchived: false,
    })
      .sort({ featured: -1, sortOrder: 1 })
      .lean();

    const plain = toPlain(attractions) as AttractionData[];
    return plain.length > 0 ? plain : (FALLBACK_ATTRACTIONS as AttractionData[]);
  } catch {
    return FALLBACK_ATTRACTIONS as AttractionData[];
  }
}

export const getAttractions = createDataFetcher(
  "attractions-v3",
  ["attractions"],
  fetchPublishedAttractions,
);
