/**
 * Vercel (and many reverse proxies) reject API request bodies above ~4.5 MB.
 * Admin uploads POST the raw file in multipart form data, so large phone photos
 * fail with HTTP 413 before our route handler runs.
 */
export const UPLOAD_REQUEST_MAX_BYTES = 4 * 1024 * 1024;

const DEFAULT_MAX_DIMENSION = 2560;
const DEFAULT_TARGET_BYTES = UPLOAD_REQUEST_MAX_BYTES - 256 * 1024;

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image file"));
    };
    img.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality);
  });
}

function scaledDimensions(
  width: number,
  height: number,
  maxDimension: number,
): { width: number; height: number } {
  const longest = Math.max(width, height);
  if (longest <= maxDimension) return { width, height };
  const scale = maxDimension / longest;
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

async function compressWithCanvas(
  file: File,
  maxBytes: number,
  maxDimension: number,
): Promise<File> {
  const img = await loadImageFromFile(file);
  const { width, height } = scaledDimensions(img.naturalWidth, img.naturalHeight, maxDimension);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare image for upload");
  ctx.drawImage(img, 0, 0, width, height);

  const mimeType = file.type === "image/png" ? "image/png" : "image/jpeg";
  const extension = mimeType === "image/png" ? "png" : "jpg";
  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";

  let quality = 0.92;
  let blob = await canvasToBlob(canvas, mimeType, quality);
  while (blob && blob.size > maxBytes && quality > 0.45) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, mimeType, quality);
  }

  if (!blob) throw new Error("Could not compress image");
  if (blob.size > maxBytes) {
    throw new Error(
      `Image is still too large after compression (${Math.round(blob.size / 1024 / 1024)} MB). Try a smaller photo or crop it before uploading.`,
    );
  }

  return new File([blob], `${baseName}.${extension}`, { type: mimeType, lastModified: Date.now() });
}

/**
 * Shrinks large photos in the browser so uploads succeed on serverless hosts.
 */
export async function prepareImageFileForUpload(
  file: File,
  options?: { maxBytes?: number; maxDimension?: number },
): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  if (file.type === "image/gif") {
    if (file.size > UPLOAD_REQUEST_MAX_BYTES) {
      throw new Error("GIF uploads must be under 4 MB. Try converting to JPEG or use a smaller file.");
    }
    return file;
  }

  const maxBytes = options?.maxBytes ?? DEFAULT_TARGET_BYTES;
  const maxDimension = options?.maxDimension ?? DEFAULT_MAX_DIMENSION;

  if (file.size <= maxBytes) return file;

  return compressWithCanvas(file, maxBytes, maxDimension);
}
