import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { Service } from "@/models";
import { serviceCreateSchema } from "@/lib/validation/service";
import { revalidateServices } from "@/lib/revalidation";
import { logActivity } from "@/lib/activity";
import { getPagination, handleApiError, jsonOk, notArchivedFilter } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPagination(searchParams);
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = { ...notArchivedFilter };
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      Service.find(filter).sort({ sortOrder: 1, title: 1 }).skip(skip).limit(limit).lean(),
      Service.countDocuments(filter),
    ]);

    return jsonOk({ items, services: items, total, page, limit });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = serviceCreateSchema.parse(await request.json());
    await connectDB();

    const service = await Service.create(body);
    revalidateServices(service.slug);

    await logActivity({
      action: "create",
      entityType: "Service",
      entityId: service._id.toString(),
      entityLabel: service.title,
      summary: `Created service ${service.title}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ service }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
