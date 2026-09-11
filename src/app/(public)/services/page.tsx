import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { FaqList } from "@/components/faqs/faq-list";
import { getServices } from "@/lib/data/services";
import { getFaqs } from "@/lib/data/faqs";
import { FALLBACK_FAQS } from "@/lib/data/fallbacks";
import { SiteImage } from "@/components/ui/site-image";
import { Button } from "@/components/ui/button";
import { resolveImage, resolveImages } from "@/lib/data/utils";

export const metadata: Metadata = {
  title: "Experiences",
  description: "Stay types and lake experiences at Vaseaux Lake Waterfront Cabins.",
};

export const dynamic = "force-dynamic";
export default async function ServicesPage() {
  const [services, faqs] = await Promise.all([getServices(), getFaqs()]);
  const images = resolveImages(undefined, 7, [
    "lakeHero",
    "boats",
    "patioBbq",
    "stars",
    "nature",
    "cabinInterior",
    "kitchen",
  ]);

  const relatedFaqs = (faqs.length > 0 ? faqs : FALLBACK_FAQS)
    .filter((faq) => ["Booking", "Rates & Seasons", "Lake & Equipment"].includes(faq.category))
    .slice(0, 3);

  const displayFaqs =
    relatedFaqs.length > 0 ? relatedFaqs : (faqs.length > 0 ? faqs : FALLBACK_FAQS).slice(0, 3);

  return (
    <>
      <PageHero
        title="Experiences & stay types"
        subtitle="Lake holidays shaped by season, family rhythm, and the pace of Vaseaux Lake — inquire for availability and a quote."
        imageSrc={images[0].src}
        imageAlt={images[0].alt}
      />

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const image = resolveImage(service.cardImage, "boats", service.title);
            return (
              <article key={service.slug} className="postcard-border overflow-hidden rounded-sm">
                <div className="relative aspect-[4/3]">
                  <SiteImage src={image.src} alt={image.alt} fill sizes="(max-width:768px) 100vw, 33vw" />
                </div>
                <div className="p-4">
                  <h2 className="font-serif text-2xl text-lake-deep">
                    <Link href={`/services/${service.slug}`}>{service.title}</Link>
                  </h2>
                  <p className="mt-2 text-sm text-ink/75">{service.shortDescription}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">How inquiry works</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-ink/80">
          <li>Share your preferred dates and guest count.</li>
          <li>Tell us which cabin or experience interests you.</li>
          <li>We reply with availability and a quote — nothing is confirmed until we respond.</li>
        </ol>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {images.slice(1, 4).map((image) => (
            <SiteImage key={image.src} src={image.src} alt={image.alt} width={400} height={300} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">Related FAQs</h2>
        <div className="mt-4">
          <FaqList faqs={displayFaqs} />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/inquire" variant="golden">
            Start an inquiry
          </Button>
          <Button href="/faqs" variant="secondary">
            View all FAQs
          </Button>
        </div>
      </section>
    </>
  );
}
