import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { Testimonial } from "@/models";
import { publishStatusSchema, imageRefSchema } from "@/lib/validation/common";
import { revalidateTestimonials } from "@/lib/revalidation";
import { handleApiError, jsonError, jsonOk, parseObjectId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

const testimonialSchema = z.object({
  guestName: z.string().min(1).optional(),
  location: z.string().optional(),
  testimonial: z.string().min(1).optional(),
  stayLabel: z.string().optional(),
  image: imageRefSchema.optional().nullable(),
  featured: z.boolean().optional(),
  isDemo: z.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
  status: publishStatusSchema.optional(),
});

function mapTestimonial(doc: unknown) {
  const record = doc as Record<string, unknown>;
  return { ...record, testimonial: record.quote };
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid testimonial id", 400);

    await connectDB();
    const testimonial = await Testimonial.findById(id).lean();
    if (!testimonial) return jsonError("Testimonial not found", 404);

    return jsonOk({ testimonial: mapTestimonial(testimonial) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    const body = testimonialSchema.parse(await request.json());
    if (!parseObjectId(id)) return jsonError("Invalid testimonial id", 400);

    const updates: Record<string, unknown> = { ...body };
    if (body.testimonial !== undefined) {
      updates.quote = body.testimonial;
      delete updates.testimonial;
    }

    await connectDB();
    const testimonial = await Testimonial.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!testimonial) return jsonError("Testimonial not found", 404);

    revalidateTestimonials();
    return jsonOk({ testimonial: mapTestimonial(testimonial.toObject()) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid testimonial id", 400);

    await connectDB();
    await Testimonial.findByIdAndUpdate(id, { $set: { isArchived: true, archivedAt: new Date() } });
    revalidateTestimonials();

    return jsonOk({ archived: true });
  } catch (error) {
    return handleApiError(error);
  }
}
