import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { GuestMemory, GalleryPhoto } from "@/models";
import { guestMemoryAdminPatchSchema } from "@/lib/validation/guest-memory";
import { handleApiError, jsonError, jsonOk, parseObjectId } from "@/lib/api-utils";
import { revalidateGallery, revalidateGuestMemories } from "@/lib/revalidation";
import { logActivity } from "@/lib/activity";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid memory id", 400);

    await connectDB();
    const memory = await GuestMemory.findById(id).lean();
    if (!memory) return jsonError("Memory not found", 404);

    return jsonOk({ memory });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid memory id", 400);

    const body = guestMemoryAdminPatchSchema.parse(await request.json());
    await connectDB();

    const existing = await GuestMemory.findById(id);
    if (!existing) return jsonError("Memory not found", 404);

    const updates: Record<string, unknown> = {};
    if (body.adminNotes !== undefined) updates.adminNotes = body.adminNotes;

    if (body.status) {
      updates.status = body.status;
      if (body.status === "approved" && existing.status !== "approved") {
        updates.approvedAt = new Date();
      }
    }

    const memory = await GuestMemory.findByIdAndUpdate(id, { $set: updates }, {
      new: true,
      runValidators: true,
    });

    if (!memory) return jsonError("Memory not found", 404);

    const effectiveStatus = body.status ?? memory.status;
    if (body.addToGallery && memory.photoUrl && effectiveStatus === "approved") {
      const caption = memory.story.length > 500 ? `${memory.story.slice(0, 497)}…` : memory.story;
      await GalleryPhoto.create({
        url: memory.photoUrl,
        alt: memory.photoAlt || `Memory from ${memory.guestName}`,
        caption,
        category: body.galleryCategory ?? "friends-family",
        sortOrder: 0,
        featured: false,
        status: "published",
      });
      revalidateGallery();
    } else {
      revalidateGuestMemories();
    }

    await logActivity({
      action: "update",
      entityType: "GuestMemory",
      entityId: memory._id.toString(),
      entityLabel: memory.guestName,
      summary: `Updated guest memory from ${memory.guestName} (${memory.status})`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ memory });
  } catch (error) {
    return handleApiError(error);
  }
}
