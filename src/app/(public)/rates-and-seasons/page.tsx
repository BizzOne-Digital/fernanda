import type { Metadata } from "next";
import { getSeasons } from "@/lib/data/seasons";
import { getCabins } from "@/lib/data/cabins";
import { getSiteSettings } from "@/lib/data/settings";
import { getFaqs } from "@/lib/data/faqs";
import { SiteImage } from "@/components/ui/site-image";
import { Button } from "@/components/ui/button";
import { resolveImages } from "@/lib/data/utils";

export const metadata: Metadata = {
  title: "Rates & Seasons",
  description: "Seasonal stay guidance for Vaseaux Lake Waterfront Cabins. Contact for pricing.",
};

export default async function RatesAndSeasonsPage() {
  const [seasons, cabins, settings, faqs] = await Promise.all([
    getSeasons(),
    getCabins(),
    getSiteSettings(),
    getFaqs(),
  ]);
  const images = resolveImages(undefined, 5, ["lakeHero", "patioBbq", "boats", "stars", "nature"]);

  return (
    <>
      <section data-hero className="relative min-h-[45vh] overflow-hidden">
        <div data-hero-media className="absolute inset-0">
          <SiteImage src={images[0].src} alt={images[0].alt} fill priority sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-lake-deep/55" />
        <div
          data-hero-copy
          className="relative mx-auto flex min-h-[45vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 text-cream md:px-6"
        >
          <h1 className="font-serif text-4xl md:text-6xl">A simple stay, quoted for your dates</h1>
          <p className="mt-3 max-w-2xl">Contact for pricing — we do not publish fixed rates online.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <p className="text-ink/80">
          Rates vary by guest count, stay length, selected cabin, and dates. High season typically runs
          from Canada Day week through Labour Day week with weekly rentals. May, June, and September may
          offer shorter stays.
        </p>
        <div className="mt-8 space-y-4">
          {seasons.map((season) => (
            <article key={season._id} className="rounded-sm border border-sand/70 p-5">
              <h2 className="font-serif text-2xl text-lake-deep">{season.name}</h2>
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

      <section className="mx-auto w-full min-w-0 max-w-7xl px-4 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">Cabin capacity comparison</h2>
        <div className="mt-4 max-w-full overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-sand/70">
                <th className="py-2 pr-4">Unit</th>
                <th className="py-2 pr-4">Capacity</th>
                <th className="py-2">Sleeping summary</th>
              </tr>
            </thead>
            <tbody>
              {cabins.map((cabin) => (
                <tr key={cabin.slug} className="border-b border-sand/40">
                  <td className="py-2 pr-4">{cabin.name}</td>
                  <td className="py-2 pr-4">{cabin.capacity}</td>
                  <td className="py-2">{cabin.sleepingSummary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">What every stay includes</h2>
        <ul className="mt-4 space-y-2 text-sm text-ink/80">
          {settings.property.sharedAmenities.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
        <p className="mt-4 text-sm">
          <strong>Guests bring:</strong> {settings.property.packingNotes}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {images.slice(1).map((image) => (
            <SiteImage key={image.src} src={image.src} alt={image.alt} width={500} height={360} />
          ))}
        </div>
        <Button href="/inquire" variant="golden" className="mt-8">
          Ask about last-minute openings
        </Button>
        <div className="mt-10 space-y-3">
          {faqs
            .filter((faq) => faq.category === "Rates & Seasons")
            .slice(0, 3)
            .map((faq) => (
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
