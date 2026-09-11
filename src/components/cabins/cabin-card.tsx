import Link from "next/link";
import { SiteImage } from "@/components/ui/site-image";
import type { CabinData } from "@/lib/data/cabins";
import { resolveImage } from "@/lib/data/utils";

type CabinCardProps = {
  cabin: CabinData;
};

export function CabinCard({ cabin }: CabinCardProps) {
  const image = resolveImage(cabin.cardImage, "cabinInterior", `${cabin.name} preview`);

  return (
    <article className="group postcard-border relative overflow-hidden rounded-sm bg-cream transition hover:-translate-y-1">
      <div className="absolute left-3 top-3 z-10 rounded-full bg-lake-deep px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-cream">
        Unit {cabin.cabinNumber}
      </div>
      <Link href={`/cabins/${cabin.slug}`} className="block">
        <div className="relative aspect-[4/3]">
          <SiteImage src={image.src} alt={image.alt} fill sizes="(max-width:768px) 100vw, 25vw" />
        </div>
        <div className="space-y-2 p-4">
          <h3 className="font-serif text-2xl text-lake-deep">{cabin.name}</h3>
          <p className="text-sm text-ink/75">Sleeps up to {cabin.capacity}</p>
          <p className="text-sm text-ink/70">{cabin.sleepingSummary}</p>
          <p className="text-xs uppercase tracking-[0.15em] text-lake-medium">View details →</p>
        </div>
      </Link>
    </article>
  );
}
