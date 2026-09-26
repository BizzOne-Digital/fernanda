import { handleApiError, jsonError, jsonOk } from "@/lib/api-utils";
import { processImageUpload } from "@/lib/uploads/process-image-upload";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/utils/rate-limit";

export const runtime = "nodejs";

const PHOTO_LIMIT = 6;
const PHOTO_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request.headers);
    const limited = checkRateLimit(`guest-memory-photo:${ip}`, {
      limit: PHOTO_LIMIT,
      windowMs: PHOTO_WINDOW_MS,
    });

    if (!limited.allowed) {
      return jsonError("Too many uploads. Please try again later.", 429);
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return jsonError("No file provided", 400);
    }

    const result = await processImageUpload(file, "misc");

    return jsonOk(
      {
        success: true,
        url: result.url,
        filename: result.filename,
        size: result.size,
      },
      { status: 201, headers: rateLimitHeaders(limited) },
    );
  } catch (error) {
    if (error instanceof Error && error.message.includes("8MB")) {
      return jsonError(error.message, 413);
    }
    if (error instanceof Error && error.message.includes("Invalid file")) {
      return jsonError(error.message, 400);
    }
    return handleApiError(error);
  }
}
