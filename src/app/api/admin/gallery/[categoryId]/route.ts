import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { GalleryCategory } from "@/models";
import { listGalleryPhotosForAdminCategory } from "@/lib/gallery/admin-category-photos";
import { handleApiError, jsonError, jsonOk, notArchivedFilter, parseObjectId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ categoryId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { categoryId } = await context.params;
    if (!parseObjectId(categoryId)) return jsonError("Invalid category id", 400);

    await connectDB();

    const category = await GalleryCategory.findOne({ _id: categoryId, ...notArchivedFilter }).lean();

    if (!category) return jsonError("Gallery category not found", 404);

    const photos = await listGalleryPhotosForAdminCategory({
      _id: category._id,
      slug: category.slug,
    });

    return jsonOk({ category, photos, items: photos, assets: photos });
  } catch (error) {
    return handleApiError(error);
  }
}
