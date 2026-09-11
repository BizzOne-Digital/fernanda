"use client";

import { useState } from "react";
import { SiteImage } from "@/components/ui/site-image";
import { Button } from "@/components/ui/button";
import type { TestimonialData } from "@/lib/data/testimonials";
import { resolveImage, resolveImages } from "@/lib/data/utils";

type TestimonialsClientProps = {
  testimonials: TestimonialData[];
};

export function TestimonialsClient({ testimonials }: TestimonialsClientProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const images = resolveImages(undefined, 5, ["lakeHero", "stars", "patioBbq", "boats", "nature"]);
  const hero = resolveImage(testimonials[0]?.image, "stars", "Testimonials");

  const current = testimonials[index] ?? testimonials[0];

  return (
    <>
      <section className="relative min-h-[45vh] overflow-hidden">
        <SiteImage src={hero.src} alt={hero.alt} fill priority sizes="100vw" />
        <div className="absolute inset-0 bg-lake-deep/55" />
        <div className="relative mx-auto flex min-h-[45vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 text-cream md:px-6">
          <h1 className="font-serif text-4xl md:text-6xl">Guest memories</h1>
          <p className="mt-3 max-w-2xl">Stories from families who found their rhythm on the lake.</p>
        </div>
      </section>

      {current ? (
        <section className="mx-auto max-w-4xl px-4 py-12 md:px-6" aria-live="polite">
          <blockquote className="postcard-border rounded-sm bg-cream p-8 text-center">
            <p className="font-serif text-2xl text-lake-deep">“{current.quote}”</p>
            <footer className="mt-4 text-sm text-ink/60">
              — {current.guestName}
              {current.location ? `, ${current.location}` : ""}
            </footer>
          </blockquote>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              className="rounded border border-sand px-3 py-1 text-sm"
              onClick={() => setIndex((value) => (value - 1 + testimonials.length) % testimonials.length)}
            >
              Previous
            </button>
            <button
              type="button"
              className="rounded border border-sand px-3 py-1 text-sm"
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              className="rounded border border-sand px-3 py-1 text-sm"
              onClick={() => setIndex((value) => (value + 1) % testimonials.length)}
            >
              Next
            </button>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">Review wall</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {testimonials.map((item) => (
            <blockquote key={item._id} className="rounded-sm border border-sand/70 p-5">
              <p className="text-ink/80">“{item.quote}”</p>
              <footer className="mt-3 text-sm text-ink/60">
                — {item.guestName}
                {item.location ? `, ${item.location}` : ""}
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">Memory strip</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {images.map((image) => (
            <SiteImage key={image.src} src={image.src} alt={image.alt} width={300} height={220} frame="postcard" />
          ))}
        </div>
        <Button href="/inquire" variant="golden" className="mt-8">
          Plan your own lake memories
        </Button>
      </section>
    </>
  );
}
