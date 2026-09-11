import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { GalleryCategory, MediaAsset } from "@/models";
import { publishStatusSchema, slugSchema, imageRefSchema } from "@/lib/validation/common";
import { revalidateGallery } from "@/lib/revalidation";
import { logActivity } from "@/lib/activity";
import { handleApiError, jsonError, jsonOk, notArchivedFilter, parseObjectId } from "@/lib/api-utils";

const galleryCategorySchema = z.object({
  name: z.string().min(1),
  slug: slugSchema,
  description: z.string().optional(),
  coverImage: imageRefSchema.optional().nullable(),
  sortOrder: z.coerce.number().optional(),
  status: publishStatusSchema.optional(),
});

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");

    const [categories, media] = await Promise.all([
      GalleryCategory.find(notArchivedFilter).sort({ sortOrder: 1 }).lean(),
      MediaAsset.find({
        ...notArchivedFilter,
        ...(categoryId ? { categoryId } : {}),
      })
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean(),
    ]);

    return jsonOk({ categories, media, assets: media, items: media });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = galleryCategorySchema.parse(await request.json());
    await connectDB();

    const category = await GalleryCategory.create(body);
    revalidateGallery();

    await logActivity({
      action: "create",
      entityType: "GalleryCategory",
      entityId: category._id.toString(),
      entityLabel: category.name,
      summary: `Created gallery category ${category.name}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ category }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = galleryCategorySchema.partial().extend({ id: z.string() }).parse(await request.json());
    if (!parseObjectId(body.id)) return jsonError("Invalid category id", 400);

    const { id, ...updates } = body;
    await connectDB();

    const category = await GalleryCategory.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!category) return jsonError("Gallery category not found", 404);

    revalidateGallery();
    return jsonOk({ category });
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
    if (!id || !parseObjectId(id)) return jsonError("Invalid category id", 400);

    await connectDB();
    await GalleryCategory.findByIdAndUpdate(id, { $set: { isArchived: true, archivedAt: new Date() } });
    revalidateGallery();

    return jsonOk({ archived: true });
  } catch (error) {
    return handleApiError(error);
  }
}
