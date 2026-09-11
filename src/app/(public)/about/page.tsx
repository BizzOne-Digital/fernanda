import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { PageSectionRenderer } from "@/components/sections/page-section-renderer";
import { SiteImage } from "@/components/ui/site-image";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { getPageBySlug } from "@/lib/data/pages";
import { BRAND_STORY } from "@/lib/seed/constants";
import { resolveImages } from "@/lib/data/utils";

export const metadata: Metadata = {
  title: "About",
  description:
    "From the Sundial Motel to Vaseaux Lake Waterfront Cabins — history, landscape, and family-friendly lake stays.",
};

export default async function AboutPage() {
  const page = await getPageBySlug("about");
  const heroSection = page?.sections.find((section) => section.sectionKey === "hero");
  const contentSections = page?.sections.filter((section) => section.sectionKey !== "hero") ?? [];
  const images = resolveImages(undefined, 7, [
    "historic",
    "lakeHero",
    "nature",
    "cabinInterior",
    "patioBbq",
    "stars",
    "lakeHero",
  ]);

  return (
    <>
      <PageHero
        title="About"
        eyebrow={heroSection?.eyebrow || "Our story"}
        subtitle={
          heroSection?.subheading ||
          "From the Sundial Motel to today — eight private stays under one historic roof on Vaseaux Lake."
        }
        imageSrc={heroSection?.backgroundImage?.url || "/images/property/property-lakefront-lawn.jpg"}
        imageAlt={heroSection?.backgroundImage?.alt || "Lakefront lawn and beach at Vaseaux Lake"}
      />

      {contentSections.length > 0 ? <PageSectionRenderer sections={contentSections} /> : null}

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <ScrollReveal>
          <h2 className="font-serif text-4xl text-lake-deep">Architectural truth</h2>
          <p className="mt-4 max-w-3xl text-ink/80">
            The property offers eight private cabin-style accommodations within the historic original
            building — not eight detached standalone cabins. Each unit has its own space and character
            while sharing the lakeside setting.
          </p>
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">Between two bluffs, in front of the lake</h2>
        <p className="mt-3 max-w-3xl text-ink/80">
          Eagle&apos;s Bluff on one side, McIntyre Bluff on the other, and Vaseaux Lake directly ahead —
          a classic Okanagan summer composition.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {images.slice(0, 3).map((image) => (
            <SiteImage key={image.src} src={image.src} alt={image.alt} width={600} height={450} frame="postcard" />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">Our story</h2>
        <div className="prose prose-sm mt-4 max-w-none whitespace-pre-line text-ink/80">
          {page?.sections[0]?.body || BRAND_STORY}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">Family-friendly values</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {[
            "Simple comforts and outdoor connection",
            "Quiet evenings and unhurried lake mornings",
            "A small, authentic property — not a large resort",
            "A community of repeat guests and new families",
          ].map((item) => (
            <li key={item} className="rounded-sm border border-sand/70 p-4 text-sm">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">Nature around the property</h2>
        <p className="mt-3 max-w-3xl text-ink/80">
          Ponderosa pines, willow shade, birdlife, and possible bighorn sheep sightings — wildlife is
          never guaranteed, but the setting is always remarkable.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {images.slice(3).map((image) => (
            <SiteImage key={image.src} src={image.src} alt={image.alt} width={500} height={380} />
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/cabins" variant="primary">
            View cabins
          </Button>
          <Button href="/inquire" variant="golden">
            Inquire
          </Button>
        </div>
      </section>
    </>
  );
}
