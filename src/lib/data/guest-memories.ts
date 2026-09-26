import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import GuestMemory, { type IGuestMemory } from "@/models/GuestMemory";
import { CACHE_TAGS } from "@/lib/revalidation";
import { toPlain, type PlainModel } from "@/lib/data/utils";
import { normalizePublicImageUrl } from "@/lib/uploads/public-url";

export type GuestMemoryData = PlainModel<IGuestMemory>;

async function fetchApprovedGuestMemories(): Promise<GuestMemoryData[]> {
  try {
    await connectDB();
    const items = await GuestMemory.find({ status: "approved" })
      .sort({ approvedAt: -1, createdAt: -1 })
      .limit(48)
      .lean();
    const plain = toPlain(items) as GuestMemoryData[];
    return plain.map((item) => ({
      ...item,
      photoUrl: item.photoUrl ? normalizePublicImageUrl(item.photoUrl) : undefined,
    }));
  } catch {
    return [];
  }
}

export async function getApprovedGuestMemories() {
  if (process.env.NODE_ENV === "development") {
    return fetchApprovedGuestMemories();
  }
  return unstable_cache(fetchApprovedGuestMemories, ["guest-memories-approved-v1"], {
    tags: [CACHE_TAGS.guestMemories],
    revalidate: 300,
  })();
}
