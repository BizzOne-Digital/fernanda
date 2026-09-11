import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { getCabins } from "@/lib/data/cabins";
import { getServices } from "@/lib/data/services";
import { getSiteSettings } from "@/lib/data/settings";
import { SiteImage } from "@/components/ui/site-image";
import { resolveImages } from "@/lib/data/utils";

export const metadata: Metadata = {
  title: "Inquire",
  description: "Submit a booking inquiry for Vaseaux Lake Waterfront Cabins.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{
    arrival?: string;
    departure?: string;
    guests?: string;
    cabin?: string;
    service?: string;
  }>;
};

export default async function InquirePage({ searchParams }: Props) {
  const params = await searchParams;
  const [cabins, services, settings] = await Promise.all([
    getCabins(),
    getServices(),
    getSiteSettings(),
  ]);
  const images = resolveImages(undefined, 5, ["lakeHero", "boats", "patioBbq", "stars", "nature"]);

  return (
    <>
      <section className="relative min-h-[35vh] overflow-hidden">
        <SiteImage src={images[0].src} alt={images[0].alt} fill priority sizes="100vw" />
        <div className="absolute inset-0 bg-lake-deep/55" />
        <div className="relative mx-auto flex min-h-[35vh] max-w-7xl flex-col justify-end px-4 pb-8 pt-24 text-cream md:px-6">
          <h1 className="font-serif text-4xl md:text-5xl">Plan your stay</h1>
          <p className="mt-2 max-w-2xl text-sm text-cream/90">
            This is an inquiry request — availability is not confirmed until we reply with a quote.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-[0.9fr_1.1fr] md:px-6">
        <div>
          <h2 className="font-serif text-3xl text-lake-deep">Before you submit</h2>
          <ul className="mt-4 space-y-2 text-sm text-ink/75">
            <li>• Eight private cabin-style units under one historic roof (not detached cabins).</li>
            <li>• Rates vary by dates, guest count, and stay length — contact for pricing.</li>
            <li>• {settings.booking.responseTimeWording}</li>
          </ul>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {images.slice(1, 5).map((image) => (
              <SiteImage key={image.src} src={image.src} alt={image.alt} width={280} height={200} />
            ))}
          </div>
        </div>
        <div className="rounded-sm border border-sand/70 bg-cream p-6">
          <InquiryForm
            cabins={cabins}
            services={services}
            settings={settings}
            initial={{
              arrival: params.arrival,
              departure: params.departure,
              guests: params.guests,
              cabin: params.cabin,
              service: params.service,
            }}
          />
        </div>
      </section>
    </>
  );
}
