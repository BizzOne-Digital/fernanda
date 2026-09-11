"use client";

import Link from "next/link";
import { SiteImage } from "@/components/ui/site-image";
import type { CabinData } from "@/lib/data/cabins";
import { resolveImage } from "@/lib/data/utils";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

type CabinRailProps = {
  cabins: CabinData[];
};

export function CabinRail({ cabins }: CabinRailProps) {
  return (
    <div className="relative max-w-full overflow-hidden">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-lake-medium">Units 5–12</p>
          <h2 className="font-serif text-3xl text-lake-deep md:text-4xl">
            Eight private stays under one roof
          </h2>
        </div>
        <Link href="/cabins" className="text-sm text-lake-medium hover:text-lake-deep">
          Compare all cabins
        </Link>
      </div>
      <div className="flex max-w-full gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {cabins.map((cabin, index) => {
          const image = resolveImage(cabin.cardImage, "cabinInterior", cabin.name);
          return (
            <ScrollReveal key={cabin.slug} direction={index % 2 === 0 ? "left" : "right"} className="shrink-0">
              <Link
                href={`/cabins/${cabin.slug}`}
                className="postcard-border block w-64 overflow-hidden rounded-sm bg-cream md:w-72"
              >
                <div className="relative aspect-[4/5]">
                  <SiteImage src={image.src} alt={image.alt} fill sizes="280px" />
                  <span className="absolute left-3 top-3 rounded bg-lake-deep px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-cream">
                    {cabin.cabinNumber}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-serif text-xl">{cabin.name}</p>
                  <p className="text-sm text-ink/70">Sleeps {cabin.capacity}</p>
                </div>
              </Link>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
