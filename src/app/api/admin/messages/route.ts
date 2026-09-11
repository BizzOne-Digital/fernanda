import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { ContactMessage, CONTACT_MESSAGE_STATUSES } from "@/models";
import { getPagination, handleApiError, jsonError, jsonOk, parseObjectId } from "@/lib/api-utils";

const messagePatchSchema = z.object({
  status: z.enum(CONTACT_MESSAGE_STATUSES).optional(),
  adminNotes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPagination(searchParams);
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      ContactMessage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ContactMessage.countDocuments(filter),
    ]);

    return jsonOk({ items, messages: items, total, page, limit });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = messagePatchSchema.extend({ id: z.string() }).parse(await request.json());
    if (!parseObjectId(body.id)) return jsonError("Invalid message id", 400);

    const { id, ...updates } = body;
    await connectDB();

    const message = await ContactMessage.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!message) return jsonError("Message not found", 404);

    return jsonOk({ message });
  } catch (error) {
    return handleApiError(error);
  }
}
