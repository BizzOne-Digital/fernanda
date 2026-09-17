import connectDB from "@/lib/mongodb";
import FAQ, { type IFAQ } from "@/models/FAQ";
import { createDataFetcher } from "@/lib/data/cache";
import { CACHE_TAGS } from "@/lib/revalidation";
import { FALLBACK_FAQS } from "@/lib/data/fallbacks";
import { toPlain, type PlainModel } from "@/lib/data/utils";

export type FaqData = PlainModel<IFAQ>;

const publishedFaqsFilter = {
  status: "published" as const,
  isArchived: { $ne: true },
};

async function fetchPublishedFaqs(): Promise<FaqData[]> {
  try {
    await connectDB();
    const faqs = await FAQ.find(publishedFaqsFilter)
      .sort({ category: 1, sortOrder: 1 })
      .lean();

    const plain = toPlain(faqs) as FaqData[];
    const valid = plain.filter((faq) => faq.question?.trim() && faq.answer?.trim());
    return valid.length > 0 ? valid : (FALLBACK_FAQS as FaqData[]);
  } catch {
    return FALLBACK_FAQS as FaqData[];
  }
}

export const getFaqs = createDataFetcher("faqs-v4", [CACHE_TAGS.faqs], fetchPublishedFaqs);
export async function getFaqsByCategory(category?: string) {
  const faqs = await getFaqs();
  if (!category) return faqs;
  return faqs.filter((faq) => faq.category === category);
}
