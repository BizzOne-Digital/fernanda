import connectDB from "@/lib/mongodb";
import Testimonial, { type ITestimonial } from "@/models/Testimonial";
import { createDataFetcher } from "@/lib/data/cache";
import { CACHE_TAGS } from "@/lib/revalidation";
import { FALLBACK_TESTIMONIALS } from "@/lib/data/fallbacks";
import { toPlain, type PlainModel } from "@/lib/data/utils";

export type TestimonialData = PlainModel<ITestimonial>;

async function fetchPublicTestimonials(): Promise<TestimonialData[]> {
  try {
    await connectDB();
    const testimonials = await Testimonial.find({
      isArchived: false,
      status: "published",
    })
      .sort({ featured: -1, sortOrder: 1 })
      .lean();

    const plain = toPlain(testimonials) as TestimonialData[];
    return plain.length > 0 ? plain : (FALLBACK_TESTIMONIALS as TestimonialData[]);
  } catch {
    return FALLBACK_TESTIMONIALS as TestimonialData[];
  }
}

export const getTestimonials = createDataFetcher(
  "testimonials-v5",
  [CACHE_TAGS.testimonials],
  fetchPublicTestimonials,
);
