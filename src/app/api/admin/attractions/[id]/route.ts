import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { ATTRACTION_CATEGORIES, Attraction } from "@/models";
import { publishStatusSchema, seoSchema, slugSchema, imageRefSchema } from "@/lib/validation/common";
import { revalidateAttractions } from "@/lib/revalidation";
import { handleApiError, jsonError, jsonOk, parseObjectId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

const attractionSchema = z.object({
  title: z.string().min(1).optional(),
  slug: slugSchema.optional(),
  category: z.enum(ATTRACTION_CATEGORIES).optional(),
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

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid attraction id", 400);

    await connectDB();
    const attraction = await Attraction.findById(id).lean();
    if (!attraction) return jsonError("Attraction not found", 404);

    return jsonOk({ attraction });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    const body = attractionSchema.parse(await request.json());
    if (!parseObjectId(id)) return jsonError("Invalid attraction id", 400);

    const { verificationDate, ...rest } = body;
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

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid attraction id", 400);

    await connectDB();
    await Attraction.findByIdAndUpdate(id, { $set: { isArchived: true, archivedAt: new Date() } });
    revalidateAttractions();

    return jsonOk({ archived: true });
  } catch (error) {
    return handleApiError(error);
  }
}
