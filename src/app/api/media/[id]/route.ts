import { NextResponse } from "next/server";
import { unlink } from "fs/promises";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { MediaAsset } from "@/models";
import { mediaUpdateSchema } from "@/lib/validation/media";
import { logActivity } from "@/lib/activity";
import { resolveExistingMediaFile } from "@/lib/media/serve";
import { handleApiError, jsonError, jsonOk, parseObjectId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid media id", 400);

    await connectDB();
    const asset = await MediaAsset.findById(id);
    if (!asset) return jsonError("Media not found", 404);

    return jsonOk({ asset });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    const body = mediaUpdateSchema.parse({ ...(await request.json()), id });
    await connectDB();

    const updates: Record<string, unknown> = {};
    if (body.alt !== undefined) updates.alt = body.alt;
    if (body.caption !== undefined) updates.caption = body.caption;
    if (body.credit !== undefined) updates.credit = body.credit;
    if (body.focalPoint !== undefined) updates.focalPoint = body.focalPoint;
    if (body.featured !== undefined) updates.featured = body.featured;
    if (body.sortOrder !== undefined) updates.sortOrder = body.sortOrder;
    if (body.status !== undefined) updates.status = body.status;
    if (body.galleryCategoryId !== undefined) updates.categoryId = body.galleryCategoryId;
    if (body.category !== undefined) updates.categorySlug = body.category;

    const asset = await MediaAsset.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!asset) return jsonError("Media not found", 404);

    await logActivity({
      action: "update",
      entityType: "MediaAsset",
      entityId: id,
      summary: "Updated media metadata",
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ asset });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid media id", 400);

    await connectDB();
    const asset = await MediaAsset.findById(id);
    if (!asset) return jsonError("Media not found", 404);

    if (asset.referenceCount > 0) {
      await MediaAsset.updateOne(
        { _id: id },
        { $set: { isArchived: true, archivedAt: new Date(), status: "draft" } },
      );
      return jsonOk({ archived: true, message: "Media archived because it is still referenced" });
    }

    try {
      const absolutePath = await resolveExistingMediaFile(asset.diskPath);
      await unlink(absolutePath);
    } catch {
      // File may already be missing on disk.
    }

    await MediaAsset.deleteOne({ _id: id });

    await logActivity({
      action: "delete",
      entityType: "MediaAsset",
      entityId: id,
      summary: "Deleted media asset",
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
