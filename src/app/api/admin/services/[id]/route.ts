import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { Service } from "@/models";
import { serviceUpdateSchema } from "@/lib/validation/service";
import { revalidateServices } from "@/lib/revalidation";
import { logActivity } from "@/lib/activity";
import { handleApiError, jsonError, jsonOk, parseObjectId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid service id", 400);

    await connectDB();
    const service = await Service.findById(id);
    if (!service) return jsonError("Service not found", 404);

    return jsonOk({ service });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid service id", 400);

    const body = serviceUpdateSchema.parse(await request.json());
    await connectDB();

    const service = await Service.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!service) return jsonError("Service not found", 404);

    revalidateServices(service.slug);

    await logActivity({
      action: "update",
      entityType: "Service",
      entityId: id,
      entityLabel: service.title,
      summary: `Updated service ${service.title}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ service });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid service id", 400);

    await connectDB();
    const service = await Service.findByIdAndUpdate(
      id,
      { $set: { isArchived: true, archivedAt: new Date() } },
      { new: true },
    );
    if (!service) return jsonError("Service not found", 404);

    revalidateServices(service.slug);

    await logActivity({
      action: "archive",
      entityType: "Service",
      entityId: id,
      entityLabel: service.title,
      summary: `Archived service ${service.title}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ archived: true });
  } catch (error) {
    return handleApiError(error);
  }
}
