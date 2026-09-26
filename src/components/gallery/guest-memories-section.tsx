import Image from "next/image";
import Link from "next/link";
import type { GuestMemoryData } from "@/lib/data/guest-memories";
import { requiresUnoptimizedImage } from "@/lib/uploads/public-url";
import { Button } from "@/components/ui/button";

type GuestMemoriesSectionProps = {
  memories: GuestMemoryData[];
};

export function GuestMemoriesSection({ memories }: GuestMemoriesSectionProps) {
  if (memories.length === 0) {
    return (
      <section className="border-t border-sand/80 bg-sand/15">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center md:px-6">
          <h2 className="font-serif text-3xl text-lake-deep">Guest memories</h2>
          <p className="mt-3 text-sm text-ink/75">
            Stayed with us? Share a favourite lake moment — we review submissions before they appear here.
          </p>
          <Button href="/gallery/share-a-memory" variant="golden" className="mt-6">
            Share a memory
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-sand/80 bg-sand/15">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-3xl text-lake-deep">Guest memories</h2>
            <p className="mt-2 max-w-2xl text-sm text-ink/75">
              Stories and photos from guests who have spent time at Vaseaux Lake.
            </p>
          </div>
          <Link
            href="/gallery/share-a-memory"
            className="text-sm font-semibold uppercase tracking-[0.12em] text-lake-medium hover:underline"
          >
            Share yours
          </Link>
        </div>

        <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {memories.map((memory) => (
            <li key={String(memory._id)} className="overflow-hidden rounded-sm border border-sand/80 bg-white">
              {memory.photoUrl ? (
                <div className="relative aspect-[4/3] bg-sand/20">
                  <Image
                    src={memory.photoUrl}
                    alt={memory.photoAlt || `Memory from ${memory.guestName}`}
                    fill
                    className="object-cover"
                    unoptimized={requiresUnoptimizedImage(memory.photoUrl)}
                  />
                </div>
              ) : null}
              <div className="space-y-2 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-lake-medium">{memory.guestName}</p>
                <p className="text-sm leading-relaxed text-ink/85 whitespace-pre-line">{memory.story}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
