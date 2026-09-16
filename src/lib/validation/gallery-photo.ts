import { z } from "zod";
import { GALLERY_PHOTO_CATEGORIES } from "@/models/GalleryPhoto";

export const galleryPhotoSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
  caption: z.string().optional(),
  category: z.enum(GALLERY_PHOTO_CATEGORIES).optional(),
  sortOrder: z.coerce.number().optional(),
  featured: z.boolean().optional(),
  status: z.enum(["draft", "published"]).optional(),
});

export const galleryPhotoPatchSchema = galleryPhotoSchema.partial();
