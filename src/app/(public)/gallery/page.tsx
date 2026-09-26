import type { Metadata } from "next";
import { Suspense } from "react";
import { GalleryClient } from "./gallery-client";
import { PageHero } from "@/components/layout/page-hero";
import { getGalleryImages } from "@/lib/data/gallery";
import { getApprovedGuestMemories } from "@/lib/data/guest-memories";
import { GuestMemoriesSection } from "@/components/gallery/guest-memories-section";
import { HERO_IMAGE } from "@/lib/demo-images";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos of Vaseaux Lake, waterfront cabins, sunsets, wildlife, and family lake days near Oliver, BC.",
};

export default async function GalleryPage() {
  const [images, memories] = await Promise.all([getGalleryImages(), getApprovedGuestMemories()]);

  return (
    <Suspense>
      <PageHero
        title="Gallery"
        subtitle="Lake days, sunsets, wildlife, and life at Vaseaux Lake Waterfront Cabins."
        eyebrow="Photo gallery"
        imageSrc={HERO_IMAGE}
        imageAlt="Waterfront cabins on Vaseaux Lake"
      />
      <GalleryClient images={images} />
      <GuestMemoriesSection memories={memories} />
    </Suspense>
  );
}
