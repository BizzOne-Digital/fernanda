import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { MediaAsset } from "@/models";
import { saveUploadedImage } from "@/lib/media/upload";
import { publicUrlToRelativePath } from "@/lib/media/serve";
import { logActivity } from "@/lib/activity";
import { handleApiError, jsonError, jsonOk } from "@/lib/api-utils";

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return jsonError("No file provided", 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const saved = await saveUploadedImage(buffer, file.name, authResult.session.user.id);

    const relativeDiskPath = publicUrlToRelativePath(saved.publicUrl);

    const asset = await MediaAsset.create({
      originalFilename: saved.originalFilename,
      diskPath: relativeDiskPath,
      publicUrl: saved.publicUrl,
      mimeType: saved.mimeType,
      bytes: saved.bytes,
      dimensions: { width: saved.width, height: saved.height },
      alt: String(formData.get("alt") ?? ""),
      caption: String(formData.get("caption") ?? ""),
      credit: String(formData.get("credit") ?? ""),
      categoryId: formData.get("galleryCategoryId") || undefined,
      categorySlug: String(formData.get("category") ?? "") || undefined,
      metadata: {
        variants: saved.variants.map((variant) => ({
          label: variant.label,
          diskPath: variant.diskPath,
          publicUrl: variant.publicUrl,
          width: variant.width,
          height: variant.height,
          bytes: 0,
        })),
      },
    });

    await logActivity({
      action: "upload",
      entityType: "MediaAsset",
      entityId: asset._id.toString(),
      entityLabel: saved.originalFilename,
      summary: `Uploaded ${saved.originalFilename}`,
      adminEmail: authResult.session.user.email,
      adminUserId: authResult.session.user.id,
    });

    return jsonOk({ asset }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("unsupported")) {
      return jsonError(error.message, 415);
    }
    if (error instanceof Error && error.message.toLowerCase().includes("maximum")) {
      return jsonError(error.message, 413);
    }
    return handleApiError(error);
  }
}
