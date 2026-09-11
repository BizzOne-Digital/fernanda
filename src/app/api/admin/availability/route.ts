import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { AvailabilityBlock } from "@/models";
import {
  availabilityBlockSchema,
  availabilityBlockUpdateSchema,
} from "@/lib/validation/availability";
import { revalidateAvailability } from "@/lib/revalidation";
import { logActivity } from "@/lib/activity";
import { handleApiError, jsonError, jsonOk, notArchivedFilter, parseObjectId } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const cabinId = searchParams.get("cabinId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const filter: Record<string, unknown> = { ...notArchivedFilter };
    if (cabinId) filter.cabinId = cabinId;
    if (from) filter.startDate = { $gte: new Date(from) };
    if (to) filter.endDate = { $lte: new Date(to) };

    const blocks = await AvailabilityBlock.find(filter).sort({ startDate: 1 });
    return jsonOk({ items: blocks, blocks });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = availabilityBlockSchema.parse(await request.json());
    await connectDB();

    const block = await AvailabilityBlock.create({
      cabinId: body.cabinId,
      startDate: body.startDate,
      endDate: body.endDate,
      status: body.status,
      adminNotes: body.adminNote,
      privateReason: body.publicNote,
      bookingInquiryId: body.inquiryId,
      createdBy: authResult.session.user.id,
    });

    revalidateAvailability();

    await logActivity({
      action: "create",
      entityType: "AvailabilityBlock",
      entityId: block._id.toString(),
      summary: "Created availability block",
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ block }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = availabilityBlockUpdateSchema.parse(await request.json());
    await connectDB();

    const block = await AvailabilityBlock.findByIdAndUpdate(
      body.id,
      {
        $set: {
          cabinId: body.cabinId,
          startDate: body.startDate,
          endDate: body.endDate,
          status: body.status,
          adminNotes: body.adminNote,
          privateReason: body.publicNote,
          bookingInquiryId: body.inquiryId,
        },
      },
      { new: true, runValidators: true },
    );

    if (!block) return jsonError("Availability block not found", 404);

    revalidateAvailability();

    await logActivity({
      action: "update",
      entityType: "AvailabilityBlock",
      entityId: body.id,
      summary: "Updated availability block",
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ block });
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
    if (!id || !parseObjectId(id)) return jsonError("Invalid block id", 400);

    await connectDB();
    const block = await AvailabilityBlock.findByIdAndUpdate(
      id,
      { $set: { isArchived: true, archivedAt: new Date() } },
      { new: true },
    );
    if (!block) return jsonError("Availability block not found", 404);

    revalidateAvailability();

    await logActivity({
      action: "archive",
      entityType: "AvailabilityBlock",
      entityId: id,
      summary: "Archived availability block",
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ archived: true });
  } catch (error) {
    return handleApiError(error);
  }
}
