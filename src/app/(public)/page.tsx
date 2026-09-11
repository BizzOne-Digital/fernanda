import type { Metadata } from "next";
import Link from "next/link";
import { SiteImage } from "@/components/ui/site-image";
import { Button } from "@/components/ui/button";
import { HomeHero } from "@/components/home/home-hero";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { InquiryBar } from "@/components/forms/inquiry-bar";
import { CabinRail } from "@/components/cabins/cabin-rail";
import { getSiteSettings } from "@/lib/data/settings";
import { getCabins } from "@/lib/data/cabins";
import { getTestimonials } from "@/lib/data/testimonials";
import { getSeasons } from "@/lib/data/seasons";
import { PROPERTY_GALLERY } from "@/lib/demo-images";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.general.defaultSeo.title || "Waterfront Cabins on Vaseaux Lake",
    description:
      settings.general.defaultSeo.description ||
      "Family-friendly cabin-style accommodations on Vaseaux Lake near Oliver, BC. Inquire for availability.",
  };
}

const OUTDOOR_SHOWCASE = [
  { src: "/images/property/lake-mcintyre-bluff.jpg", label: "The lake", alt: "McIntyre Bluff reflected on Vaseaux Lake" },
  { src: "/images/property/sunset-chairs.jpg", label: "Sunsets", alt: "Adirondack chairs facing a colourful sunset" },
  { src: "/images/property/wildlife-eagle.jpg", label: "Wildlife", alt: "Bald eagle perched in a pine tree" },
  { src: "/images/property/property-lakefront-lawn.jpg", label: "Open air", alt: "Lakefront lawn and sandy beach" },
];

const GUEST_STORIES = [
  {
    src: "/images/property/lake-shallow-clear.jpg",
    title: "Fishing mornings",
    alt: "Crystal-clear shallow water on Vaseaux Lake",
    text: "Vaseux Lake is known for smallmouth bass. Quiet dawn casts, calm water, and the bluffs rising beyond the shoreline.",
  },
  {
    src: "/images/property/family-lake-canopy.jpg",
    title: "Family lake days",
    alt: "Family enjoying lake activities under a canopy tent",
    text: "Shallow swimming, lawns to spread out, BBQ evenings, and the kind of unhurried summer kids remember.",
  },
  {
    src: "/images/property/family-group-dining.jpg",
    title: "Gatherings that last",
    alt: "Large group dining outdoors by the lake",
    text: "Eight private units under one roof — room for cousins, grandparents, and everyone finding their own rhythm outdoors.",
  },
];

const OUTDOOR_HIGHLIGHTS = [
  "Patios and propane BBQs",
  "Lawn and shallow lake swimming",
  "Complimentary paddleboards",
  "Floating raft",
  "Star-filled night skies",
  "Eagle's Bluff and McIntyre Bluff views",
];

