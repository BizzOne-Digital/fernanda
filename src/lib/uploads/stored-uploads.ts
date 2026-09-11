import { randomBytes } from "crypto";
import connectDB from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";

export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const ALLOWED_UPLOAD_MIMES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export const PLACEHOLDER_IMAGE = "/images/property/lake-mcintyre-bluff.jpg";

export function isUploadFolder(value: string): value is UploadFolder {
  return (UPLOAD_FOLDERS as readonly string[]).includes(value);
}

export function buildUploadUrl(folder: UploadFolder, filename: string) {
  return `/api/uploads/${folder}/${filename}`;
}

export function parseUploadUrl(url: string): { folder: UploadFolder; filename: string } | null {
  const match = url.match(/^\/api\/uploads\/([^/]+)\/([^/]+)$/);
  if (!match || !isUploadFolder(match[1])) return null;
  const filename = match[2];
  if (!filename || filename.includes("..") || filename.includes("/")) return null;
  return { folder: match[1], filename };
}

export function isStoredUploadUrl(url?: string | null) {
  return Boolean(url && parseUploadUrl(url));
}

export function isLegacyUploadUrl(url?: string | null) {
  return Boolean(url && (url.startsWith("/uploads/") || url.startsWith("/media/")));
}

export function resolvePublicImageUrl(url?: string | null, fallback = PLACEHOLDER_IMAGE) {
  if (!url) return fallback;
  if (isLegacyUploadUrl(url)) return fallback;
  return url;
}

export function sanitizeUploadFilename(filename: string) {
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return null;
  }
  return filename;
}

export function generateUploadFilename(mimeType: string) {
  const ext = ALLOWED_UPLOAD_MIMES[mimeType];
  if (!ext) return null;
  return `${Date.now()}-${randomBytes(8).toString("hex")}.${ext}`;
}

export async function saveStoredUpload(input: {
  folder: UploadFolder;
  filename: string;
  mimeType: string;
  data: Buffer;
}) {
  await connectDB();
  const doc = await StoredUpload.create({
    folder: input.folder,
    filename: input.filename,
    mimeType: input.mimeType,
    size: input.data.length,
    data: input.data,
  });
  return doc;
}

export async function getStoredUpload(folder: string, filename: string) {
  await connectDB();
  const safeFolder = isUploadFolder(folder) ? folder : null;
  const safeFilename = sanitizeUploadFilename(filename);
  if (!safeFolder || !safeFilename) return null;
  return StoredUpload.findOne({ folder: safeFolder, filename: safeFilename }).lean();
}

export async function deleteStoredUploadByUrl(url?: string | null) {
  const parsed = url ? parseUploadUrl(url) : null;
  if (!parsed) return false;
  await connectDB();
  const result = await StoredUpload.deleteOne({
    folder: parsed.folder,
    filename: parsed.filename,
  });
  return result.deletedCount > 0;
}
