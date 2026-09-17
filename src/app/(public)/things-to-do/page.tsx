import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ThingsToDoGuide } from "@/components/things-to-do/things-to-do-guide";
import { SiteImage } from "@/components/ui/site-image";
import { Button } from "@/components/ui/button";
import { getAttractions } from "@/lib/data/attractions";
import { getPageBySlug } from "@/lib/data/pages";
import { getSiteSettings } from "@/lib/data/settings";
import { resolveImage, resolveImages } from "@/lib/data/utils";

export const metadata: Metadata = {
  title: "Things to Do",
  description:
    "On-property lake days and local experiences near Vaseaux Lake and Oliver, BC wine country.",
};

export const dynamic = "force-dynamic";

const ON_PROPERTY_ACTIVITIES = [
  "Fishing & shallow-lake swimming",
  "Complimentary boats & paddleboards",
  "Floating raft & lawn gatherings",
  "Patios, BBQs & evening skies",
  "Birdwatching & stargazing",
  "Family time without leaving the property",
];

const LANDSCAPE_POINTS = [
  "Vaseaux Lake directly ahead of the property",
  "Eagle's Bluff on one side, McIntyre Bluff on the other",
  "Ponderosa pines and willow shade along the shore",
  "Possible bighorn sheep and bird sightings — never guaranteed",
];

