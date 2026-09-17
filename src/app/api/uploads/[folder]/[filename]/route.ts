import { NextResponse } from "next/server";
import { uploadDataToBuffer } from "@/lib/uploads/buffer";
import { getStoredUpload, sanitizeUploadFilename, isUploadFolder } from "@/lib/uploads/stored-uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ folder: string; filename: string }> };

function buildEtag(updatedAt: unknown, size: number) {
  const stamp =
    updatedAt instanceof Date
      ? updatedAt.getTime()
      : updatedAt
        ? new Date(String(updatedAt)).getTime()
        : size;
  return `"upload-${stamp}-${size}"`;
}

export async function GET(request: Request, context: RouteContext) {
  const { folder, filename } = await context.params;

  if (!isUploadFolder(folder) || !sanitizeUploadFilename(filename)) {
    return new NextResponse("Not found", { status: 404 });
  }

  const doc = await getStoredUpload(folder, filename);
  if (!doc?.data) {
    return new NextResponse("Not found", { status: 404 });
  }

  const body = uploadDataToBuffer(doc.data);
  if (!body?.length) {
    return new NextResponse("Not found", { status: 404 });
  }
  const etag = buildEtag(doc.updatedAt, body.length);
  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": "public, max-age=3600, must-revalidate",
      },
    });
  }

  return new NextResponse(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": doc.mimeType,
      "Content-Length": String(body.length),
      ETag: etag,
      "Cache-Control": "public, max-age=3600, must-revalidate",
    },
  });
}
