import { revalidatePath, revalidateTag } from "next/cache";

export const CACHE_TAGS = {
  settings: "settings",
  cabins: "cabins",
  services: "services",
  gallery: "gallery",
  guestMemories: "guest-memories",
  faqs: "faqs",
  testimonials: "testimonials",
  attractions: "attractions",
  pages: "pages",
  seasons: "seasons",
  availability: "availability",
} as const;

export function revalidatePublicHome() {
  revalidatePath("/");
  revalidateTag(CACHE_TAGS.settings);
  revalidateTag(CACHE_TAGS.cabins);
  revalidateTag(CACHE_TAGS.services);
  revalidateTag(CACHE_TAGS.testimonials);
  revalidateTag(CACHE_TAGS.faqs);
}

export function revalidateCabins(slug?: string) {
  revalidatePath("/cabins", "layout");
  revalidateTag(CACHE_TAGS.cabins);
  if (slug) {
    revalidatePath(`/cabins/${slug}`);
  }
  revalidatePublicHome();
}

export function revalidateServices(slug?: string) {
  revalidatePath("/services", "layout");
  revalidateTag(CACHE_TAGS.services);
  if (slug) {
    revalidatePath(`/services/${slug}`);
  }
  revalidatePath("/inquire");
  revalidatePublicHome();
}

export function revalidateGallery() {
  revalidatePath("/gallery");
  revalidatePath("/gallery/share-a-memory");
  revalidateTag(CACHE_TAGS.gallery);
  revalidateTag(CACHE_TAGS.guestMemories);
}

export function revalidateGuestMemories() {
  revalidatePath("/gallery");
  revalidatePath("/gallery/share-a-memory");
  revalidateTag(CACHE_TAGS.guestMemories);
}

export function revalidateFaqs() {
  revalidatePath("/faqs");
  revalidatePath("/rates-and-seasons");
  revalidatePath("/services");
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

export function revalidatePages(slugs: string[] = []) {
  revalidateTag(CACHE_TAGS.pages);
  for (const slug of slugs) {
    const path = slug.startsWith("/") ? slug : `/${slug}`;
    revalidatePath(path);
  }
}

export function revalidateSeasons() {
  revalidatePath("/rates-and-seasons");
  revalidatePath("/cabins", "layout");
  revalidatePath("/inquire");
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
