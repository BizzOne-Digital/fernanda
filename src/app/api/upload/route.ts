import { NextResponse } from "next/server";
import sharp from "sharp";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth-helpers";
import { handleApiError, jsonOk } from "@/lib/api-utils";
import {
  ALLOWED_UPLOAD_MIMES,
  MAX_UPLOAD_BYTES,
  buildUploadUrl,
  deleteStoredUploadByUrl,
  generateUploadFilename,
  isUploadFolder,
  saveStoredUpload,
} from "@/lib/uploads/stored-uploads";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const form = await request.formData();
    const file = form.get("file");
    const folder = String(form.get("folder") ?? "misc");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!isUploadFolder(folder)) {
      return NextResponse.json({ error: "Invalid upload folder" }, { status: 400 });
    }

    if (!ALLOWED_UPLOAD_MIMES[file.type]) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 },
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File exceeds 8MB limit" }, { status: 400 });
    }

    let mimeType = file.type;
    let buffer = Buffer.from(await file.arrayBuffer());

    if (file.type !== "image/gif") {
      const optimized = await sharp(buffer, { failOn: "error" })
        .rotate()
        .webp({ quality: 85 })
        .toBuffer();
      mimeType = "image/webp";
      buffer = Buffer.from(optimized);
    }

    const filename = generateUploadFilename(mimeType);
    if (!filename) {
      return NextResponse.json({ error: "Could not determine file extension" }, { status: 400 });
    }

    if (buffer.length > MAX_UPLOAD_BYTES) {
      return NextResponse.json({ error: "File exceeds 8MB limit after processing" }, { status: 413 });
    }

    await saveStoredUpload({
      folder,
      filename,
      mimeType,
      data: buffer,
    });

    return jsonOk({
      success: true,
      url: buildUploadUrl(folder, filename),
      filename,
      size: buffer.length,
      folder,
    });
  } catch (error) {
    return handleApiError(error);
  }
}

const deleteSchema = z.object({ url: z.string().min(1) });

export async function DELETE(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = deleteSchema.parse(await request.json());
    const deleted = await deleteStoredUploadByUrl(body.url);
    if (!deleted) {
      return NextResponse.json({ error: "Upload not found" }, { status: 404 });
    }
    return jsonOk({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
