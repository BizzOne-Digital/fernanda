import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { getSiteSettings } from "@/models";
import { applySettingsPatch, settingsToAdminForm } from "@/lib/admin/settings-mapper";
import { settingsPatchSchema } from "@/lib/validation/settings";
import { revalidateSettings } from "@/lib/revalidation";
import { logActivity } from "@/lib/activity";
import { handleApiError, jsonOk } from "@/lib/api-utils";

export async function GET() {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();
    const settings = await getSiteSettings();
    return jsonOk({ settings: settingsToAdminForm(settings) });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const raw = await request.json();
    const body = settingsPatchSchema.parse(raw);
    await connectDB();

    const settings = await getSiteSettings();
    applySettingsPatch(settings, body);
    await settings.save();

    revalidateSettings();

    await logActivity({
      action: "update",
      entityType: "SiteSettings",
      entityId: settings._id.toString(),
      summary: "Updated site settings",
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ settings: settingsToAdminForm(settings) });
  } catch (error) {
    return handleApiError(error);
  }
}
