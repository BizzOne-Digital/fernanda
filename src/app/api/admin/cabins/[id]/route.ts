import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { Cabin } from "@/models";
import { cabinUpdateSchema } from "@/lib/validation/cabin";
import { revalidateCabins } from "@/lib/revalidation";
import { logActivity } from "@/lib/activity";
import { handleApiError, jsonError, jsonOk, parseObjectId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

function mapCabinForAdmin(cabin: InstanceType<typeof Cabin>) {
  const doc = cabin.toObject();
  return {
    ...doc,
    sleepingRows: doc.sleepingArrangement?.map((row: { location: string; bedType: string }) => ({
      room: row.location,
      beds: row.bedType,
    })),
    detailImages: doc.galleryImages,
    heroHeading: doc.heroHeading,
    heroSubheading: doc.heroSubheading,
  };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid cabin id", 400);

    await connectDB();
    const cabin = await Cabin.findById(id);
    if (!cabin) return jsonError("Cabin not found", 404);

    return jsonOk({ cabin: mapCabinForAdmin(cabin) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid cabin id", 400);

    const body = cabinUpdateSchema.parse(await request.json());
    await connectDB();

    const updates: Record<string, unknown> = { ...body };
    if (body.sleepingRows) {
      updates.sleepingArrangement = body.sleepingRows.map((row) => ({
        bedType: row.beds,
        count: 1,
        location: row.room,
      }));
      delete updates.sleepingRows;
    }
    if (body.detailImages) {
      updates.galleryImages = body.detailImages;
      delete updates.detailImages;
    }

    const cabin = await Cabin.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!cabin) return jsonError("Cabin not found", 404);

    revalidateCabins(cabin.slug);

    await logActivity({
      action: "update",
      entityType: "Cabin",
      entityId: id,
      entityLabel: cabin.name,
      summary: `Updated cabin ${cabin.name}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ cabin: mapCabinForAdmin(cabin) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid cabin id", 400);

    await connectDB();
    const cabin = await Cabin.findByIdAndUpdate(
      id,
      { $set: { isArchived: true, archivedAt: new Date() } },
      { new: true },
    );
    if (!cabin) return jsonError("Cabin not found", 404);

    revalidateCabins(cabin.slug);

    await logActivity({
      action: "archive",
      entityType: "Cabin",
      entityId: id,
      entityLabel: cabin.name,
      summary: `Archived cabin ${cabin.name}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ archived: true });
  } catch (error) {
    return handleApiError(error);
  }
}
