import { DEMO_IMAGES, demoImage, demoGallery, type DemoImageKey } from "@/lib/demo-images";
import { resolvePublicImageUrl } from "@/lib/uploads/public-url";

const LEGACY_DEMO_MAP: Record<string, string> = {
  "/demo/lake-hero.svg": DEMO_IMAGES.lakeHero,
  "/demo/cabin-interior.svg": DEMO_IMAGES.cabinInterior,
  "/demo/patio-bbq.svg": DEMO_IMAGES.patioBbq,
  "/demo/boats.svg": DEMO_IMAGES.boats,
  "/demo/kitchen.svg": DEMO_IMAGES.kitchen,
  "/demo/stars.svg": DEMO_IMAGES.stars,
  "/demo/historic.svg": DEMO_IMAGES.historic,
  "/demo/nature.svg": DEMO_IMAGES.nature,
};

function normalizeImageSrc(url: string) {
  return LEGACY_DEMO_MAP[url] ?? url;
}
import type { IImageRef } from "@/models/shared/schemas";
import type { Document as MongooseDocument } from "mongoose";

export type PlainModel<T> = Omit<T, keyof MongooseDocument> & { _id: string };

export type ResolvedImage = {
  src: string;
  alt: string;
  caption?: string;
  credit?: string;
};

export function resolveImage(
  image?: IImageRef | null,
  fallback: DemoImageKey = "lakeHero",
  fallbackAlt = "Vaseaux Lake — placeholder image",
): ResolvedImage {
  if (image?.url) {
    return {
      src: resolvePublicImageUrl(normalizeImageSrc(image.url)),
      alt: image.alt || fallbackAlt,
      caption: image.caption,
      credit: image.credit,
    };
  }

  return {
    src: demoImage(fallback),
    alt: fallbackAlt,
  };
}

export function resolveImages(
  images: IImageRef[] | undefined,
  count: number,
  keys?: DemoImageKey[],
): ResolvedImage[] {
  if (images && images.length > 0) {
    return images.map((image, index) =>
      resolveImage(image, keys?.[index % (keys?.length ?? 1)] ?? "lakeHero"),
    );
  }

  return demoGallery(count, keys).map((item) => ({
    src: item.src,
    alt: item.alt,
  }));
}

export function toPlain<T>(value: unknown): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
