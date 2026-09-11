import type { AttractionData } from "@/lib/data/attractions";
import { SiteImage } from "@/components/ui/site-image";
import { resolveImage, type ResolvedImage } from "@/lib/data/utils";
import type { DemoImageKey } from "@/lib/demo-images";
import { cn } from "@/lib/utils/cn";

const CATEGORY_IMAGE: Record<string, DemoImageKey> = {
  "On-Property": "lakeHero",
  Nature: "nature",
  "Food & Wine": "kitchen",
  Family: "historic",
  "Scenic Drives": "lakeHero",
  "Day Trips": "historic",
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function cardImage(item: AttractionData): ResolvedImage {
  const fallback = CATEGORY_IMAGE[item.category] ?? "nature";
  return resolveImage(item.images?.[0], fallback, item.title);
}

type AttractionCardProps = {
  item: AttractionData;
  className?: string;
};

export function AttractionCard({ item, className }: AttractionCardProps) {
  const image = cardImage(item);
  const detail = item.body ? stripHtml(item.body) : "";

  return (
    <article
      className={cn(
        "postcard-border flex h-full flex-col overflow-hidden rounded-sm bg-cream shadow-[0_16px_40px_rgb(23_63_79_/_6%)]",
        className,
      )}
    >
      <div className="relative aspect-[16/10]">
        <SiteImage src={image.src} alt={image.alt} fill sizes="(max-width:768px) 100vw, 50vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-lake-deep/45 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          <span className="rounded-sm bg-cream/92 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-lake-deep">
            {item.category}
          </span>
          {item.featured ? (
            <span className="rounded-sm bg-golden/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-ink">
              Featured
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3 className="font-serif text-xl text-lake-deep md:text-2xl">{item.title}</h3>
          {item.isVerified ? (
            <span className="shrink-0 rounded-full bg-lake-deep/8 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-lake-medium">
              Verified
            </span>
          ) : (
            <span className="shrink-0 rounded-full bg-sand/60 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-ink/55">
              Draft
            </span>
          )}
        </div>

        <p className="mt-3 text-sm leading-relaxed text-ink/78">{item.summary}</p>
        {detail ? <p className="mt-2 text-sm leading-relaxed text-ink/65">{detail}</p> : null}

        <ul className="mt-4 space-y-1.5 text-xs text-ink/60">
          {item.travelTimeText ? (
            <li>
              <span className="font-medium text-ink/75">Travel:</span> {item.travelTimeText}
            </li>
          ) : null}
          {item.season ? (
            <li>
              <span className="font-medium text-ink/75">Season:</span> {item.season}
            </li>
          ) : null}
          {item.familyNotes ? (
            <li>
              <span className="font-medium text-ink/75">Families:</span> {item.familyNotes}
            </li>
          ) : null}
          {item.address ? (
            <li>
              <span className="font-medium text-ink/75">Location:</span> {item.address}
            </li>
          ) : null}
        </ul>

        <div className="mt-auto flex flex-wrap gap-3 pt-5">
          {item.website ? (
            <a
              href={item.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-lake-medium underline-offset-2 hover:underline"
            >
              Visit website
            </a>
          ) : null}
          {item.mapLink ? (
            <a
              href={item.mapLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-lake-medium underline-offset-2 hover:underline"
            >
              View map
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
