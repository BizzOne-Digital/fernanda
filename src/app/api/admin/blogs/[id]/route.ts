import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { BlogPost } from "@/models";
import { dateInputSchema, publishStatusSchema, seoSchema, slugSchema, imageRefSchema } from "@/lib/validation/common";
import { revalidateBlog } from "@/lib/revalidation";
import { handleApiError, jsonError, jsonOk, parseObjectId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

const blogPostSchema = z.object({
  title: z.string().min(1).optional(),
  slug: slugSchema.optional(),
  excerpt: z.string().optional(),
  coverImage: imageRefSchema.optional().nullable(),
  authorName: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  content: z.string().optional(),
  inlineImages: z.array(imageRefSchema).optional(),
  isDemo: z.boolean().optional(),
  status: publishStatusSchema.optional(),
  publishedAt: dateInputSchema.optional().nullable(),
  seo: seoSchema.optional(),
});

function mapBlogInput(body: z.infer<typeof blogPostSchema>) {
  return {
    title: body.title,
    slug: body.slug,
    excerpt: body.excerpt,
    coverImage: body.coverImage,
    authorDisplayName: body.authorName,
    category: body.category,
    tags: body.tags,
    content: body.content,
    inlineImages: body.inlineImages,
    isDemo: body.isDemo,
    status: body.status,
    publishDate: body.publishedAt ?? undefined,
    seo: body.seo,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid blog post id", 400);

    await connectDB();
    const post = await BlogPost.findById(id).lean();
    if (!post) return jsonError("Blog post not found", 404);

    return jsonOk({
      post,
      blog: {
        ...post,
        authorName: (post as { authorDisplayName?: string }).authorDisplayName,
        publishedAt: (post as { publishDate?: Date }).publishDate,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    const body = blogPostSchema.parse(await request.json());
    if (!parseObjectId(id)) return jsonError("Invalid blog post id", 400);

    await connectDB();
    const post = await BlogPost.findByIdAndUpdate(id, { $set: mapBlogInput(body) }, { new: true, runValidators: true });
    if (!post) return jsonError("Blog post not found", 404);

    revalidateBlog(post.slug);
    return jsonOk({ post, blog: post });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid blog post id", 400);

    await connectDB();
    const post = await BlogPost.findByIdAndUpdate(
      id,
      { $set: { isArchived: true, archivedAt: new Date() } },
      { new: true },
    );
    if (!post) return jsonError("Blog post not found", 404);

    revalidateBlog(post.slug);
    return jsonOk({ archived: true });
  } catch (error) {
    return handleApiError(error);
  }
}
