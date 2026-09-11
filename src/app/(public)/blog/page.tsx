import type { Metadata } from "next";
import Link from "next/link";
import { getBlogPosts } from "@/lib/data/blog";
import { SiteImage } from "@/components/ui/site-image";
import { resolveImage, resolveImages } from "@/lib/data/utils";

export const metadata: Metadata = {
  title: "Journal",
  description: "Lake guides, packing tips, and seasonal notes from Vaseaux Lake.",
};

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const images = resolveImages(undefined, 5, ["lakeHero", "kitchen", "historic", "boats", "stars"]);

  return (
    <>
      <section className="relative min-h-[40vh] overflow-hidden">
        <SiteImage src={images[0].src} alt={images[0].alt} fill priority sizes="100vw" />
        <div className="absolute inset-0 bg-lake-deep/55" />
        <div className="relative mx-auto flex min-h-[40vh] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 text-cream md:px-6">
          <h1 className="font-serif text-4xl md:text-6xl">Journal</h1>
          <p className="mt-3 max-w-2xl">Quiet editorial notes for lake stays and seasons.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        {posts.length === 0 ? (
          <p className="text-ink/70">Published journal posts will appear here after seeding or publishing in admin.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const cover = resolveImage(post.coverImage, "lakeHero", post.title);
              return (
                <article key={post.slug} className="postcard-border overflow-hidden rounded-sm">
                  <div className="relative aspect-[4/3]">
                    <SiteImage src={cover.src} alt={cover.alt} fill sizes="(max-width:768px) 100vw, 33vw" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs uppercase tracking-[0.15em] text-lake-medium">{post.category}</p>
                    <h2 className="mt-1 font-serif text-2xl text-lake-deep">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <p className="mt-2 text-sm text-ink/75">{post.excerpt}</p>
                    {post.isDemo ? (
                      <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-ink/45">Demo post</p>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        )}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {images.slice(1).map((image) => (
            <SiteImage key={image.src} src={image.src} alt={image.alt} width={300} height={220} />
          ))}
        </div>
      </section>
    </>
  );
}
