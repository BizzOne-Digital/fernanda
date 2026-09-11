import { z } from "zod";
import {
  focalPointSchema,
  objectIdSchema,
  publishStatusSchema,
} from "./common";

export const MEDIA_CATEGORIES = [
  "Lake & Waterfront",
  "Property & Outdoor Spaces",
  "Cabins",
  "Kitchens & Washrooms",
  "Family Lake Days",
  "Paddleboards & Lake Play",
  "Nature & Wildlife",
  "Sunsets & Starry Nights",
  "Historic / Sundial Motel",
  "General",
] as const;

export const mediaCategorySchema = z.enum(MEDIA_CATEGORIES);

export const mediaMetadataSchema = z.object({
  alt: z.string().trim().max(300).optional(),
  caption: z.string().trim().max(500).optional(),
  credit: z.string().trim().max(200).optional(),
  category: mediaCategorySchema.optional(),
  galleryCategoryId: objectIdSchema.optional().nullable(),
  focalPoint: focalPointSchema.optional(),
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().int().min(0).max(9999).optional(),
  status: publishStatusSchema.optional(),
});

export const mediaUpdateSchema = mediaMetadataSchema.extend({
  id: objectIdSchema,
});

export type MediaMetadataInput = z.infer<typeof mediaMetadataSchema>;
export type MediaUpdateInput = z.infer<typeof mediaUpdateSchema>;

export const ALLOWED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
] as const;

export type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

export function isAllowedImageMimeType(
  mime: string,
): mime is AllowedImageMimeType {
  return (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(mime);
}
