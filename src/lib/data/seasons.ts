import connectDB from "@/lib/mongodb";
import Season, { type ISeason } from "@/models/Season";
import { createDataFetcher } from "@/lib/data/cache";
import { CACHE_TAGS } from "@/lib/revalidation";
import { toPlain, type PlainModel } from "@/lib/data/utils";

export type SeasonData = PlainModel<ISeason>;

async function fetchPublishedSeasons(): Promise<SeasonData[]> {
  try {
    await connectDB();
    const seasons = await Season.find({
      isPublished: true,
      isArchived: false,
    })
      .sort({ sortOrder: 1, startDate: 1 })
      .lean();
    return toPlain(seasons) as SeasonData[];
  } catch {
    return [];
  }
}

export const getSeasons = createDataFetcher(
  "seasons-v2",
  [CACHE_TAGS.seasons],
  fetchPublishedSeasons,
);
