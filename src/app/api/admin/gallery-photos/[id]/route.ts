import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { deleteStoredUploadByUrl } from "@/lib/uploads/stored-uploads";
import { handleApiError, jsonError, jsonOk, parseObjectId } from "@/lib/api-utils";
import { revalidateGallery } from "@/lib/revalidation";
import GalleryPhoto from "@/models/GalleryPhoto";
import { galleryPhotoPatchSchema } from "@/lib/validation/gallery-photo";
import { normalizePublicImageUrl } from "@/lib/uploads/public-url";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid photo id", 400);

    const body = galleryPhotoPatchSchema.parse(await request.json());
    await connectDB();

    const existing = await GalleryPhoto.findOne({ _id: id, isArchived: false });
    if (!existing) return jsonError("Photo not found", 404);

    const updates = { ...body };
    if (updates.url) {
      const normalized = normalizePublicImageUrl(updates.url);
      if (!normalized) return jsonError("Invalid image URL", 400);
      updates.url = normalized;
    }

    if (updates.url && updates.url !== existing.url) {
      await deleteStoredUploadByUrl(existing.url);
    }

    const photo = await GalleryPhoto.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
    revalidateGallery();
    return jsonOk({ photo });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid photo id", 400);

    await connectDB();
    const existing = await GalleryPhoto.findOne({ _id: id, isArchived: false });
    if (!existing) return jsonError("Photo not found", 404);

    await deleteStoredUploadByUrl(existing.url);
    existing.isArchived = true;
    existing.archivedAt = new Date();
    await existing.save();

    revalidateGallery();
    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
