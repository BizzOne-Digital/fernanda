import { NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { Page } from "@/models";
import { publishStatusSchema, seoSchema } from "@/lib/validation/common";
import { revalidatePages } from "@/lib/revalidation";
import { logActivity } from "@/lib/activity";
import { handleApiError, jsonError, jsonOk, notArchivedFilter } from "@/lib/api-utils";

type RouteContext = { params: Promise<{ slug: string }> };

const pagePatchSchema = z.object({
  title: z.string().min(1).optional(),
  status: publishStatusSchema.optional(),
  sections: z.array(z.record(z.string(), z.unknown())).optional(),
  seo: seoSchema.optional(),
});

export async function GET(_request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { slug } = await context.params;
    await connectDB();

    const page = await Page.findOne({ slug: slug.toLowerCase(), ...notArchivedFilter });
    if (!page) return jsonError("Page not found", 404);

    return jsonOk({ page });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const { slug } = await context.params;
    const body = pagePatchSchema.parse(await request.json());
    await connectDB();

    const page = await Page.findOneAndUpdate(
      { slug: slug.toLowerCase(), ...notArchivedFilter },
      { $set: body },
      { new: true, runValidators: true },
    );

    if (!page) return jsonError("Page not found", 404);

    revalidatePages([page.slug === "home" ? "/" : `/${page.slug}`]);

    await logActivity({
      action: "update",
      entityType: "Page",
      entityId: page._id.toString(),
      entityLabel: page.slug,
      summary: `Updated page ${page.slug}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ page });
  } catch (error) {
    return handleApiError(error);
  }
}
