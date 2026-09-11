"use client";

import { useMemo, useState } from "react";
import type { FaqData } from "@/lib/data/faqs";
import { SiteImage } from "@/components/ui/site-image";
import { Button } from "@/components/ui/button";
import { resolveImage } from "@/lib/data/utils";

type FaqsClientProps = {
  faqs: FaqData[];
};

export function FaqsClient({ faqs }: FaqsClientProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const categories = useMemo(
    () => Array.from(new Set(faqs.map((faq) => faq.category))).sort(),
    [faqs],
  );

  const filtered = useMemo(() => {
    return faqs.filter((faq) => {
      if (category && faq.category !== category) return false;
      if (!query) return true;
      const haystack = `${faq.question} ${faq.answer}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [faqs, query, category]);

  const hero = resolveImage(undefined, "lakeHero", "FAQs hero");

  return (
    <>
      <section className="relative min-h-[40vh] overflow-hidden">
        <SiteImage src={hero.src} alt={hero.alt} fill priority sizes="100vw" />
        <div className="absolute inset-0 bg-lake-deep/55" />
        <div className="relative mx-auto flex min-h-[40vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 text-cream md:px-6">
          <h1 className="font-serif text-4xl md:text-6xl">FAQs</h1>
          <p className="mt-3 max-w-2xl">Answers about cabins, seasons, packing, and lake stays.</p>
        </div>
      </section>

      <section className="mx-auto w-full min-w-0 max-w-4xl px-4 py-10 md:px-6">
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            type="search"
            placeholder="Search questions"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-full rounded border border-sand/70 px-3 py-2"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded border border-sand/70 px-3 py-2"
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 space-y-3">
          {filtered.map((faq) => (
            <details key={faq._id} className="rounded-sm border border-sand/70 p-4">
              <summary className="cursor-pointer font-medium">{faq.question}</summary>
              <p className="mt-2 text-sm text-ink/75">{faq.answer}</p>
              <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-ink/45">{faq.category}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/inquire" variant="golden">
            Inquire
          </Button>
          <Button href="/contact" variant="secondary">
            Contact us
          </Button>
        </div>
      </section>
    </>
  );
}
