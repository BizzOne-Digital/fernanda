"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LightboxGrid } from "@/components/gallery/lightbox";
import { GALLERY_FILTER_CATEGORIES } from "@/lib/gallery/categories";
import type { GalleryImageData } from "@/lib/data/gallery";

type GalleryClientProps = {
  images: GalleryImageData[];
};

export function GalleryClient({ images }: GalleryClientProps) {
  const searchParams = useSearchParams();
  const initial = searchParams.get("category") || "";
  const [active, setActive] = useState(initial);

  const filtered = useMemo(() => {
    if (!active) return images;
    return images.filter((image) => image.categorySlug === active);
  }, [active, images]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <p className="text-center text-sm text-ink/70">
        {images.length} photos of Vaseaux Lake, our property, and lake days in the South Okanagan.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {GALLERY_FILTER_CATEGORIES.map((category) => (
          <button
            key={category.slug || "all"}
            type="button"
            onClick={() => setActive(category.slug)}
            className={`rounded-sm px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] ${
              active === category.slug
                ? "bg-resort-navy text-cream"
                : "border border-sand bg-white text-resort-navy hover:bg-sand/30"
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>
      <LightboxGrid
        className="mt-10"
        images={filtered.map((image) => ({
          src: image.src,
          alt: image.alt,
          caption: image.caption,
          credit: image.credit,
        }))}
      />
    </section>
  );
}
