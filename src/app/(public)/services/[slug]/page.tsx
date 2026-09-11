import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getServiceBySlug, getServices, getServiceSlugs } from "@/lib/data/services";
import { SiteImage } from "@/components/ui/site-image";
import { Button } from "@/components/ui/button";
import { LightboxGrid } from "@/components/gallery/lightbox";
import { resolveImage, resolveImages } from "@/lib/data/utils";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Experience not found" };
  return {
    title: service.seo.title || service.title,
    description: service.seo.description || service.shortDescription,
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const [service, services] = await Promise.all([getServiceBySlug(slug), getServices()]);
  if (!service) notFound();

  const hero = resolveImage(service.heroImage || service.cardImage, "lakeHero", service.title);
  const images = resolveImages(service.sectionImages, 5, ["lakeHero", "boats", "patioBbq", "stars", "nature"]);
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <section className="relative min-h-[55vh] overflow-hidden">
        <SiteImage src={hero.src} alt={hero.alt} fill priority sizes="100vw" />
        <div className="absolute inset-0 bg-lake-deep/55" />
        <div className="relative mx-auto flex min-h-[55vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 text-cream md:px-6">
          {service.heroEyebrow ? (
            <p className="text-xs uppercase tracking-[0.2em] text-sand">{service.heroEyebrow}</p>
          ) : null}
          <h1 className="font-serif text-4xl md:text-6xl">{service.heroHeading || service.title}</h1>
          <p className="mt-3 max-w-2xl">{service.heroSubheading || service.shortDescription}</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">Overview</h2>
        <p className="mt-3 text-ink/80">{service.overview}</p>
        <ul className="mt-6 space-y-2">
          {service.benefits.map((benefit) => (
            <li key={benefit} className="text-sm text-ink/75">
              • {benefit}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto max-w-7xl px-4 md:px-6">
        <LightboxGrid images={images.map((image) => ({ src: image.src, alt: image.alt }))} />
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">Experience details</h2>
        <p className="mt-3 text-ink/80">{service.experienceDetails}</p>
        <h3 className="mt-8 font-serif text-2xl text-lake-deep">How to inquire</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-ink/75">
          {service.inquirySteps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-ink/70">{service.seasonalNotes}</p>
        <p className="mt-3 text-sm text-ink/70">{service.safetyPolicies}</p>
      </section>

      {service.faqs.length ? (
        <section className="mx-auto max-w-4xl px-4 md:px-6">
          <h2 className="font-serif text-3xl text-lake-deep">Important considerations</h2>
          <div className="mt-4 space-y-3">
            {service.faqs.map((faq) => (
              <details key={faq.question} className="rounded-sm border border-sand/70 p-4">
                <summary>{faq.question}</summary>
                <p className="mt-2 text-sm text-ink/75">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <h2 className="font-serif text-3xl text-lake-deep">Related experiences</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {related.map((item) => (
            <Link key={item.slug} href={`/services/${item.slug}`} className="rounded-full border border-sand px-4 py-2 text-sm">
              {item.title}
            </Link>
          ))}
        </div>
        <Button href={`/inquire?service=${service.slug}`} variant="golden" className="mt-8">
          Inquire about {service.title}
        </Button>
      </section>
    </>
  );
}
