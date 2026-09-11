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
    accent: "from-sky-bright/30 to-lake-medium/10",
  },
  {
    src: "/images/property/family-lake-canopy.jpg",
    title: "Family lake days",
    alt: "Family enjoying lake activities under a canopy tent",
    text: "Shallow swimming, lawns to spread out, BBQ evenings, and the kind of unhurried summer kids remember.",
    accent: "from-summer-yellow/30 to-golden/10",
  },
  {
    src: "/images/property/family-group-dining.jpg",
    title: "Gatherings that last",
    alt: "Large group dining outdoors by the lake",
    text: "Eight private units under one roof — room for cousins, grandparents, and everyone finding their own rhythm outdoors.",
    accent: "from-forest/25 to-sky-bright/15",
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

const EXPERIENCE_STATS = [
  { value: "8", label: "Private cabins" },
  { value: "1960s", label: "Lakeside heritage" },
  { value: "∞", label: "Summer sunsets" },
  { value: "Oliver", label: "Wine country nearby" },
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

      {/* Experience strip */}
      <section className="mx-auto mt-14 max-w-7xl px-4 md:px-6">
        <div className="grid grid-cols-2 gap-4 rounded-sm border border-sky-bright/40 bg-gradient-to-r from-sky-bright/20 via-white to-summer-yellow/20 p-6 shadow-[0_8px_32px_rgb(77_184_212_/_10%)] md:grid-cols-4 md:gap-6 md:p-8">
          {EXPERIENCE_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl text-lake-deep md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-lake-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Outdoor showcase */}
      <section className="section-glow mx-auto mt-20 max-w-7xl px-4 py-16 md:px-6">
        <ScrollReveal>
          <p className="text-center text-sm font-medium uppercase tracking-[0.2em] text-golden">
            Vaseaux Lake
          </p>
          <h2 className="mt-2 text-center font-serif text-3xl text-lake-deep md:text-4xl">
            Water, sky, sunsets &amp; wildlife
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-ink/70">
            Step outside and the Okanagan summer opens up — bluffs, calm water, and long golden evenings.
          </p>
        </ScrollReveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {OUTDOOR_SHOWCASE.map((item) => (
            <figure key={item.src} className="group relative overflow-hidden rounded-sm card-lift">
              <SiteImage
                src={item.src}
                alt={item.alt}
                width={500}
                height={600}
                className="aspect-[4/5] w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lake-deep/60 via-transparent to-transparent opacity-80 transition group-hover:opacity-90" />
              <figcaption className="absolute bottom-4 left-0 right-0 text-center font-serif text-lg text-cream">
                {item.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Guest stories */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-3">
          {GUEST_STORIES.map((story) => (
            <ScrollReveal key={story.title}>
              <article className={`card-lift overflow-hidden rounded-sm bg-gradient-to-br ${story.accent} shadow-[0_8px_30px_rgb(42_125_148_/_8%)]`}>
                <SiteImage
                  src={story.src}
                  alt={story.alt}
                  width={600}
                  height={400}
                  className="aspect-[3/2] w-full object-cover"
                />
                <div className="bg-white/90 p-5 backdrop-blur-sm">
                  <h3 className="font-serif text-xl text-lake-deep">{story.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75">{story.text}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Life at the lake */}
      <section className="section-summer mx-auto mt-20 max-w-7xl rounded-sm px-4 py-16 md:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <ScrollReveal>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-golden">
              Life at the lake
            </p>
            <h2 className="mt-2 font-serif text-3xl text-lake-deep md:text-4xl">
              The holiday happens outside
            </h2>
            <p className="mt-4 leading-relaxed text-ink/80">
              Between Eagle&apos;s Bluff and McIntyre Bluff, Vaseaux Lake opens onto shallow
              swimming, wide lawns, and long summer evenings. This is where the days unfold.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {OUTDOOR_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink/80">
                  <span className="mt-0.5 text-golden" aria-hidden>✦</span>
                  {item}
                </li>
              ))}
            </ul>
            <Button href="/things-to-do" variant="golden" className="mt-6">
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
                className="aspect-square rounded-sm object-cover shadow-md transition hover:scale-[1.02]"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cabins */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <ScrollReveal>
          <div className="text-center">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-golden">
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

      {/* Oliver BC */}
      <section className="mx-auto mt-20 max-w-7xl px-4 md:px-6">
        <div className="overflow-hidden rounded-sm border border-summer-yellow/40 bg-gradient-to-br from-summer-yellow/25 via-cream to-sky-bright/25 p-8 shadow-[0_12px_40px_rgb(240_180_41_/_12%)] md:p-12">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-golden">
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
                <li className="flex items-center gap-2">
                  <span className="text-golden">✦</span> Local wineries and tasting rooms
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-golden">✦</span> Hiking at McIntyre Bluff and nearby trails
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-golden">✦</span> Cycling routes through the valley
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-golden">✦</span> Fresh cherries, peaches, and produce in season
                </li>
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
              className="aspect-[7/5] w-full rounded-sm object-cover shadow-lg"
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
              <blockquote className="mt-6 rounded-sm border border-sky-bright/50 bg-white p-6 shadow-[0_8px_30px_rgb(77_184_212_/_10%)]">
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
            <Link href="/testimonials" className="mt-4 inline-block text-sm font-medium text-lake-medium hover:text-lake-deep">
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
                  className="rounded-sm border border-lake-medium/20 bg-gradient-to-r from-white to-sky-bright/10 p-4 transition hover:border-lake-medium/40"
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
      <section className="mx-auto mt-20 max-w-7xl px-4 pb-24 md:px-6">
        <div className="rounded-sm bg-gradient-to-br from-lake-medium via-lake-deep to-lake-deep px-6 py-14 text-center shadow-[0_16px_48px_rgb(42_125_148_/_25%)] md:px-12 md:py-16">
          <ScrollReveal>
            <h2 className="font-serif text-3xl text-cream md:text-4xl">
              Ready for lake days?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-cream/85">
              Share your dates and we&apos;ll reply with availability and a quote. Your stay is not
              confirmed until we respond.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button href="/inquire" variant="golden">
                Check availability
              </Button>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full border border-cream/50 bg-cream/10 px-5 py-2.5 text-sm font-medium text-cream backdrop-blur-sm transition hover:bg-cream/20"
              >
                Contact us
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
