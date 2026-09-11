import type { FilterQuery, Model } from "mongoose";

import {
  PROPERTY_IMAGE_META,
  PROPERTY_GALLERY,
  type DemoImageKey,
} from "@/lib/demo-images";
import type { IImageRef } from "@/models/shared/schemas";

export function img(key: DemoImageKey, alt: string, caption?: string): IImageRef {
  const meta = PROPERTY_IMAGE_META[key];
  return {
    url: meta.path,
    alt,
    caption: caption ?? alt,
    focalPoint: { x: 0.5, y: 0.5 },
  };
}

export function propertyImg(path: string, alt: string, caption?: string): IImageRef {
  return {
    url: path,
    alt,
    caption: caption ?? alt,
    focalPoint: { x: 0.5, y: 0.5 },
  };
}

export function demoGallery(count: number, altPrefix: string, keys?: DemoImageKey[]): IImageRef[] {
  if (keys) {
    return Array.from({ length: count }, (_, index) => {
      const key = keys[index % keys.length];
      return img(key, `${altPrefix} — ${PROPERTY_IMAGE_META[key].alt}`);
    });
  }

  return Array.from({ length: count }, (_, index) => {
    const item = PROPERTY_GALLERY[index % PROPERTY_GALLERY.length];
    return propertyImg(item.path, item.alt, altPrefix);
  });
}

export async function seedIfMissing<T extends object>(
  model: Model<T>,
  filter: FilterQuery<T>,
  data: T,
  label: string,
): Promise<"created" | "skipped"> {
  const existing = await model.findOne(filter).select("_id").lean();
  if (existing) {
    console.log(`  skip ${label}`);
    return "skipped";
  }

  await model.create(data);
  console.log(`  created ${label}`);
  return "created";
}
