"use client";

import Link from "next/link";
import { SiteImage } from "@/components/ui/site-image";
import type { CabinData } from "@/lib/data/cabins";
import { resolveImage } from "@/lib/data/utils";

type CabinRailProps = {
  cabins: CabinData[];
};

export function CabinRail({ cabins }: CabinRailProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cabins.slice(0, 8).map((cabin) => {
        const image = resolveImage(cabin.cardImage, "cabinInterior", cabin.name);
        return (
          <Link key={cabin.slug} href={`/cabins/${cabin.slug}`} className="resort-card group">
            <div className="relative aspect-[4/3] overflow-hidden">
              <SiteImage src={image.src} alt={image.alt} fill sizes="(max-width:768px) 50vw, 25vw" className="object-cover transition duration-500 group-hover:scale-105" />
            </div>
            <div className="border-t border-sand/80 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-lake-medium">Cabin {cabin.cabinNumber}</p>
              <p className="mt-1 font-serif text-xl text-resort-navy">{cabin.name}</p>
              <p className="mt-1 text-sm text-ink/70">Sleeps {cabin.capacity}</p>
              <span className="mt-3 inline-block text-xs font-bold uppercase tracking-[0.14em] text-golden">More info →</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
