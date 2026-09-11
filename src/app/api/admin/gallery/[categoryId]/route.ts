import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { GalleryCategory, MediaAsset } from "@/models";
import { handleApiError, jsonError, jsonOk, notArchivedFilter, parseObjectId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ categoryId: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { categoryId } = await context.params;
    if (!parseObjectId(categoryId)) return jsonError("Invalid category id", 400);

    await connectDB();

    const [category, assets] = await Promise.all([
      GalleryCategory.findOne({ _id: categoryId, ...notArchivedFilter }).lean(),
      MediaAsset.find({ categoryId, ...notArchivedFilter }).sort({ sortOrder: 1, createdAt: -1 }).lean(),
    ]);

    if (!category) return jsonError("Gallery category not found", 404);

    return jsonOk({ category, assets, items: assets });
  } catch (error) {
    return handleApiError(error);
  }
}
