import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { ContactMessage, CONTACT_MESSAGE_STATUSES } from "@/models";
import { handleApiError, jsonError, jsonOk, parseObjectId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

const messagePatchSchema = z.object({
  status: z.enum(CONTACT_MESSAGE_STATUSES).optional(),
  adminNotes: z.string().optional(),
});

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid message id", 400);

    await connectDB();
    const message = await ContactMessage.findById(id).lean();
    if (!message) return jsonError("Message not found", 404);

    return jsonOk({ message });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    const body = messagePatchSchema.parse(await request.json());
    if (!parseObjectId(id)) return jsonError("Invalid message id", 400);

    await connectDB();
    const message = await ContactMessage.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!message) return jsonError("Message not found", 404);

    return jsonOk({ message });
  } catch (error) {
    return handleApiError(error);
  }
}
