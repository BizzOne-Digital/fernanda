"use client";

import { useMemo, useState } from "react";
import type { AttractionData } from "@/lib/data/attractions";
import { AttractionCard } from "@/components/things-to-do/attraction-card";

const CATEGORY_ORDER = [
  "On-Property",
  "Nature",
  "Food & Wine",
  "Family",
  "Scenic Drives",
  "Day Trips",
] as const;

type ThingsToDoGuideProps = {
  attractions: AttractionData[];
};

export function ThingsToDoGuide({ attractions }: ThingsToDoGuideProps) {
  const [active, setActive] = useState("");

  const categories = useMemo(() => {
    const present = new Set(attractions.map((item) => item.category));
    return CATEGORY_ORDER.filter((category) => present.has(category));
  }, [attractions]);

  const filtered = useMemo(() => {
    if (!active) return attractions;
    return attractions.filter((item) => item.category === active);
  }, [active, attractions]);

  const grouped = useMemo(() => {
    if (active) return null;
    return categories
      .map((category) => ({
        category,
        items: attractions.filter((item) => item.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [active, attractions, categories]);

  if (attractions.length === 0) {
    return (
      <div className="rounded-sm border border-dashed border-sand/80 bg-cream/50 px-6 py-12 text-center">
        <p className="font-serif text-xl text-lake-deep">Local guide coming soon</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink/70">
          Verified attractions and day-trip ideas will appear here once added in the admin portal.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive("")}
          className={`rounded-full px-4 py-2 text-sm transition ${
            !active ? "bg-lake-deep text-cream" : "border border-sand/70 bg-cream text-ink/75 hover:border-lake-medium/40"
          }`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActive(category)}
            className={`rounded-full px-4 py-2 text-sm transition ${
              active === category
                ? "bg-lake-deep text-cream"
                : "border border-sand/70 bg-cream text-ink/75 hover:border-lake-medium/40"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {active ? (
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {filtered.map((item) => (
            <AttractionCard key={item._id} item={item} />
          ))}
        </div>
      ) : (
        <div className="mt-10 space-y-14">
          {grouped?.map((group) => (
            <div key={group.category}>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-sand/60 pb-4">
                <div>
                  <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-lake-medium">
                    {group.category}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl text-lake-deep md:text-3xl">
                    {group.category === "Nature"
                      ? "Lake, bluffs & wildlife"
                      : group.category === "Day Trips"
                        ? "Beyond the shoreline"
                        : group.category}
                  </h3>
                </div>
                <p className="text-sm text-ink/55">
                  {group.items.length} {group.items.length === 1 ? "idea" : "ideas"}
                </p>
              </div>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {group.items.map((item) => (
                  <AttractionCard key={item._id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
