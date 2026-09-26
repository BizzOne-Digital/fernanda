import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth-helpers";
import { handleApiError, jsonOk } from "@/lib/api-utils";
import { processImageUpload } from "@/lib/uploads/process-image-upload";
import { deleteStoredUploadByUrl, isUploadFolder } from "@/lib/uploads/stored-uploads";

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

    const result = await processImageUpload(file, folder);

    return jsonOk({
      success: true,
      url: result.url,
      filename: result.filename,
      size: result.size,
      folder: result.folder,
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
