import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { Season } from "@/models";
import { dateInputSchema } from "@/lib/validation/common";
import { revalidateSeasons } from "@/lib/revalidation";
import { logActivity } from "@/lib/activity";
import { getPagination, handleApiError, jsonError, jsonOk, notArchivedFilter, parseObjectId } from "@/lib/api-utils";

const seasonSchema = z.object({
  name: z.string().min(1),
  startDate: dateInputSchema,
  endDate: dateInputSchema,
  year: z.coerce.number().int().optional(),
  weeklyStayText: z.string().optional(),
  shortStayText: z.string().optional(),
  minimumStayText: z.string().optional(),
  variabilityNote: z.string().optional(),
  publicInquiryNote: z.string().optional(),
  adminQuoteGuidance: z.string().optional(),
  lastMinuteOfferText: z.string().optional(),
  lastMinuteStartDate: dateInputSchema.optional().nullable(),
  lastMinuteEndDate: dateInputSchema.optional().nullable(),
  lastMinuteCabinNumbers: z.array(z.coerce.number().int()).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
  sortOrder: z.coerce.number().int().optional(),
});

function mapSeasonInput(body: z.infer<typeof seasonSchema>) {
  return {
    name: body.name,
    startDate: body.startDate,
    endDate: body.endDate,
    year: body.year,
    weeklyAvailabilityText: body.weeklyStayText,
    minimumStayText: body.minimumStayText ?? body.shortStayText,
    variabilityNote: body.variabilityNote,
    publicInquiryNote: body.publicInquiryNote,
    adminQuoteGuidance: body.adminQuoteGuidance,
    lastMinuteOfferText: body.lastMinuteOfferText,
    lastMinuteStartDate: body.lastMinuteStartDate ?? undefined,
    lastMinuteEndDate: body.lastMinuteEndDate ?? undefined,
    sortOrder: body.sortOrder,
    isPublished: body.status ? body.status === "published" : undefined,
    isActive: body.status ? body.status !== "archived" : undefined,
  };
}

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPagination(searchParams);

    const [items, total] = await Promise.all([
      Season.find(notArchivedFilter).sort({ year: -1, sortOrder: 1 }).skip(skip).limit(limit).lean(),
      Season.countDocuments(notArchivedFilter),
    ]);

    return jsonOk({ items, seasons: items, total, page, limit });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = seasonSchema.parse(await request.json());
    await connectDB();

    const season = await Season.create(mapSeasonInput(body));
    revalidateSeasons();

    await logActivity({
      action: "create",
      entityType: "Season",
      entityId: season._id.toString(),
      entityLabel: season.name,
      summary: `Created season ${season.name}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ season }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = seasonSchema.partial().extend({ id: z.string() }).parse(await request.json());
    if (!parseObjectId(body.id)) return jsonError("Invalid season id", 400);

    const { id, ...rest } = body;
    await connectDB();
    const season = await Season.findByIdAndUpdate(id, { $set: mapSeasonInput(rest as z.infer<typeof seasonSchema>) }, { new: true, runValidators: true });
    if (!season) return jsonError("Season not found", 404);

    revalidateSeasons();
    return jsonOk({ season });
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
    if (!id || !parseObjectId(id)) return jsonError("Invalid season id", 400);

    await connectDB();
    await Season.findByIdAndUpdate(id, { $set: { isArchived: true, archivedAt: new Date(), isActive: false } });
    revalidateSeasons();

    return jsonOk({ archived: true });
  } catch (error) {
    return handleApiError(error);
  }
}
