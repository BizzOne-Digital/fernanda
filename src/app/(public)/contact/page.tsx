import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { getSiteSettings } from "@/lib/data/settings";
import { getPageBySlug } from "@/lib/data/pages";
import { SiteImage } from "@/components/ui/site-image";
import { resolveImage } from "@/lib/data/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Vaseaux Lake Waterfront Cabins by email or phone.",
};

export default async function ContactPage() {
  const [settings, page] = await Promise.all([getSiteSettings(), getPageBySlug("contact")]);
  const heroSection = page?.sections.find((section) => section.sectionKey === "hero");
  const hero = resolveImage(
    heroSection?.backgroundImage ?? page?.sections[0]?.images?.[0],
    "lakeHero",
    "Contact hero",
  );

  return (
    <>
      <section className="relative min-h-[40vh] overflow-hidden">
        <SiteImage src={hero.src} alt={hero.alt} fill priority sizes="100vw" />
        <div className="absolute inset-0 bg-lake-deep/55" />
        <div className="relative mx-auto flex min-h-[40vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 text-cream md:px-6">
          <h1 className="font-serif text-4xl md:text-6xl">Contact</h1>
          <p className="mt-3 max-w-2xl">Questions, availability, and quotes — we&apos;re here to help.</p>
        </div>
      </section>

      <section className="mx-auto grid w-full min-w-0 max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 md:px-6">
        <div>
          <h2 className="font-serif text-3xl text-lake-deep">Reach us directly</h2>
          <ul className="mt-4 space-y-2 text-ink/80">
            <li>
              <a href={`mailto:${settings.contact.email}`} className="text-lake-deep hover:underline">
                {settings.contact.email}
              </a>
            </li>
            <li>
              <a href={settings.contact.phoneLink} className="text-lake-deep hover:underline">
                {settings.contact.phoneDisplay}
              </a>
            </li>
            {settings.contact.facebookUrl ? (
              <li>
                <a
                  href={settings.contact.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-lake-deep hover:underline"
                >
                  Facebook
                </a>
              </li>
            ) : null}
            {settings.contact.address ? <li>{settings.contact.address}</li> : null}
            {settings.contact.businessHours ? <li>{settings.contact.businessHours}</li> : null}
          </ul>
        </div>
        <div className="rounded-sm border border-sand/70 bg-cream p-6">
          <h2 className="font-serif text-2xl text-lake-deep">Send a message</h2>
          <div className="mt-4">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
