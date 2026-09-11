import type { Metadata } from "next";
import { TestimonialsClient } from "./testimonials-client";
import { getTestimonials } from "@/lib/data/testimonials";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Guest memories from Vaseaux Lake Waterfront Cabins.",
};

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  return <TestimonialsClient testimonials={testimonials} />;
}
