import Link from "next/link";
import type { IPageSection } from "@/models/Page";
import type { CabinData } from "@/lib/data/cabins";
import type { FaqData } from "@/lib/data/faqs";
import type { SeasonData } from "@/lib/data/seasons";
import type { TestimonialData } from "@/lib/data/testimonials";
import type { GalleryImageData } from "@/lib/data/gallery";
import { resolveImages } from "@/lib/data/utils";
import { SiteImage } from "@/components/ui/site-image";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { InquiryBar } from "@/components/forms/inquiry-bar";
import { CabinRail } from "@/components/cabins/cabin-rail";
import { LightboxGrid } from "@/components/gallery/lightbox";

type PageSectionRendererProps = {
  sections: IPageSection[];
  cabins?: CabinData[];
  faqs?: FaqData[];
  seasons?: SeasonData[];
  testimonials?: TestimonialData[];
  galleryImages?: GalleryImageData[];
};

export function PageSectionRenderer({
  sections,
  cabins = [],
  faqs = [],
  seasons = [],
  testimonials = [],
  galleryImages = [],
}: PageSectionRendererProps) {
  const enabled = [...sections].filter((section) => section.enabled).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-20">
      {enabled.map((section) => {
        switch (section.type) {
          case "hero":
            return <HeroSection key={section.sectionKey} section={section} />;
          case "rich-text":
          case "image-text":
            return <ImageTextSection key={section.sectionKey} section={section} />;
          case "cta":
            return <CtaSection key={section.sectionKey} section={section} />;
          case "stats":
            return <StatsSection key={section.sectionKey} section={section} />;
          case "timeline":
            return <TimelineSection key={section.sectionKey} section={section} />;
          case "faq-preview":
            return <FaqPreviewSection key={section.sectionKey} section={section} faqs={faqs} />;
          case "cabin-rail":
            return (
              <section key={section.sectionKey} className="mx-auto max-w-7xl px-4 md:px-6">
                <CabinRail cabins={cabins} />
              </section>
            );
          case "testimonials":
            return (
              <TestimonialsSection
                key={section.sectionKey}
                section={section}
                testimonials={testimonials}
              />
            );
          case "gallery":
            return (
              <GallerySection
                key={section.sectionKey}
                section={section}
                galleryImages={galleryImages}
              />
            );
          case "seasons":
            return <SeasonsSection key={section.sectionKey} section={section} seasons={seasons} />;
          case "inquiry-bar":
            return (
              <section key={section.sectionKey} className="mx-auto max-w-7xl px-4 md:px-6">
                <InquiryBar cabins={cabins} />
              </section>
            );
          default:
            return <ImageTextSection key={section.sectionKey} section={section} />;
        }
      })}
    </div>
  );
}

