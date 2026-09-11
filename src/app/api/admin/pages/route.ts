import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import Page from "@/models/Page";
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
      Page.find(filter)
        .sort({ title: 1 })
        .skip(skip)
        .limit(limit)
        .select("slug title status updatedAt sections")
        .lean(),
      Page.countDocuments(filter),
    ]);

    return jsonOk({ items, pages: items, total, page, limit });
  } catch (error) {
    return handleApiError(error);
  }
}
