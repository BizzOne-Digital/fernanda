import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import {
  ActivityLog,
  BookingInquiry,
  Cabin,
  ContactMessage,
  MediaAsset,
  Service,
} from "@/models";
import { handleApiError, jsonOk } from "@/lib/api-utils";

export async function GET() {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();

    const [
      newInquiries,
      newMessages,
      publishedCabins,
      publishedServices,
      mediaCount,
      recentInquiries,
      recentActivity,
    ] = await Promise.all([
      BookingInquiry.countDocuments({ status: "new" }),
      ContactMessage.countDocuments({ status: "new" }),
      Cabin.countDocuments({ status: "published", isArchived: false }),
      Service.countDocuments({ status: "published", isArchived: false }),
      MediaAsset.countDocuments({ isArchived: false }),
      BookingInquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
      ActivityLog.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return jsonOk({
      counts: {
        newInquiries,
        newMessages,
        publishedCabins,
        publishedServices,
        mediaCount,
      },
      recentInquiries,
      recentActivity,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
