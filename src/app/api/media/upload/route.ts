import { NextResponse } from "next/server";
import sharp from "sharp";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { MediaAsset } from "@/models";
import { logActivity } from "@/lib/activity";
import { handleApiError, jsonError, jsonOk } from "@/lib/api-utils";
import {
  ALLOWED_UPLOAD_MIMES,
  buildUploadUrl,
  generateUploadFilename,
  saveStoredUpload,
  type UploadFolder,
} from "@/lib/uploads/stored-uploads";

export const runtime = "nodejs";

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

    if (!ALLOWED_UPLOAD_MIMES[file.type]) {
      return jsonError("Invalid file type. Allowed: JPEG, PNG, WebP, GIF", 415);
    }

    const rawBuffer = Buffer.from(await file.arrayBuffer());
    const optimized = await sharp(rawBuffer, { failOn: "error" })
      .rotate()
      .webp({ quality: 85 })
      .toBuffer({ resolveWithObject: true });

    const folder: UploadFolder =
      String(formData.get("category") ?? "") === "gallery" || formData.get("galleryCategoryId")
        ? "gallery"
        : "misc";

    const filename = generateUploadFilename("image/webp");
    if (!filename) {
      return jsonError("Could not determine file extension", 400);
    }

    await saveStoredUpload({
      folder,
      filename,
      mimeType: "image/webp",
      data: optimized.data,
    });

    const publicUrl = buildUploadUrl(folder, filename);

    const asset = await MediaAsset.create({
      originalFilename: file.name,
      diskPath: `${folder}/${filename}`,
      publicUrl,
      mimeType: "image/webp",
      bytes: optimized.data.byteLength,
      dimensions: { width: optimized.info.width, height: optimized.info.height },
      alt: String(formData.get("alt") ?? ""),
      caption: String(formData.get("caption") ?? ""),
      credit: String(formData.get("credit") ?? ""),
      categoryId: formData.get("galleryCategoryId") || undefined,
      categorySlug: String(formData.get("category") ?? "") || undefined,
      metadata: { variants: [] },
    });

    await logActivity({
      action: "upload",
      entityType: "MediaAsset",
      entityId: asset._id.toString(),
      entityLabel: file.name,
      summary: `Uploaded ${file.name}`,
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
