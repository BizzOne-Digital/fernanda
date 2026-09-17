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

/** Normalize admin / DB image paths for Next.js and the browser. */
export function normalizePublicImageUrl(url?: string | null): string {
  if (!url?.trim()) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;

  let path = trimmed;
  if (path.startsWith("api/uploads/")) path = `/${path}`;
  if (!path.startsWith("/") && path.includes("api/uploads/")) path = `/${path}`;

  const parsed = parseUploadUrl(path.startsWith("/") ? path : `/${path.replace(/^\//, "")}`);
  if (parsed) return buildUploadUrl(parsed.folder, parsed.filename);

  if (!path.startsWith("/") && /^[\w.-]+\.(jpe?g|png|webp|gif)$/i.test(path)) {
    return buildUploadUrl("gallery", path);
  }

  if (!path.startsWith("/") && !path.includes("/")) {
    return "";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function requiresUnoptimizedImage(url: string) {
  const normalized = normalizePublicImageUrl(url);
  return (
    normalized.startsWith("/api/uploads/") ||
    normalized.startsWith("/media/") ||
    normalized.startsWith("/images/")
  );
}

const LEGACY_DEMO_MAP: Record<string, string> = {
  "/demo/lake-hero.svg": "/images/property/lake-mcintyre-bluff.jpg",
  "/demo/cabin-interior.svg": "/images/property/property-lakefront-lawn.jpg",
  "/demo/patio-bbq.svg": "/images/property/family-picnic-sunset.jpg",
  "/demo/boats.svg": "/images/property/family-paddleboat.jpg",
  "/demo/kitchen.svg": "/images/property/property-hydrangeas-lawn.jpg",
  "/demo/stars.svg": "/images/property/sunset-chairs.jpg",
  "/demo/historic.svg": "/images/property/property-pine-sky.jpg",
  "/demo/nature.svg": "/images/property/wildlife-eagle.jpg",
};

export function resolvePublicImageUrl(url?: string | null, fallback = PLACEHOLDER_IMAGE) {
  if (!url?.trim()) return fallback;

  const normalized = normalizePublicImageUrl(url);
  if (!normalized) return fallback;

  if (normalized.startsWith("/api/uploads/") || normalized.startsWith("/images/")) {
    return normalized;
  }

  if (normalized.startsWith("/media/")) {
    return normalized;
  }

  if (normalized.startsWith("/uploads/")) {
    return fallback;
  }

  const demoMapped = LEGACY_DEMO_MAP[normalized] ?? normalized;
  if (demoMapped.startsWith("/demo/")) return fallback;
  return demoMapped;
}

export function sanitizeUploadFilename(filename: string) {
  if (!filename || filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return null;
  }
  return filename;
}
