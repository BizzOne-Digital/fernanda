import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { Cabin } from "@/models";
import { cabinCreateSchema } from "@/lib/validation/cabin";
import { revalidateCabins } from "@/lib/revalidation";
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
      Cabin.find(filter).sort({ sortOrder: 1, cabinNumber: 1 }).skip(skip).limit(limit).lean(),
      Cabin.countDocuments(filter),
    ]);

    return jsonOk({ items, cabins: items, total, page, limit });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = cabinCreateSchema.parse(await request.json());
    await connectDB();

    const cabin = await Cabin.create({
      ...body,
      sleepingArrangement: body.sleepingRows?.map((row) => ({
        bedType: row.beds,
        count: 1,
        location: row.room,
      })),
      galleryImages: body.detailImages ?? [],
      shortDescription: body.shortDescription ?? body.name,
      sleepingSummary: body.sleepingSummary ?? "",
    });

    revalidateCabins(cabin.slug);

    await logActivity({
      action: "create",
      entityType: "Cabin",
      entityId: cabin._id.toString(),
      entityLabel: cabin.name,
      summary: `Created cabin ${cabin.name}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ cabin }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
