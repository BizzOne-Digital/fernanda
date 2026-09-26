import sharp from "sharp";
import {
  ALLOWED_UPLOAD_MIMES,
  MAX_UPLOAD_BYTES,
  buildUploadUrl,
  generateUploadFilename,
  saveStoredUpload,
  type UploadFolder,
} from "@/lib/uploads/stored-uploads";

export type ProcessedImageUpload = {
  url: string;
  filename: string;
  size: number;
  folder: UploadFolder;
};

export async function processImageUpload(file: File, folder: UploadFolder): Promise<ProcessedImageUpload> {
  if (!ALLOWED_UPLOAD_MIMES[file.type]) {
    throw new Error("Invalid file type. Allowed: JPEG, PNG, WebP, GIF");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error("File exceeds 8MB limit");
  }

  let mimeType = file.type;
  let buffer = Buffer.from(await file.arrayBuffer());

  if (file.type !== "image/gif") {
    const optimized = await sharp(buffer, { failOn: "error" })
      .rotate()
      .webp({ quality: 85 })
      .toBuffer();
    mimeType = "image/webp";
    buffer = Buffer.from(optimized);
  }

  const filename = generateUploadFilename(mimeType);
  if (!filename) {
    throw new Error("Could not determine file extension");
  }

  if (buffer.length > MAX_UPLOAD_BYTES) {
    throw new Error("File exceeds 8MB limit after processing");
  }

  await saveStoredUpload({
    folder,
    filename,
    mimeType,
    data: buffer,
  });

  return {
    url: buildUploadUrl(folder, filename),
    filename,
    size: buffer.length,
    folder,
  };
}
