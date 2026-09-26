import connectDB from "@/lib/mongodb";
import { GuestMemory } from "@/models";
import { guestMemoryFormSchema } from "@/lib/validation/guest-memory";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/utils/rate-limit";
import { handleApiError, jsonError, jsonOk } from "@/lib/api-utils";
import { isStoredUploadUrl, normalizePublicImageUrl } from "@/lib/uploads/public-url";
import { revalidateGuestMemories } from "@/lib/revalidation";

const MEMORY_LIMIT = 3;
const MEMORY_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request.headers);
    const limited = checkRateLimit(`guest-memory:${ip}`, {
      limit: MEMORY_LIMIT,
      windowMs: MEMORY_WINDOW_MS,
    });

    if (!limited.allowed) {
      return jsonError("Too many submissions. Please try again later.", 429);
    }

    const body = guestMemoryFormSchema.parse(await request.json());

    if (body.website) {
      return jsonOk({ success: true, message: "Thank you — your memory has been received." });
    }

    if (body.formStartedAt && Date.now() - body.formStartedAt < 3000) {
      return jsonOk({ success: true, message: "Thank you — your memory has been received." });
    }

    let photoUrl: string | undefined;
    if (body.photoUrl) {
      const normalized = normalizePublicImageUrl(body.photoUrl);
      if (!normalized || !isStoredUploadUrl(normalized)) {
        return jsonError("Invalid photo URL", 400);
      }
      photoUrl = normalized;
    }

    await connectDB();

    await GuestMemory.create({
      guestName: body.guestName,
      email: body.email || undefined,
      story: body.story,
      photoUrl,
      photoAlt: body.photoAlt || undefined,
      consentGiven: body.consent,
      status: "pending",
    });

    revalidateGuestMemories();

    return jsonOk(
      {
        success: true,
        message:
          "Thank you — your memory has been received. We review submissions before they appear on the gallery.",
      },
      { status: 201, headers: rateLimitHeaders(limited) },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
