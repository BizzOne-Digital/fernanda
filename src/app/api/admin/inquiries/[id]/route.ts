import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { BookingInquiry } from "@/models";
import { inquiryAdminUpdateSchema } from "@/lib/validation/inquiry";
import { logActivity } from "@/lib/activity";
import { handleApiError, jsonError, jsonOk, parseObjectId, serializeInquiry } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid inquiry id", 400);

    await connectDB();
    const inquiry = await BookingInquiry.findById(id);
    if (!inquiry) return jsonError("Inquiry not found", 404);

    return jsonOk({ inquiry: serializeInquiry(inquiry) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid inquiry id", 400);

    const body = inquiryAdminUpdateSchema.parse(await request.json());
    await connectDB();

    const inquiry = await BookingInquiry.findById(id);
    if (!inquiry) return jsonError("Inquiry not found", 404);

    const updates: Record<string, unknown> = {};
    if (body.quoteAmount !== undefined) updates.quoteAmount = body.quoteAmount;
    if (body.quoteCurrency !== undefined) updates.quoteCurrency = body.quoteCurrency;
    if (body.adminNotes !== undefined) updates.adminNotes = body.adminNotes;
    if (body.assignedCabinId !== undefined) updates.assignedCabinId = body.assignedCabinId || null;
    if (body.followUpDate !== undefined) updates.followUpDate = body.followUpDate;

    if (body.status && body.status !== inquiry.status) {
      updates.status = body.status;
      inquiry.statusHistory.push({
        status: body.status,
        note: body.statusNote,
        changedAt: new Date(),
      });
      updates.statusHistory = inquiry.statusHistory;
    }

    const updated = await BookingInquiry.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    await logActivity({
      action: "status-change",
      entityType: "BookingInquiry",
      entityId: id,
      entityLabel: inquiry.inquiryNumber,
      summary: `Updated inquiry ${inquiry.inquiryNumber}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
      metadata: { status: body.status },
    });

    return jsonOk({ inquiry: updated ? serializeInquiry(updated) : null });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid inquiry id", 400);

    await connectDB();
    const inquiry = await BookingInquiry.findByIdAndUpdate(
      id,
      { $set: { status: "closed" } },
      { new: true },
    );
    if (!inquiry) return jsonError("Inquiry not found", 404);

    await logActivity({
      action: "archive",
      entityType: "BookingInquiry",
      entityId: id,
      entityLabel: inquiry.inquiryNumber,
      summary: `Closed inquiry ${inquiry.inquiryNumber}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ archived: true });
  } catch (error) {
    return handleApiError(error);
  }
}
