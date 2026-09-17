import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCabinBySlug, getCabins, getCabinSlugs } from "@/lib/data/cabins";
import { getSiteSettings } from "@/lib/data/settings";
import { getSeasons } from "@/lib/data/seasons";
import { SiteImage } from "@/components/ui/site-image";
import { Button } from "@/components/ui/button";
import { LightboxGrid } from "@/components/gallery/lightbox";
import { resolveImage, resolveImages } from "@/lib/data/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getCabinSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cabin = await getCabinBySlug(slug);
  if (!cabin) return { title: "Cabin not found" };
  return {
    title: cabin.seo.title || cabin.name,
    description: cabin.seo.description || cabin.shortDescription,
  };
}

export default async function CabinDetailPage({ params }: Props) {
  const { slug } = await params;
  const [cabin, cabins, settings, seasons] = await Promise.all([
    getCabinBySlug(slug),
    getCabins(),
    getSiteSettings(),
    getSeasons(),
  ]);

  if (!cabin) notFound();

  const hero = resolveImage(cabin.heroImage || cabin.cardImage, "cabinInterior", cabin.name);
  const gallery = resolveImages(
    cabin.galleryImages?.length ? cabin.galleryImages : undefined,
    8,
    ["cabinInterior", "kitchen", "patioBbq", "boats", "lakeHero", "stars", "nature", "historic"],
  );

  const related = cabins.filter((item) => item.slug !== cabin.slug).slice(0, 3);

  return (
    <>
      <section data-hero className="relative min-h-[60vh] overflow-hidden">
        <div data-hero-media className="absolute inset-0">
          <SiteImage src={hero.src} alt={hero.alt} fill priority sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-lake-deep/80 to-transparent" />
        <div
          data-hero-copy
          className="relative mx-auto flex min-h-[60vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 text-cream md:px-6"
        >
          <p className="text-xs uppercase tracking-[0.2em] text-sand">Unit {cabin.cabinNumber}</p>
          <h1 className="font-serif text-4xl md:text-6xl">{cabin.name}</h1>
          <p className="mt-2 max-w-2xl text-cream/90">Sleeps up to {cabin.capacity} · {cabin.sleepingSummary}</p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[1.2fr_0.8fr] md:gap-10 md:py-12 md:px-6">
        <div>
          <h2 className="font-serif text-3xl text-lake-deep">Unit overview</h2>
          <p className="mt-3 whitespace-pre-line text-ink/80">
            {cabin.fullDescription || cabin.shortDescription}
          </p>
          {cabin.bestSuitedFor ? (
            <p className="mt-4 text-sm text-ink/70">
              <strong>Best suited for:</strong> {cabin.bestSuitedFor}
            </p>
          ) : null}
        </div>
        <div className="rounded-sm border border-sand/70 p-5">
          <h3 className="font-serif text-xl text-lake-deep">Sleeping arrangement</h3>
          {cabin.sleepingArrangement?.length ? (
            <ul className="mt-3 space-y-2 text-sm">
              {cabin.sleepingArrangement.map((row) => (
                <li key={`${row.location}-${row.bedType}`}>
                  {row.location}: {row.count} {row.bedType}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-ink/75">{cabin.sleepingSummary}</p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-6 md:px-6 md:pb-8">
        <h2 className="font-serif text-3xl text-lake-deep">Gallery</h2>
        <LightboxGrid
          className="mt-4 md:mt-6"
          images={gallery.map((image) => ({ src: image.src, alt: image.alt, caption: image.caption }))}
        />
      </section>

      <section className="mx-auto max-w-7xl border-t border-sand/60 px-4 py-6 md:px-6 md:py-10">
        <h2 className="font-serif text-3xl text-lake-deep">Included in every unit</h2>
        <ul className="mt-3 space-y-1.5 md:mt-4 md:grid md:grid-cols-2 md:gap-2 md:space-y-0">
          {(cabin.amenities.length ? cabin.amenities : settings.property.sharedAmenities).map((item) => (
            <li key={item} className="text-sm text-ink/80">
              • {item}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-sm text-ink/70 md:mt-4">
          <strong>Packing:</strong> {cabin.packingNotes || settings.property.packingNotes}
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-8 pt-0 md:px-6 md:pb-12">
        <h2 className="font-serif text-3xl text-lake-deep">Seasons & minimum stay</h2>
        {seasons.map((season) => (
          <p key={season._id} className="mt-2 text-sm text-ink/75">
            <strong>{season.name}:</strong>{" "}
            {season.weeklyAvailabilityText || season.minimumStayText || season.publicInquiryNote}
          </p>
        ))}
        <p className="mt-3 text-xs text-ink/60">Contact us for pricing — rates are not fixed online.</p>
      </section>

      {cabin.cabinFaqs.length ? (
        <section className="mx-auto max-w-4xl px-4 py-6 md:px-6 md:py-10">
          <h2 className="font-serif text-3xl text-lake-deep">Cabin notes</h2>
          <div className="mt-4 space-y-3">
            {cabin.cabinFaqs.map((faq) => (
              <details key={faq.question} className="rounded-sm border border-sand/70 p-4">
                <summary>{faq.question}</summary>
                <p className="mt-2 text-sm text-ink/75">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        <h2 className="font-serif text-3xl text-lake-deep">Compare other units</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {related.map((item) => (
            <Link key={item.slug} href={`/cabins/${item.slug}`} className="rounded-full border border-sand px-4 py-2 text-sm">
              {item.name}
            </Link>
          ))}
          <Link href="/cabins" className="rounded-full border border-lake-medium px-4 py-2 text-sm text-lake-deep">
            View all cabins
          </Link>
        </div>
        <Button href={`/inquire?cabin=${cabin.slug}`} variant="golden" className="mt-8">
          Inquire about {cabin.name}
        </Button>
      </section>
    </>
  );
}