function HeroSection({ section }: { section: IPageSection }) {
  const images = resolveImages(section.images, 3, ["lakeHero", "patioBbq", "boats"]);
  return (
    <section data-hero className="relative min-h-[70vh] overflow-hidden">
      <div data-hero-media className="absolute inset-0">
        <SiteImage
          src={images[0].src}
          alt={images[0].alt}
          fill
          priority
          className="lake-mask"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-lake-deep/80 via-lake-deep/35 to-transparent" />
      </div>
      <div
        data-hero-copy
        className="relative mx-auto flex min-h-[70vh] max-w-7xl flex-col justify-end px-4 pb-16 pt-28 text-cream md:px-6"
      >
        {section.eyebrow ? (
          <p className="text-xs uppercase tracking-[0.25em] text-sand">{section.eyebrow}</p>
        ) : null}
        <h1 className="mt-3 max-w-3xl font-serif text-4xl text-balance md:text-6xl">
          {section.heading}
        </h1>
        {section.subheading ? <p className="mt-4 max-w-2xl text-lg text-cream/90">{section.subheading}</p> : null}
        {section.body ? <p className="mt-4 max-w-2xl text-cream/85">{section.body}</p> : null}
        {section.ctaText && section.ctaUrl ? (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href={section.ctaUrl} variant="golden">
              {section.ctaText}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ImageTextSection({ section }: { section: IPageSection }) {
  const images = resolveImages(section.images, 2, ["historic", "nature"]);
  return (
    <ScrollReveal className="mx-auto grid max-w-7xl items-center gap-8 px-4 md:grid-cols-2 md:px-6">
      <div>
        {section.eyebrow ? (
          <p className="text-xs uppercase tracking-[0.2em] text-lake-medium">{section.eyebrow}</p>
        ) : null}
        <h2 className="mt-2 font-serif text-3xl text-lake-deep md:text-4xl">{section.heading}</h2>
        {section.subheading ? <p className="mt-3 text-ink/75">{section.subheading}</p> : null}
        {section.body ? (
          <div className="prose prose-sm mt-4 max-w-none whitespace-pre-line text-ink/80">{section.body}</div>
        ) : null}
        {section.listItems?.length ? (
          <ul className="mt-4 space-y-2 text-sm text-ink/80">
            {section.listItems.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        ) : null}
        {section.quote ? (
          <blockquote className="mt-4 border-l-2 border-golden pl-4 font-serif text-xl text-lake-deep">
            {section.quote}
          </blockquote>
        ) : null}
      </div>
      <div className="grid gap-3">
        {images.map((image) => (
          <SiteImage
            key={image.src}
            src={image.src}
            alt={image.alt}
            width={800}
            height={600}
            frame="postcard"
            className="aspect-[4/3] w-full"
          />
        ))}
      </div>
    </ScrollReveal>
  );
}

function CtaSection({ section }: { section: IPageSection }) {
  return (
    <section className="mx-auto max-w-5xl px-4 py-4 text-center md:px-6">
      <h2 className="font-serif text-3xl text-lake-deep">{section.heading}</h2>
      {section.body ? <p className="mt-3 text-ink/75">{section.body}</p> : null}
      {section.ctaText && section.ctaUrl ? (
        <Button href={section.ctaUrl} variant="golden" className="mt-6">
          {section.ctaText}
        </Button>
      ) : null}
    </section>
  );
}

function StatsSection({ section }: { section: IPageSection }) {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6">
      <h2 className="font-serif text-3xl text-lake-deep">{section.heading}</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {section.stats?.map((stat) => (
          <div key={stat.label} className="postcard-border rounded-sm bg-cream p-4">
            <p className="font-serif text-3xl text-golden">{stat.value}</p>
            <p className="text-sm text-ink/70">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TimelineSection({ section }: { section: IPageSection }) {
  return (
    <section className="mx-auto max-w-4xl px-4 md:px-6">
      <h2 className="font-serif text-3xl text-lake-deep">{section.heading}</h2>
      <ol className="mt-8 space-y-6 border-l border-sand/80 pl-6">
        {section.listItems?.map((item) => (
          <li key={item} className="relative">
            <span className="absolute -left-[1.65rem] top-1 h-3 w-3 rounded-full bg-golden" />
            <p className="text-ink/80">{item}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function FaqPreviewSection({ section, faqs }: { section: IPageSection; faqs: FaqData[] }) {
  return (
    <section className="mx-auto max-w-4xl px-4 md:px-6">
      <h2 className="font-serif text-3xl text-lake-deep">{section.heading || "FAQs"}</h2>
      <div className="mt-6 space-y-3">
        {faqs.slice(0, 4).map((faq) => (
          <details key={faq._id} className="rounded-sm border border-sand/70 bg-cream p-4">
            <summary className="cursor-pointer font-medium">{faq.question}</summary>
            <p className="mt-2 text-sm text-ink/75">{faq.answer}</p>
          </details>
        ))}
      </div>
      <Link href="/faqs" className="mt-4 inline-block text-sm text-lake-medium">
        View all FAQs →
      </Link>
    </section>
  );
}

function TestimonialsSection({
  section,
  testimonials,
}: {
  section: IPageSection;
  testimonials: TestimonialData[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6">
      <h2 className="font-serif text-3xl text-lake-deep">{section.heading || "Guest memories"}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {testimonials.slice(0, 4).map((item) => (
          <blockquote key={item._id} className="postcard-border rounded-sm bg-cream p-5">
            <p className="text-ink/80">“{item.quote}”</p>
            <footer className="mt-3 text-sm text-ink/60">
              — {item.guestName}
              {item.location ? `, ${item.location}` : ""}
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function GallerySection({
  section,
  galleryImages,
}: {
  section: IPageSection;
  galleryImages: GalleryImageData[];
}) {
  return (
    <section className="mx-auto max-w-7xl px-4 md:px-6">
      <h2 className="font-serif text-3xl text-lake-deep">{section.heading || "Gallery"}</h2>
      <LightboxGrid
        className="mt-6"
        images={galleryImages.slice(0, 9).map((image) => ({
          src: image.src,
          alt: image.alt,
          caption: image.caption,
          credit: image.credit,
        }))}
      />
    </section>
  );
}

function SeasonsSection({ section, seasons }: { section: IPageSection; seasons: SeasonData[] }) {
  return (
    <section className="mx-auto max-w-5xl px-4 md:px-6">
      <h2 className="font-serif text-3xl text-lake-deep">{section.heading || "Seasons"}</h2>
      <p className="mt-2 text-sm text-ink/70">
        Rates vary by guest count, stay length, cabin, and dates. Contact us for pricing.
      </p>
      <div className="mt-6 space-y-4">
        {seasons.map((season) => (
          <article key={season._id} className="rounded-sm border border-sand/70 p-5">
            <h3 className="font-serif text-2xl text-lake-deep">{season.name}</h3>
            <p className="mt-2 text-sm text-ink/75">
              {season.weeklyAvailabilityText || season.minimumStayText || season.publicInquiryNote}
            </p>
            {season.variabilityNote ? (
              <p className="mt-2 text-xs text-ink/60">{season.variabilityNote}</p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
