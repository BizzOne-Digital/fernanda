import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { fileTypeFromBuffer } from "file-type";
import { v4 as uuidv4 } from "uuid";
import { env } from "@/lib/env";
import {
  ALLOWED_IMAGE_MIME_TYPES,
  isAllowedImageMimeType,
  type AllowedImageMimeType,
} from "@/lib/validation/media";

export interface ImageVariant {
  label: string;
  diskPath: string;
  publicUrl: string;
  width: number;
  height: number;
}

export interface UploadedImageResult {
  originalFilename: string;
  diskPath: string;
  publicUrl: string;
  mimeType: AllowedImageMimeType;
  bytes: number;
  width: number;
  height: number;
  variants: ImageVariant[];
}

const VARIANT_WIDTHS = [480, 960, 1920] as const;

function resolveUploadRoot(): string {
  return path.resolve(process.cwd(), env.uploadDir);
}

export function assertSafeUploadSegment(segment: string): string {
  if (!segment || segment === "." || segment === "..") {
    throw new Error("Invalid upload path segment");
  }
  if (segment.includes("/") || segment.includes("\\") || segment.includes("\0")) {
    throw new Error("Invalid upload path segment");
  }
  return segment;
}

export function buildUploadRelativePath(date = new Date()): {
  year: string;
  month: string;
  filename: string;
  relativePath: string;
} {
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const filename = `${uuidv4()}.webp`;
  assertSafeUploadSegment(year);
  assertSafeUploadSegment(month);
  assertSafeUploadSegment(filename);

  return {
    year,
    month,
    filename,
    relativePath: path.posix.join(year, month, filename),
  };
}

export function toPublicMediaUrl(relativePath: string): string {
  const normalized = relativePath.split(path.sep).join("/");
  return `/media/${normalized}`;
}

export async function validateImageBuffer(
  buffer: Buffer,
): Promise<AllowedImageMimeType> {
  if (buffer.byteLength > env.maxUploadBytes) {
    throw new Error(`File exceeds maximum size of ${env.maxUploadBytes} bytes`);
  }

  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || !isAllowedImageMimeType(detected.mime)) {
    throw new Error("Unsupported image type");
  }

  return detected.mime;
}

async function writeVariant(
  source: sharp.Sharp,
  metadata: sharp.Metadata,
  uploadDir: string,
  baseName: string,
  width: number,
): Promise<ImageVariant | null> {
  if (!metadata.width || metadata.width <= width) {
    return null;
  }

  const label = `w${width}`;
  const filename = `${baseName}-${label}.webp`;
  assertSafeUploadSegment(filename);
  const diskPath = path.join(uploadDir, filename);
  const variant = source.clone().resize({ width, withoutEnlargement: true }).webp({
    quality: 82,
  });

  const { data, info } = await variant.toBuffer({ resolveWithObject: true });
  await writeFile(diskPath, data);

  const relativePath = path
    .relative(resolveUploadRoot(), diskPath)
    .split(path.sep)
    .join("/");

  return {
    label,
    diskPath,
    publicUrl: toPublicMediaUrl(relativePath),
    width: info.width,
    height: info.height,
  };
}

export async function saveUploadedImage(
  buffer: Buffer,
  originalFilename: string,
  uploadedBy?: string,
): Promise<UploadedImageResult & { uploadedBy?: string }> {
  const mimeType = await validateImageBuffer(buffer);
  const uploadRoot = resolveUploadRoot();
  const { year, month, filename, relativePath } = buildUploadRelativePath();
  const targetDir = path.join(uploadRoot, year, month);
  const diskPath = path.join(targetDir, filename);

  const resolvedTargetDir = path.resolve(targetDir);
  const resolvedUploadRoot = path.resolve(uploadRoot);
  const relativeToRoot = path.relative(resolvedUploadRoot, resolvedTargetDir);
  if (relativeToRoot.startsWith("..") || path.isAbsolute(relativeToRoot)) {
    throw new Error("Path traversal detected");
  }

  await mkdir(targetDir, { recursive: true });

  const image = sharp(buffer, { failOn: "error" }).rotate();
  const metadata = await image.metadata();

  const optimized = await image
    .webp({ quality: 85 })
    .toBuffer({ resolveWithObject: true });

  await writeFile(diskPath, optimized.data);

  const baseName = filename.replace(/\.webp$/i, "");
  const variants: ImageVariant[] = [];

  for (const width of VARIANT_WIDTHS) {
    const variant = await writeVariant(
      sharp(buffer, { failOn: "error" }).rotate(),
      metadata,
      targetDir,
      baseName,
      width,
    );
    if (variant) {
      variants.push(variant);
    }
  }

  return {
    originalFilename: path.basename(originalFilename),
    diskPath,
    publicUrl: toPublicMediaUrl(relativePath),
    mimeType,
    bytes: optimized.data.byteLength,
    width: optimized.info.width,
    height: optimized.info.height,
    variants,
    uploadedBy,
  };
}

export { ALLOWED_IMAGE_MIME_TYPES };