export default async function HomePage() {
  const [settings, cabins, testimonials, seasons] = await Promise.all([
    getSiteSettings(),
    getCabins(),
    getTestimonials(),
    getSeasons(),
  ]);

  return (
    <>
      <HomeHero settings={settings} />

      <section className="relative z-10 w-full min-w-0 px-4 md:px-6">
        <div className="-mt-8 md:-mt-10">
          <InquiryBar cabins={cabins} />
        </div>
      </section>

      {/* Outdoor showcase — lead with what we shine at */}
      <section className="mx-auto mt-16 max-w-7xl px-4 md:mt-20 md:px-6">
        <ScrollReveal>
          <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-lake-medium">
            Vaseaux Lake
          </p>
          <h2 className="mt-2 text-center font-serif text-3xl text-lake-deep md:text-4xl">
            Water, sky, sunsets &amp; wildlife
          </h2>
        </ScrollReveal>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {OUTDOOR_SHOWCASE.map((item) => (
            <figure key={item.src} className="group overflow-hidden rounded-sm">
              <SiteImage
                src={item.src}
                alt={item.alt}
                width={500}
                height={600}
                className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
              />
              <figcaption className="mt-2 text-center text-sm font-medium text-lake-deep">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Subtle audience stories — visual-led, not sales-heavy */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {GUEST_STORIES.map((story) => (
            <ScrollReveal key={story.title}>
              <article className="overflow-hidden rounded-sm bg-white shadow-[0_8px_30px_rgb(30_95_115_/_6%)]">
                <SiteImage
                  src={story.src}
                  alt={story.alt}
                  width={600}
                  height={400}
                  className="aspect-[3/2] w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="font-serif text-xl text-lake-deep">{story.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">{story.text}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* The holiday happens outside */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <ScrollReveal>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-lake-medium">
              Life at the lake
            </p>
            <h2 className="mt-2 font-serif text-3xl text-lake-deep md:text-4xl">
              The holiday happens outside
            </h2>
            <p className="mt-4 text-ink/80 leading-relaxed">
              Between Eagle&apos;s Bluff and McIntyre Bluff, Vaseaux Lake opens onto shallow
              swimming, wide lawns, and long summer evenings. This is where the days unfold.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {OUTDOOR_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink/80">
                  <span className="mt-0.5 text-lake-medium" aria-hidden>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <Button href="/things-to-do" variant="secondary" className="mt-6">
              Explore the area
            </Button>
          </ScrollReveal>
          <div className="grid grid-cols-2 gap-3">
            {PROPERTY_GALLERY.slice(4, 8).map((item) => (
              <SiteImage
                key={item.path}
                src={item.path}
                alt={item.alt}
                width={500}
                height={400}
                className="aspect-square rounded-sm object-cover"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cabins — brief, inviting */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-lake-medium">
              Your stay
            </p>
            <h2 className="mt-2 font-serif text-3xl text-lake-deep md:text-4xl">
              Eight private stays, one historic roof
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-ink/75">
              Private cabin-style units with kitchen, washroom, patio, and BBQ — steps from the
              lake. Not detached cabins, but your own space within a nostalgic lakeside building.
            </p>
          </div>
        </ScrollReveal>
        <div className="mt-10">
          <CabinRail cabins={cabins} />
        </div>
        <div className="mt-6 text-center">
          <Button href="/cabins" variant="secondary">
            Compare all cabins
          </Button>
        </div>
      </section>

      {/* Oliver BC & wine country */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <div className="overflow-hidden rounded-sm bg-gradient-to-br from-sky-bright/20 via-cream to-summer-yellow/15 p-8 md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-lake-medium">
                Oliver, British Columbia
              </p>
              <h2 className="mt-2 font-serif text-3xl text-lake-deep md:text-4xl">
                Wine country &amp; outdoor adventure
              </h2>
              <p className="mt-4 leading-relaxed text-ink/80">
                Minutes from Oliver — the wine capital of Canada — with hiking and biking trails,
                farm-fresh fruit stands in summer, and the full South Okanagan waiting beyond the
                lake.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-ink/75">
                <li>• Local wineries and tasting rooms</li>
                <li>• Hiking at McIntyre Bluff and nearby trails</li>
                <li>• Cycling routes through the valley</li>
                <li>• Fresh cherries, peaches, and produce in season</li>
              </ul>
              <Button href="/things-to-do" variant="golden" className="mt-6">
                Things to do nearby
              </Button>
            </div>
            <SiteImage
              src="/images/property/property-hydrangeas-lawn.jpg"
              alt="Shaded lawn and gardens at the property near Oliver, BC"
              width={700}
              height={500}
              className="aspect-[7/5] w-full rounded-sm object-cover"
            />
          </div>
        </div>
      </section>

      {/* Guest memory + seasons */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-3xl text-lake-deep">Guest memories</h2>
            {testimonials.length > 0 ? (
              <blockquote className="mt-6 rounded-sm border border-sand/60 bg-white p-6 shadow-[0_8px_30px_rgb(30_95_115_/_5%)]">
                <p className="font-serif text-lg leading-relaxed text-lake-deep">
                  &ldquo;{testimonials[0].quote}&rdquo;
                </p>
                <footer className="mt-3 text-sm text-ink/60">
                  — {testimonials[0].guestName}
                  {testimonials[0].location ? `, ${testimonials[0].location}` : ""}
                </footer>
              </blockquote>
            ) : (
              <p className="mt-4 text-sm text-ink/70">
                Guest stories will appear here once published.
              </p>
            )}
            <Link href="/testimonials" className="mt-4 inline-block text-sm text-lake-medium">
              Read more guest stories →
            </Link>
          </div>

          <div>
            <h2 className="font-serif text-3xl text-lake-deep">Seasons &amp; stays</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">
              Weekly high-season rentals from Canada Day through Labour Day. May, June, and
              September may offer shorter stays. Contact us for availability and a quote.
            </p>
            <div className="mt-5 space-y-3">
              {seasons.slice(0, 3).map((season) => (
                <article
                  key={season._id}
                  className="rounded-sm border border-sand/60 bg-white/80 p-4"
                >
                  <h3 className="font-serif text-lg text-lake-deep">{season.name}</h3>
                  <p className="mt-1 text-sm text-ink/70">
                    {season.weeklyAvailabilityText ||
                      season.minimumStayText ||
                      season.publicInquiryNote}
                  </p>
                </article>
              ))}
            </div>
            <Button href="/rates-and-seasons" variant="secondary" className="mt-5">
              View rates &amp; seasons
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto mt-20 max-w-4xl px-4 pb-24 text-center md:px-6">
        <ScrollReveal>
          <h2 className="font-serif text-3xl text-lake-deep md:text-4xl">
            Ready for lake days?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-ink/75">
            Share your dates and we&apos;ll reply with availability and a quote. Your stay is not
            confirmed until we respond.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/inquire" variant="golden">
              Check availability
            </Button>
            <Button href="/contact" variant="secondary">
              Contact us
            </Button>
          </div>
        </ScrollReveal>
      </section>
    </>
  );
}