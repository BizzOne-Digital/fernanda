import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth-helpers";
import { handleApiError, jsonOk } from "@/lib/api-utils";
import { revalidateGallery } from "@/lib/revalidation";
import GalleryPhoto from "@/models/GalleryPhoto";
import { galleryPhotoSchema } from "@/lib/validation/gallery-photo";

export const runtime = "nodejs";

export async function GET() {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    await connectDB();
    const photos = await GalleryPhoto.find({ isArchived: false })
      .sort({ sortOrder: 1, createdAt: -1 })
      .lean();

    return jsonOk({ photos, items: photos });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const authResult = await requireAdmin();
    if (authResult instanceof NextResponse) return authResult;

    const body = galleryPhotoSchema.parse(await request.json());
    await connectDB();

    const photo = await GalleryPhoto.create({
      url: body.url,
      alt: body.alt,
      caption: body.caption,
      category: body.category ?? "property",
      sortOrder: body.sortOrder ?? 0,
      featured: body.featured ?? false,
      status: body.status ?? "published",
      isArchived: false,
    });

    revalidateGallery();
    return jsonOk({ photo }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
