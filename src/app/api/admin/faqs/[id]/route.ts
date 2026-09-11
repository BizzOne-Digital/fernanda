import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { FAQ } from "@/models";
import { faqUpdateSchema } from "@/lib/validation/faq";
import { revalidateFaqs } from "@/lib/revalidation";
import { handleApiError, jsonError, jsonOk, parseObjectId } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid FAQ id", 400);

    await connectDB();
    const faq = await FAQ.findById(id);
    if (!faq) return jsonError("FAQ not found", 404);

    return jsonOk({ faq });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    const body = faqUpdateSchema.parse(await request.json());
    if (!parseObjectId(id)) return jsonError("Invalid FAQ id", 400);

    await connectDB();
    const faq = await FAQ.findByIdAndUpdate(id, { $set: body }, { new: true, runValidators: true });
    if (!faq) return jsonError("FAQ not found", 404);

    revalidateFaqs();
    return jsonOk({ faq });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { id } = await context.params;
    if (!parseObjectId(id)) return jsonError("Invalid FAQ id", 400);

    await connectDB();
    await FAQ.findByIdAndUpdate(id, { $set: { isArchived: true, archivedAt: new Date() } });
    revalidateFaqs();

    return jsonOk({ archived: true });
  } catch (error) {
    return handleApiError(error);
  }
}
