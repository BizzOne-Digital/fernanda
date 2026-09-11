import type { Metadata } from "next";
import { Suspense } from "react";
import { GalleryClient } from "./gallery-client";
import { PageHero } from "@/components/layout/page-hero";
import { getGalleryCategories, getGalleryImages } from "@/lib/data/gallery";
import { HERO_IMAGE } from "@/lib/demo-images";
import { resolveImage } from "@/lib/data/utils";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos of Vaseaux Lake, the historic property, cabins, and lake days.",
};

export default async function GalleryPage() {
  const [categories, images] = await Promise.all([getGalleryCategories(), getGalleryImages()]);
  const hero = resolveImage(categories[0]?.coverImage, "lakeHero", "Gallery hero");
  const heroSrc = hero.src.startsWith("/demo/") ? HERO_IMAGE : hero.src;

  return (
    <Suspense>
      <PageHero
        title="Gallery"
        subtitle="Lake days, historic character, and family time on Vaseaux Lake."
        imageSrc={heroSrc}
        imageAlt={hero.alt}
      />
      <GalleryClient categories={categories} images={images} />
    </Suspense>
  );
}
