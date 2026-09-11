export const UPLOAD_FOLDERS = ["products", "gallery", "pages", "misc"] as const;
export type UploadFolder = (typeof UPLOAD_FOLDERS)[number];

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
