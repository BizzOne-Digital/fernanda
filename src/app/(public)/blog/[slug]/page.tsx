import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogSlugs } from "@/lib/data/blog";
import { SiteImage } from "@/components/ui/site-image";
import { LightboxGrid } from "@/components/gallery/lightbox";
import { resolveImage, resolveImages } from "@/lib/data/utils";
import { sanitizeHtml } from "@/lib/utils/sanitize";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.seo.title || post.title,
    description: post.seo.description || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  const cover = resolveImage(post.coverImage, "lakeHero", post.title);
  const inline = resolveImages(post.inlineImages, 5, ["kitchen", "boats", "patioBbq", "stars", "nature"]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.authorDisplayName },
    datePublished: post.publishDate,
    image: cover.src,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article>
        <section className="relative min-h-[45vh] overflow-hidden">
          <SiteImage src={cover.src} alt={cover.alt} fill priority sizes="100vw" />
          <div className="absolute inset-0 bg-lake-deep/55" />
          <div className="relative mx-auto flex min-h-[45vh] max-w-4xl flex-col justify-end px-4 pb-10 pt-24 text-cream md:px-6">
            <p className="text-xs uppercase tracking-[0.2em] text-sand">{post.category}</p>
            <h1 className="mt-2 font-serif text-4xl md:text-6xl">{post.title}</h1>
            <p className="mt-3 text-sm text-cream/85">By {post.authorDisplayName}</p>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-10 md:px-6">
          <p className="text-lg text-ink/80">{post.excerpt}</p>
          <div
            className="prose prose-sm mt-8 max-w-none text-ink/85"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-16 md:px-6">
          <LightboxGrid images={inline.map((image) => ({ src: image.src, alt: image.alt }))} />
        </section>
      </article>
    </>
  );
}
