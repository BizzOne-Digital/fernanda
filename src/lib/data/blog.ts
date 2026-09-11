import { unstable_cache } from "next/cache";
import connectDB from "@/lib/mongodb";
import BlogPost, { type IBlogPost } from "@/models/BlogPost";
import { toPlain, type PlainModel } from "@/lib/data/utils";

export type BlogPostData = PlainModel<IBlogPost>;

async function fetchPublishedPosts(): Promise<BlogPostData[]> {
  try {
    await connectDB();
    const posts = await BlogPost.find({
      status: "published",
      isArchived: false,
    })
      .sort({ publishDate: -1, createdAt: -1 })
      .lean();
    return toPlain(posts) as BlogPostData[];
  } catch {
    return [];
  }
}

async function fetchPostBySlug(slug: string): Promise<BlogPostData | null> {
  try {
    await connectDB();
    const post = await BlogPost.findOne({
      slug,
      status: "published",
      isArchived: false,
    }).lean();
    return post ? (toPlain(post) as BlogPostData) : null;
  } catch {
    return null;
  }
}

export const getBlogPosts = unstable_cache(fetchPublishedPosts, ["blog-posts"], {
  tags: ["blog"],
  revalidate: 300,
});

export async function getBlogPostBySlug(slug: string) {
  return unstable_cache(
    () => fetchPostBySlug(slug),
    [`blog-${slug}`],
    { tags: ["blog", `blog-${slug}`], revalidate: 300 },
  )();
}

export async function getBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts();
  return posts.map((post) => post.slug);
}
