import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/layout/page-hero";
import { ResortSectionHeading } from "@/components/layout/resort-section-heading";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { SiteImage } from "@/components/ui/site-image";
import { getPageBySlug } from "@/lib/data/pages";
import { getSiteSettings } from "@/lib/data/settings";
import { SocialLinks } from "@/components/layout/social-links";
import { resolveImage } from "@/lib/data/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Vaseaux Lake Waterfront Cabins by email, phone, or message form.",
};

const CONTACT_TOPICS = [
  "Availability and date questions",
  "Rates and weekly vs. shorter stays",
  "Cabins, amenities, and what to bring",
  "Directions and arrival details",
];

export default async function ContactPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getPageBySlug("contact")]);
  const heroSection = page?.sections.find((section) => section.sectionKey === "hero");
  const hero = resolveImage(
    heroSection?.backgroundImage ?? page?.sections[0]?.images?.[0],
    "lakeHero",
    "Contact hero",
  );
  const sideImage = resolveImage(
    heroSection?.images?.[1],
    "patioBbq",
    "Guests enjoying the lakefront property",
  );

  const responseNote =
    settings.booking?.responseTimeWording ||
    "We aim to respond within one to two business days.";

  return (
    <>
      <PageHero
        title={heroSection?.heading || "Contact us"}
        eyebrow="Get in touch"
        subtitle={
          heroSection?.subheading ||
          "Questions before you inquire? We are happy to help with availability, cabins, and planning your lake stay."
        }
        imageSrc={hero.src}
        imageAlt={hero.alt}
      />

      <section className="resort-band border-b border-sand/80">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4 md:px-6">
          <ScrollReveal direction="up" className="resort-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lake-medium">Email</p>
            <a
              href={`mailto:${settings.contact.email}`}
              className="mt-2 block font-serif text-lg text-resort-navy hover:text-lake-medium"
            >
              {settings.contact.email}
            </a>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.05} className="resort-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lake-medium">Phone</p>
            <a
              href={settings.contact.phoneLink}
              className="mt-2 block font-serif text-lg text-resort-navy hover:text-lake-medium"
            >
              {settings.contact.phoneDisplay}
            </a>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.1} className="resort-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lake-medium">Hours</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              {settings.contact.businessHours || "Inquiries welcome by email or phone."}
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.15} className="resort-card p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lake-medium">Location</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              {settings.contact.address || "Vaseaux Lake · near Oliver, BC"}
            </p>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2} className="resort-card p-5 sm:col-span-2 lg:col-span-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lake-medium">Social</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              Photos, updates, and lake days from Vaseaux Lake Waterfront Cabins.
            </p>
            <SocialLinks
              className="mt-4"
              linkClassName="text-sm font-medium text-lake-medium hover:underline"
            />
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <ScrollReveal direction="left">
            <ResortSectionHeading
              title="Reach us directly"
              subtitle={responseNote}
              align="left"
            />
            <ul className="mt-8 space-y-3">
              {CONTACT_TOPICS.map((topic) => (
                <li
                  key={topic}
                  className="flex gap-3 rounded-sm border border-sand/70 bg-cream/80 px-4 py-3 text-sm text-ink/85"
                >
                  <span
                    aria-hidden
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-golden/20 text-[11px] font-semibold text-resort-navy"
                  >
                    ✓
                  </span>
                  {topic}
                </li>
              ))}
            </ul>

            <div className="resort-card-dark mt-8 p-6">
              <h3 className="font-serif text-xl text-cream">Ready to book?</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/85">
                For dates and party size, use our reservation request form — we will reply with
                availability and a quote.
              </p>
              <Link href="/inquire" className="resort-btn-primary mt-5 inline-flex">
                Request a reservation
              </Link>
            </div>

            <div className="mt-8 overflow-hidden rounded-sm">
              <SiteImage
                src={sideImage.src}
                alt={sideImage.alt}
                width={720}
                height={480}
                className="aspect-[3/2] w-full object-cover"
                frame="postcard"
                label="On the lake"
              />
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.08}>
            <div className="resort-card sticky top-28 p-6 md:p-8 lg:p-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-lake-medium">
                Message form
              </p>
              <h2 className="mt-2 font-serif text-3xl text-resort-navy">Send a message</h2>
              <p className="mt-3 text-sm leading-relaxed text-ink/75">
                General questions, special requests, or follow-ups — we read every note personally.
              </p>
              <div className="mt-6 border-t border-sand/80 pt-6">
                <ContactForm />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
