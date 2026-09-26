import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { GuestMemory } from "@/models";
import { getPagination, handleApiError, jsonOk } from "@/lib/api-utils";

export async function GET(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();
    const { searchParams } = new URL(request.url);
    const { page, limit, skip } = getPagination(searchParams);
    const status = searchParams.get("status");

    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;

    const [items, total] = await Promise.all([
      GuestMemory.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      GuestMemory.countDocuments(filter),
    ]);

    return jsonOk({ items, memories: items, total, page, limit });
  } catch (error) {
    return handleApiError(error);
  }
}
