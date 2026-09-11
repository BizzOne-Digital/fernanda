import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { FAQ } from "@/models";
import { faqCreateSchema, faqUpdateSchema } from "@/lib/validation/faq";
import { revalidateFaqs } from "@/lib/revalidation";
import { logActivity } from "@/lib/activity";
import { getPagination, handleApiError, jsonError, jsonOk, notArchivedFilter, parseObjectId } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPagination(searchParams);
    const category = searchParams.get("category");

    const filter: Record<string, unknown> = { ...notArchivedFilter };
    if (category) filter.category = category;

    const [items, total] = await Promise.all([
      FAQ.find(filter).sort({ sortOrder: 1 }).skip(skip).limit(limit).lean(),
      FAQ.countDocuments(filter),
    ]);

    return jsonOk({ items, faqs: items, total, page, limit });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = faqCreateSchema.parse(await request.json());
    await connectDB();

    const faq = await FAQ.create(body);
    revalidateFaqs();

    await logActivity({
      action: "create",
      entityType: "FAQ",
      entityId: faq._id.toString(),
      summary: "Created FAQ",
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ faq }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = faqUpdateSchema.extend({ id: z.string() }).parse(await request.json());
    if (!parseObjectId(body.id)) return jsonError("Invalid FAQ id", 400);

    const { id, ...updates } = body;
    await connectDB();

    const faq = await FAQ.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true });
    if (!faq) return jsonError("FAQ not found", 404);

    revalidateFaqs();
    return jsonOk({ faq });
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
    if (!id || !parseObjectId(id)) return jsonError("Invalid FAQ id", 400);

    await connectDB();
    await FAQ.findByIdAndUpdate(id, { $set: { isArchived: true, archivedAt: new Date() } });
    revalidateFaqs();

    return jsonOk({ archived: true });
  } catch (error) {
    return handleApiError(error);
  }
}
