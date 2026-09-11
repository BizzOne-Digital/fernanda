import "server-only";

import { randomBytes } from "crypto";
import connectDB from "@/lib/mongodb";
import StoredUpload from "@/models/StoredUpload";
import {
  type UploadFolder,
  isUploadFolder,
  parseUploadUrl,
  sanitizeUploadFilename,
} from "@/lib/uploads/public-url";

export {
  UPLOAD_FOLDERS,
  type UploadFolder,
  PLACEHOLDER_IMAGE,
  isUploadFolder,
  buildUploadUrl,
  parseUploadUrl,
  isStoredUploadUrl,
  isLegacyUploadUrl,
  resolvePublicImageUrl,
  sanitizeUploadFilename,
} from "@/lib/uploads/public-url";

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export const ALLOWED_UPLOAD_MIMES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

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
