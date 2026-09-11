import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { Testimonial } from "@/models";
import { publishStatusSchema, imageRefSchema } from "@/lib/validation/common";
import { revalidateTestimonials } from "@/lib/revalidation";
import { logActivity } from "@/lib/activity";
import { getPagination, handleApiError, jsonOk, notArchivedFilter } from "@/lib/api-utils";

const testimonialSchema = z.object({
  guestName: z.string().min(1),
  location: z.string().optional(),
  testimonial: z.string().min(1),
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

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPagination(searchParams);

    const [items, total] = await Promise.all([
      Testimonial.find(notArchivedFilter).sort({ sortOrder: 1 }).skip(skip).limit(limit).lean(),
      Testimonial.countDocuments(notArchivedFilter),
    ]);

    const mapped = items.map((item) => mapTestimonial(item));
    return jsonOk({ items: mapped, testimonials: mapped, total, page, limit });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = testimonialSchema.parse(await request.json());
    await connectDB();

    const testimonial = await Testimonial.create({
      guestName: body.guestName,
      location: body.location,
      quote: body.testimonial,
      stayLabel: body.stayLabel,
      image: body.image,
      featured: body.featured,
      isDemo: body.isDemo,
      sortOrder: body.sortOrder,
      status: body.status,
    });

    revalidateTestimonials();

    await logActivity({
      action: "create",
      entityType: "Testimonial",
      entityId: testimonial._id.toString(),
      entityLabel: testimonial.guestName,
      summary: `Created testimonial from ${testimonial.guestName}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ testimonial: mapTestimonial(testimonial.toObject()) }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
