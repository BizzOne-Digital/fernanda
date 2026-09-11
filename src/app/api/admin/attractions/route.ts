import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { ATTRACTION_CATEGORIES, Attraction } from "@/models";
import { publishStatusSchema, seoSchema, slugSchema, imageRefSchema } from "@/lib/validation/common";
import { revalidateAttractions } from "@/lib/revalidation";
import { logActivity } from "@/lib/activity";
import { getPagination, handleApiError, jsonError, jsonOk, notArchivedFilter, parseObjectId } from "@/lib/api-utils";

const attractionSchema = z.object({
  title: z.string().min(1),
  slug: slugSchema,
  category: z.enum(ATTRACTION_CATEGORIES),
  summary: z.string().optional(),
  body: z.string().optional(),
  images: z.array(imageRefSchema).optional(),
  address: z.string().optional(),
  mapLink: z.string().optional(),
  website: z.string().optional(),
  travelTimeText: z.string().optional(),
  season: z.string().optional(),
  familyNotes: z.string().optional(),
  verificationDate: z.string().optional().nullable(),
  isVerified: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
  status: publishStatusSchema.optional(),
  seo: seoSchema.optional(),
});

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPagination(searchParams);

    const [items, total] = await Promise.all([
      Attraction.find(notArchivedFilter).sort({ sortOrder: 1, title: 1 }).skip(skip).limit(limit).lean(),
      Attraction.countDocuments(notArchivedFilter),
    ]);

    return jsonOk({ items, attractions: items, total, page, limit });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = attractionSchema.parse(await request.json());
    await connectDB();

    const attraction = await Attraction.create({
      ...body,
      summary: body.summary ?? body.title,
      verificationDate: body.verificationDate ? new Date(body.verificationDate) : undefined,
    });

    revalidateAttractions();

    await logActivity({
      action: "create",
      entityType: "Attraction",
      entityId: attraction._id.toString(),
      entityLabel: attraction.title,
      summary: `Created attraction ${attraction.title}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ attraction }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = attractionSchema.partial().extend({ id: z.string() }).parse(await request.json());
    if (!parseObjectId(body.id)) return jsonError("Invalid attraction id", 400);

    const { id, verificationDate, ...rest } = body;
    const updates: Record<string, unknown> = { ...rest };
    if (verificationDate !== undefined) {
      updates.verificationDate = verificationDate ? new Date(verificationDate) : null;
    }

    await connectDB();
    const attraction = await Attraction.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!attraction) return jsonError("Attraction not found", 404);

    revalidateAttractions();
    return jsonOk({ attraction });
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
    if (!id || !parseObjectId(id)) return jsonError("Invalid attraction id", 400);

    await connectDB();
    const attraction = await Attraction.findByIdAndUpdate(
      id,
      { $set: { isArchived: true, archivedAt: new Date() } },
      { new: true },
    );
    if (!attraction) return jsonError("Attraction not found", 404);

    revalidateAttractions();
    return jsonOk({ archived: true });
  } catch (error) {
    return handleApiError(error);
  }
}
