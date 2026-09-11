import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { BlogPost } from "@/models";
import { dateInputSchema, publishStatusSchema, seoSchema, slugSchema, imageRefSchema } from "@/lib/validation/common";
import { revalidateBlog } from "@/lib/revalidation";
import { logActivity } from "@/lib/activity";
import { getPagination, handleApiError, jsonError, jsonOk, notArchivedFilter, parseObjectId } from "@/lib/api-utils";

const blogPostSchema = z.object({
  title: z.string().min(1),
  slug: slugSchema,
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
    excerpt: body.excerpt ?? "",
    coverImage: body.coverImage,
    authorDisplayName: body.authorName ?? "Vaseaux Lake Cabins",
    category: body.category,
    tags: body.tags,
    content: body.content ?? "",
    inlineImages: body.inlineImages,
    isDemo: body.isDemo,
    status: body.status,
    publishDate: body.publishedAt ?? undefined,
    seo: body.seo,
  };
}

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPagination(searchParams);
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = { ...notArchivedFilter };
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      BlogPost.find(filter).sort({ publishDate: -1, createdAt: -1 }).skip(skip).limit(limit).lean(),
      BlogPost.countDocuments(filter),
    ]);

    return jsonOk({ items, posts: items, blogs: items, total, page, limit });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = blogPostSchema.parse(await request.json());
    await connectDB();

    const post = await BlogPost.create(mapBlogInput(body));
    revalidateBlog(post.slug);

    await logActivity({
      action: "create",
      entityType: "BlogPost",
      entityId: post._id.toString(),
      entityLabel: post.title,
      summary: `Created blog post ${post.title}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ post, blog: post }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = blogPostSchema.partial().extend({ id: z.string() }).parse(await request.json());
    if (!parseObjectId(body.id)) return jsonError("Invalid blog post id", 400);

    const { id, ...rest } = body;
    await connectDB();
    const post = await BlogPost.findByIdAndUpdate(id, { $set: mapBlogInput(rest as z.infer<typeof blogPostSchema>) }, { new: true, runValidators: true });
    if (!post) return jsonError("Blog post not found", 404);

    revalidateBlog(post.slug);
    return jsonOk({ post, blog: post });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id || !parseObjectId(id)) return jsonError("Invalid blog post id", 400);

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
