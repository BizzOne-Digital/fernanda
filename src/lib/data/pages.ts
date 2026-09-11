import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import Page, { type IPage } from "@/models/Page";
import { toPlain, type PlainModel } from "@/lib/data/utils";

export type PageData = PlainModel<IPage>;

async function fetchPageBySlug(slug: string): Promise<PageData | null> {
  try {
    await connectDB();
    const page = await Page.findOne({
      slug,
      status: "published",
      isArchived: false,
    }).lean();
    return page ? (toPlain(page) as PageData) : null;
  } catch {
    return null;
  }
}

export async function getPageBySlug(slug: string) {
  return unstable_cache(
    () => fetchPageBySlug(slug),
    [`page-${slug}`],
    { tags: ["pages", `page-${slug}`], revalidate: 300 },
  )();
}
