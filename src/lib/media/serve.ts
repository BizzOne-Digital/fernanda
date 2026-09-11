import path from "path";
import { access } from "fs/promises";
import { constants } from "fs";
import { env } from "@/lib/env";

const MEDIA_URL_PREFIX = "/media/";

function resolveUploadRoot(): string {
  return path.resolve(process.cwd(), env.uploadDir);
}

export function isMediaPublicUrl(url: string): boolean {
  return url.startsWith(MEDIA_URL_PREFIX);
}

export function publicUrlToRelativePath(publicUrl: string): string {
  if (!isMediaPublicUrl(publicUrl)) {
    throw new Error("Invalid media URL");
  }

  const relative = publicUrl.slice(MEDIA_URL_PREFIX.length);
  return normalizeRelativePath(relative);
}

export function normalizeRelativePath(relativePath: string): string {
  const normalized = path.posix.normalize(relativePath.replace(/\\/g, "/"));

  if (
    normalized.startsWith("..") ||
    normalized.includes("/../") ||
    normalized === ".." ||
    path.isAbsolute(normalized)
  ) {
    throw new Error("Path traversal detected");
  }

  return normalized;
}

export function resolveMediaDiskPath(relativePath: string): string {
  const safeRelative = normalizeRelativePath(relativePath);
  const uploadRoot = resolveUploadRoot();
  const absolutePath = path.resolve(uploadRoot, safeRelative);
  const relativeToRoot = path.relative(uploadRoot, absolutePath);

  if (
    relativeToRoot.startsWith("..") ||
    path.isAbsolute(relativeToRoot)
  ) {
    throw new Error("Path traversal detected");
  }

  return absolutePath;
}

export async function resolveExistingMediaFile(
  relativePath: string,
): Promise<string> {
  const diskPath = resolveMediaDiskPath(relativePath);
  await access(diskPath, constants.R_OK);
  return diskPath;
}

export function getMediaContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".webp":
      return "image/webp";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".avif":
      return "image/avif";
    default:
      return "application/octet-stream";
  }
}
