import type { Metadata } from "next";
import Link from "next/link";
import { SiteImage } from "@/components/ui/site-image";
import { HomeHero } from "@/components/home/home-hero";
import { ResortSectionHeading } from "@/components/layout/resort-section-heading";
import { InquiryBar } from "@/components/forms/inquiry-bar";
import { CabinRail } from "@/components/cabins/cabin-rail";
import { getSiteSettings } from "@/lib/data/settings";
import { getCabins } from "@/lib/data/cabins";
import { getTestimonials } from "@/lib/data/testimonials";
import { getAttractions } from "@/lib/data/attractions";
import { BRAND_STORY } from "@/lib/seed/constants";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.general.defaultSeo.title || "Waterfront Cabins on Vaseaux Lake",
    description:
      settings.general.defaultSeo.description ||
      "Family-friendly cabin-style accommodations on Vaseaux Lake near Oliver, BC. Inquire for availability.",
  };
}

const QUICK_LINKS = [
  {
    href: "/cabins",
    title: "Cabins",
    text: "Eight private units (5–12) with kitchen, washroom, patio, and BBQ.",
    image: "/images/property/property-willow-lawn.jpg",
    alt: "Lakefront lawn with willows and cliff views",
  },
  {
    href: "/services",
    title: "Stay types",
    text: "Weekly high-season stays, family getaways, reunions, and fishing trips.",
    image: "/images/property/family-paddleboard-pov.jpg",
    alt: "Paddleboarding on Vaseaux Lake",
  },
  {
    href: "/things-to-do",
    title: "Activities",
    text: "Swimming, paddleboards, Oliver wine country, hiking, and local fruit stands.",
    image: "/images/property/sunset-fire-pit.jpg",
    alt: "Lakeside fire pit at sunset",
  },
];

export default async function HomePage() {
  const [settings, cabins, testimonials, attractions] = await Promise.all([
    getSiteSettings(),
    getCabins(),
    getTestimonials(),
    getAttractions(),
  ]);

  const welcomeParagraph = BRAND_STORY.split("\n\n")[0];
  const activityPreview = attractions.filter((a) => a.status === "published").slice(0, 8);

  return (
    <>
      <HomeHero settings={settings} />

      <section className="resort-band">
        <div className="mx-auto grid max-w-7xl divide-y divide-sand/80 md:grid-cols-3 md:divide-x md:divide-y-0">
          {QUICK_LINKS.map((item, index) => (
            <ScrollReveal
              key={item.href}
              direction={index === 0 ? "left" : index === 1 ? "up" : "right"}
              className="h-full"
            >
              <Link href={item.href} className="group block h-full p-6 md:p-8 hover:bg-sand/20">
                <h2 className="font-serif text-2xl text-resort-navy">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">{item.text}</p>
                <span className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.16em] text-lake-medium group-hover:text-golden">
                  More info →
                </span>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        <ScrollReveal direction="up">
          <ResortSectionHeading
            title="Welcome to Vaseaux Lake Waterfront Cabins"
            subtitle="Situated on Vaseaux Lake near Oliver — shallow, calm water, wide lawns, and bluff views in the heart of the South Okanagan."
          />
        </ScrollReveal>
        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <ScrollReveal direction="left">
            <div className="space-y-4 text-sm leading-relaxed text-ink/80 md:text-base">
              <p>{welcomeParagraph}</p>
              <p>
                Guests stay in cozy private cabin-style units within a historic building. The heart of
                the experience is outside: patios, BBQs, the lawn, beach, paddleboards, and star-filled
                summer skies.
              </p>
              <Link href="/about" className="resort-btn-outline inline-flex">More about us</Link>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.08}>
            <SiteImage
              src="/images/property/family-picnic-sunset.jpg"
              alt="Guests dining outdoors by the lake"
              width={800}
              height={560}
              className="aspect-[5/3.5] w-full object-cover"
            />
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-white py-14 md:py-16">
        <ScrollReveal direction="up" className="mx-auto max-w-7xl px-4 md:px-6">
          <ResortSectionHeading title="Accommodations" subtitle="Private cabin-style units 5–12 under one historic roof." />
          <div className="mt-10">
            <CabinRail cabins={cabins} />
          </div>
          <div className="mt-8 text-center">
            <Link href="/cabins" className="resort-btn-primary">View all cabins</Link>
          </div>
        </ScrollReveal>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <ScrollReveal direction="up">
          <ResortSectionHeading
            title="Guest reviews"
            subtitle="We love to hear from families who make memories here."
          />
        </ScrollReveal>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(testimonials.length > 0 ? testimonials.slice(0, 6) : []).map((item, index) => (
            <ScrollReveal key={item._id} direction="up" delay={index * 0.06}>
              <blockquote className="resort-card h-full p-6">
                <p className="font-serif text-lg leading-relaxed text-resort-navy">&ldquo;{item.quote}&rdquo;</p>
                <footer className="mt-4 text-sm text-ink/60">
                  — {item.guestName}
                  {item.location ? `, ${item.location}` : ""}
                </footer>
              </blockquote>
            </ScrollReveal>
          ))}
          {testimonials.length === 0 ? (
            <p className="text-sm text-ink/70 md:col-span-3">Guest reviews will appear here once published.</p>
          ) : null}
        </div>
        <ScrollReveal direction="up" className="mt-8 text-center">
          <Link href="/testimonials" className="resort-btn-outline">Read all reviews</Link>
        </ScrollReveal>
      </section>

      <section className="bg-sand/30 py-14 md:py-16">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <ScrollReveal direction="up">
            <ResortSectionHeading title="So much to see & do" subtitle="On the lake and in Oliver wine country." />
          </ScrollReveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {activityPreview.map((item, index) => (
              <ScrollReveal
                key={item._id}
                direction={index % 2 === 0 ? "left" : "right"}
                delay={(index % 4) * 0.05}
              >
                <Link
                  href={`/things-to-do#${item.slug}`}
                  className="resort-card block h-full p-5 hover:border-lake-medium/40"
                >
                  <h3 className="font-serif text-lg text-resort-navy">{item.title}</h3>
                  {item.summary ? (
                    <p className="mt-2 line-clamp-3 text-sm text-ink/70">{item.summary}</p>
                  ) : null}
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <ScrollReveal direction="up" className="mt-8 text-center">
            <Link href="/things-to-do" className="resort-btn-primary">Explore activities</Link>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <ScrollReveal direction="left">
            <div className="resort-card h-full p-8">
              <h2 className="font-serif text-2xl text-resort-navy">Property policies</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                Packing, quiet hours, and stay guidelines help every guest enjoy the lake. Review our
                policies before you arrive.
              </p>
              <Link href="/policies" className="resort-btn-outline mt-6 inline-flex">View policies</Link>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="right" delay={0.08}>
            <div className="resort-card h-full p-8 bg-resort-navy text-cream">
              <h2 className="font-serif text-2xl">Reserve your vacation</h2>
              <p className="mt-3 text-sm leading-relaxed text-cream/85">
                Share your dates and party size — we will reply with availability and a quote. Your
                stay is not confirmed until we respond.
              </p>
              <Link href="/inquire" className="resort-btn-primary mt-6 inline-flex">Request a reservation</Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="resort-band py-10">
        <ScrollReveal direction="up" className="mx-auto max-w-5xl px-4 md:px-6">
          <InquiryBar cabins={cabins} />
        </ScrollReveal>
      </section>
    </>
  );
}
