import { readFile } from "fs/promises";
import { NextResponse } from "next/server";
import {
  getMediaContentType,
  normalizeRelativePath,
  resolveExistingMediaFile,
} from "@/lib/media/serve";

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { path: segments } = await context.params;
    const relativePath = normalizeRelativePath(segments.join("/"));
    const absolutePath = await resolveExistingMediaFile(relativePath);
    const buffer = await readFile(absolutePath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": getMediaContentType(absolutePath),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
