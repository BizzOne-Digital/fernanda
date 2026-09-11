import { revalidatePath, revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  settings: "settings",
  cabins: "cabins",
  services: "services",
  gallery: "gallery",
  faqs: "faqs",
  testimonials: "testimonials",
  attractions: "attractions",
  blog: "blog",
  pages: "pages",
  seasons: "seasons",
  availability: "availability",
} as const;

export function revalidatePublicHome() {
  revalidatePath("/");
  revalidateTag(CACHE_TAGS.settings);
  revalidateTag(CACHE_TAGS.cabins);
  revalidateTag(CACHE_TAGS.services);
}

export function revalidateCabins(slug?: string) {
  revalidatePath("/cabins");
  revalidateTag(CACHE_TAGS.cabins);
  if (slug) {
    revalidatePath(`/cabins/${slug}`);
  }
  revalidatePublicHome();
}

export function revalidateServices(slug?: string) {
  revalidatePath("/services");
  revalidateTag(CACHE_TAGS.services);
  if (slug) {
    revalidatePath(`/services/${slug}`);
  }
  revalidatePublicHome();
}

export function revalidateGallery() {
  revalidatePath("/gallery");
  revalidateTag(CACHE_TAGS.gallery);
}

export function revalidateFaqs() {
  revalidatePath("/faqs");
  revalidateTag(CACHE_TAGS.faqs);
  revalidatePublicHome();
}

export function revalidateTestimonials() {
  revalidatePath("/testimonials");
  revalidateTag(CACHE_TAGS.testimonials);
  revalidatePublicHome();
}

export function revalidateAttractions() {
  revalidatePath("/things-to-do");
  revalidateTag(CACHE_TAGS.attractions);
}

export function revalidateBlog(slug?: string) {
  revalidatePath("/blog");
  revalidateTag(CACHE_TAGS.blog);
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

export function revalidatePages(slugs: string[] = []) {
  revalidateTag(CACHE_TAGS.pages);
  for (const slug of slugs) {
    const path = slug.startsWith("/") ? slug : `/${slug}`;
    revalidatePath(path);
  }
}

export function revalidateSeasons() {
  revalidatePath("/rates-and-seasons");
  revalidateTag(CACHE_TAGS.seasons);
}

export function revalidateAvailability() {
  revalidatePath("/inquire");
  revalidateTag(CACHE_TAGS.availability);
}

export function revalidateSettings() {
  revalidateTag(CACHE_TAGS.settings);
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/inquire");
  revalidatePages([
    "/about",
    "/cabins",
    "/services",
    "/rates-and-seasons",
    "/gallery",
    "/testimonials",
    "/faqs",
    "/things-to-do",
    "/policies",
    "/privacy",
    "/terms",
  ]);
}

export function revalidateContactSurfaces() {
  revalidatePath("/contact");
  revalidatePath("/inquire");
  revalidateTag(CACHE_TAGS.settings);
}
