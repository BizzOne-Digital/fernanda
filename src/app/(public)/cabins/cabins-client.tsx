"use client";

import { useMemo, useState } from "react";
import { CabinCard } from "@/components/cabins/cabin-card";
import { SiteImage } from "@/components/ui/site-image";
import { Button } from "@/components/ui/button";
import type { CabinData } from "@/lib/data/cabins";
import type { FaqData } from "@/lib/data/faqs";
import type { SiteSettingsData } from "@/lib/data/settings";
import { resolveImages } from "@/lib/data/utils";

type CabinsPageClientProps = {
  cabins: CabinData[];
  settings: SiteSettingsData;
  faqs: FaqData[];
};

export function CabinsPageClient({ cabins, settings, faqs }: CabinsPageClientProps) {
  const [capacity, setCapacity] = useState<number | "">("");
  const [separateBedroom, setSeparateBedroom] = useState<"" | "yes" | "no">("");

  const filtered = useMemo(() => {
    return cabins.filter((cabin) => {
      if (capacity && cabin.capacity < Number(capacity)) return false;
      if (separateBedroom === "yes" && !cabin.hasSeparateBedroom) return false;
      if (separateBedroom === "no" && cabin.hasSeparateBedroom) return false;
      return true;
    });
  }, [cabins, capacity, separateBedroom]);

  const images = resolveImages(undefined, 8, [
    "lakeHero",
    "cabinInterior",
    "kitchen",
    "patioBbq",
    "boats",
    "nature",
    "stars",
    "historic",
  ]);

  return (
    <>
      <section className="relative min-h-[55vh] overflow-hidden">
        <SiteImage src={images[0].src} alt={images[0].alt} fill priority className="object-cover" sizes="100vw" />
        <div className="absolute inset-0 bg-lake-deep/55" />
        <div className="relative mx-auto flex min-h-[55vh] max-w-7xl flex-col justify-end px-4 pb-12 pt-24 text-cream md:px-6">
          <h1 className="font-serif text-4xl md:text-6xl">Eight private stays. One unforgettable lakeside setting.</h1>
          <p className="mt-3 max-w-2xl text-cream/90">
            Private cabin-style units within the historic original building — units 5 through 12 on
            Vaseaux Lake.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <p className="max-w-3xl text-ink/80">
          The property is not a collection of detached cabins. Compare capacity, sleeping layout, and
          amenities, then inquire for availability and a quote.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <label className="text-sm">
            Min capacity
            <select
              className="ml-2 rounded border border-sand/70 px-2 py-1"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : "")}
            >
              <option value="">Any</option>
              {[4, 5, 6].map((value) => (
                <option key={value} value={value}>
                  {value}+
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            Separate bedroom
            <select
              className="ml-2 rounded border border-sand/70 px-2 py-1"
              value={separateBedroom}
              onChange={(e) => setSeparateBedroom(e.target.value as "" | "yes" | "no")}
            >
              <option value="">Any</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </label>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((cabin) => (
            <CabinCard key={cabin.slug} cabin={cabin} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">Shared amenities</h2>
        <ul className="mt-4 grid gap-2 md:grid-cols-2">
          {settings.property.sharedAmenities.map((item) => (
            <li key={item} className="text-sm text-ink/80">
              • {item}
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {images.slice(1, 5).map((image) => (
            <SiteImage key={image.src} src={image.src} alt={image.alt} width={400} height={300} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">Packing checklist</h2>
        <p className="mt-3 text-ink/80">{settings.property.packingNotes}</p>
        <h2 className="mt-10 font-serif text-3xl text-lake-deep">Rates & seasons</h2>
        <p className="mt-3 text-ink/80">
          We do not publish fixed rates online. Contact us for pricing based on your dates, guest count,
          and selected cabin.
        </p>
        <Button href="/inquire" variant="golden" className="mt-6">
          Inquire for availability
        </Button>
        <div className="mt-10 space-y-3">
          {faqs.slice(0, 2).map((faq) => (
            <details key={faq._id} className="rounded-sm border border-sand/70 p-4">
              <summary>{faq.question}</summary>
              <p className="mt-2 text-sm text-ink/75">{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