export default async function ThingsToDoPage() {
  const [attractions, page, settings] = await Promise.all([
    getAttractions(),
    getPageBySlug("things-to-do"),
    getSiteSettings(),
  ]);

  const heroSection = page?.sections.find((section) => section.sectionKey === "hero");
  const onPropertySection = page?.sections.find((section) => section.sectionKey === "on-property");
  const landscapeSection = page?.sections.find((section) => section.sectionKey === "landscape");

  const heroImage = resolveImage(
    heroSection?.backgroundImage,
    "nature",
    heroSection?.heading || "Things to do",
  );
  const onPropertyImages = resolveImages(onPropertySection?.images, 4, [
    "lakeHero",
    "patioBbq",
    "nature",
    "stars",
  ]);
  const landscapeImages = resolveImages(
    landscapeSection?.images ??
      (landscapeSection?.foregroundImage ? [landscapeSection.foregroundImage] : undefined),
    3,
    ["lakeHero", "nature", "historic"],
  );

  const featured = attractions.filter((item) => item.featured);

  return (
    <>
      <PageHero
        title={heroSection?.heading || "Things to do"}
        eyebrow="Local guide"
        subtitle={
          heroSection?.subheading ||
          "Lake days at the property, wildlife between the bluffs, and wine country adventures in Oliver and the South Okanagan."
        }
        imageSrc={heroImage.src}
        imageAlt={heroImage.alt || "Vaseaux Lake activities"}
      />

      <section className="border-b border-sand/40 bg-gradient-to-b from-sand/20 to-cream">
        <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
          <ScrollReveal>
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-lake-medium">
                  On property
                </p>
                <h2 className="mt-2 font-serif text-3xl text-balance text-lake-deep md:text-4xl">
                  Lake days without leaving home
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink/78 md:text-base">
                  The heart of a Vaseaux Lake stay happens outside — on the lawn, at the water&apos;s
                  edge, and under wide Okanagan skies. Equipment availability and lake conditions vary
                  by season.
                </p>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {ON_PROPERTY_ACTIVITIES.map((activity) => (
                    <li
                      key={activity}
                      className="flex items-start gap-3 rounded-sm border border-sand/60 bg-cream/85 p-3 text-sm leading-snug text-ink/85"
                    >
                      <span
                        aria-hidden
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lake-deep/10 text-[11px] font-semibold text-lake-deep"
                      >
                        ✓
                      </span>
                      {activity}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <SiteImage
                  src={onPropertyImages[0].src}
                  alt={onPropertyImages[0].alt}
                  width={700}
                  height={520}
                  frame="postcard"
                  label="On the water"
                  className="col-span-2 aspect-[16/10] w-full"
                />
                {onPropertyImages.slice(1).map((image, index) => (
                  <SiteImage
                    key={image.src}
                    src={image.src}
                    alt={image.alt}
                    width={400}
                    height={320}
                    frame="postcard"
                    label={index === 0 ? "Patios" : index === 1 ? "Nature" : "Night sky"}
                    className="aspect-[4/3] w-full"
                  />
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto w-full min-w-0 max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="overflow-hidden rounded-sm border border-sand/70 bg-gradient-to-br from-lake-deep/[0.04] via-cream to-sand/25">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-lake-medium">
                Landscape
              </p>
              <h2 className="mt-2 font-serif text-3xl text-lake-deep md:text-4xl">
                Between two bluffs, in front of the lake
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink/78 md:text-base">
                {settings.property.landscapeDescriptors?.length
                  ? settings.property.landscapeDescriptors.join(" · ")
                  : "Vaseaux Lake · Eagle's Bluff · McIntyre Bluff · Ponderosa pines and willow shade"}
              </p>
              <ul className="mt-6 space-y-3">
                {LANDSCAPE_POINTS.map((point) => (
                  <li key={point} className="flex gap-3 text-sm text-ink/80">
                    <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-golden" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-2 border-t border-sand/50 p-3 sm:p-4 lg:border-l lg:border-t-0">
              {landscapeImages.map((image, index) => (
                <SiteImage
                  key={image.src}
                  src={image.src}
                  alt={image.alt}
                  width={400}
                  height={500}
                  frame="postcard"
                  className={index === 0 ? "col-span-3 aspect-[16/9] w-full" : "aspect-[3/4] w-full"}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {featured.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 pt-6 md:px-6 md:pt-8">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-golden">
            Start here
          </p>
          <h2 className="mt-2 font-serif text-3xl text-lake-deep">Featured experiences</h2>
          <p className="mt-3 max-w-2xl text-sm text-ink/75">
            Owner-verified highlights for guests planning their first days on the lake.
          </p>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {featured.slice(0, 2).map((item) => {
              const featuredImage = resolveImage(
                item.images?.[0],
                item.category === "Nature" ? "nature" : "lakeHero",
                item.title,
              );
              return (
              <article
                key={item._id}
                className="postcard-border grid overflow-hidden rounded-sm bg-cream md:grid-cols-[0.95fr_1.05fr]"
              >
                <div className="relative min-h-[220px] overflow-hidden md:min-h-[280px]">
                  <SiteImage
                    src={featuredImage.src}
                    alt={featuredImage.alt}
                    fill
                    sizes="(max-width:768px) 100vw, 40vw"
                  />
                </div>
                <div className="flex flex-col justify-center p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-lake-medium">{item.category}</p>
                  <h3 className="mt-2 font-serif text-2xl text-lake-deep">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink/75">{item.summary}</p>
                </div>
              </article>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="mx-auto w-full min-w-0 max-w-7xl px-4 pt-8 pb-4 md:px-6 md:py-14">
        <div className="max-w-2xl">
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-lake-medium">
            Explore
          </p>
          <h2 className="mt-2 font-serif text-3xl text-lake-deep md:text-4xl">Local attractions & day trips</h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/75 md:text-base">
            Filter by category to browse verified guides and owner-reviewed suggestions. Draft listings
            are marked clearly — always confirm details before you go.
          </p>
        </div>
        <div className="mt-6 md:mt-8">
          <ThingsToDoGuide attractions={attractions} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-8 pt-6 md:px-6 md:pb-12 md:pt-10">
        <div className="overflow-hidden rounded-sm bg-lake-deep text-cream">
          <div className="h-1 bg-gradient-to-r from-transparent via-golden/80 to-transparent" />
          <div className="grid gap-6 px-5 py-8 md:grid-cols-[1.2fr_0.8fr] md:gap-8 md:px-10 md:py-12">
            <div>
              <p className="text-[0.68rem] font-medium uppercase tracking-[0.28em] text-golden">
                Plan your stay
              </p>
              <h2 className="mt-2 font-serif text-3xl md:text-4xl">Ready for your lake days?</h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-cream/80">
                Share your dates and guest count — we&apos;ll reply with availability and a personalized
                quote. Nothing is confirmed until we respond directly.
              </p>
            </div>
            <div className="flex flex-col justify-center gap-3 sm:flex-row md:flex-col lg:flex-row">
              <Button href="/inquire" variant="golden" className="justify-center">
                Check availability
              </Button>
              <Button href="/gallery" variant="secondary" className="justify-center border-cream/25 bg-cream/10 text-cream hover:bg-cream/20">
                View gallery
              </Button>
              <Link
                href="/services"
                className="inline-flex items-center justify-center text-sm text-cream/80 underline-offset-2 hover:text-golden hover:underline"
              >
                Explore stay types →
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-xs text-ink/50 md:mt-4">
          {settings.property.generalSafetyNotes ||
            "Lake conditions, wildlife sightings, and equipment availability vary by season and are never guaranteed."}
        </p>
      </section>
    </>
  );
}
