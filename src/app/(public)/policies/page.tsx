import type { Metadata } from "next";
import { getPageBySlug } from "@/lib/data/pages";
import { getSiteSettings } from "@/lib/data/settings";
import { PageSectionRenderer } from "@/components/sections/page-section-renderer";
import { PACKING_NOTE } from "@/lib/seed/constants";

export const metadata: Metadata = {
  title: "Policies",
  description: "Guest policies for Vaseaux Lake Waterfront Cabins.",
};

export default async function PoliciesPage() {
  const [page, settings] = await Promise.all([getPageBySlug("policies"), getSiteSettings()]);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <h1 className="font-serif text-4xl text-lake-deep">Policies</h1>
      <p className="mt-3 text-sm text-ink/70">
        Placeholder policies require owner review before launch. The confirmed packing requirement is
        listed below.
      </p>

      {page?.sections?.length ? (
        <div className="mt-10">
          <PageSectionRenderer sections={page.sections} />
        </div>
      ) : (
        <div className="mt-8 space-y-6">
          <article className="rounded-sm border border-sand/70 p-5">
            <h2 className="font-serif text-2xl text-lake-deep">Bedding, towels, and toiletries</h2>
            <p className="mt-2 text-ink/80">{settings.property.packingNotes || PACKING_NOTE}</p>
          </article>
          <article className="rounded-sm border border-sand/70 p-5">
            <h2 className="font-serif text-2xl text-lake-deep">Booking policy — owner review required</h2>
            <p className="mt-2 text-ink/80">
              PLACEHOLDER — Replace with confirmed booking terms before launch.
            </p>
          </article>
        </div>
      )}
    </section>
  );
}
