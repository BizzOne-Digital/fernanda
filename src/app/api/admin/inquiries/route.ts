import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { BookingInquiry } from "@/models";
import { getPagination, handleApiError, jsonOk, serializeInquiry } from "@/lib/api-utils";

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
      BookingInquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      BookingInquiry.countDocuments(filter),
    ]);

    return jsonOk({
      items: items.map(serializeInquiry),
      inquiries: items.map(serializeInquiry),
      total,
      page,
      limit,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
