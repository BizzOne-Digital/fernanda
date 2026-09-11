import { NextResponse } from "next/server";
import { getStoredUpload, sanitizeUploadFilename, isUploadFolder } from "@/lib/uploads/stored-uploads";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ folder: string; filename: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { folder, filename } = await context.params;

  if (!isUploadFolder(folder) || !sanitizeUploadFilename(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const doc = await getStoredUpload(folder, filename);
  if (!doc?.data) {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = Buffer.isBuffer(doc.data) ? doc.data : Buffer.from(doc.data);

  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": String(body.length),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
