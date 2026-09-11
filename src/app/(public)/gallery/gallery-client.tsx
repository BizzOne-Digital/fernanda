"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LightboxGrid } from "@/components/gallery/lightbox";
import type { GalleryCategoryData } from "@/lib/data/gallery";
import type { GalleryImageData } from "@/lib/data/gallery";

type GalleryClientProps = {
  categories: GalleryCategoryData[];
  images: GalleryImageData[];
};

export function GalleryClient({ categories, images }: GalleryClientProps) {
  const searchParams = useSearchParams();
  const initial = searchParams.get("category") || "";
  const [active, setActive] = useState(initial);

  const filtered = useMemo(() => {
    if (!active) return images;
    return images.filter((image) => image.categorySlug === active);
  }, [active, images]);

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive("")}
            className={`rounded-full px-4 py-2 text-sm ${!active ? "bg-lake-deep text-cream" : "border border-sand"}`}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              type="button"
              onClick={() => setActive(category.slug)}
              className={`rounded-full px-4 py-2 text-sm ${active === category.slug ? "bg-lake-deep text-cream" : "border border-sand"}`}
            >
              {category.name}
            </button>
          ))}
        </div>
        <LightboxGrid
          className="mt-8"
          images={filtered.map((image) => ({
            src: image.src,
            alt: image.alt,
            caption: image.caption,
            credit: image.credit,
          }))}
        />
      </section>
    </>
  );
}
