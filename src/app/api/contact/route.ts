import connectDB from "@/lib/mongodb";
import { ContactMessage } from "@/models";
import { contactSchema } from "@/lib/validation/contact";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/utils/rate-limit";
import { handleApiError, jsonError, jsonOk } from "@/lib/api-utils";

const CONTACT_LIMIT = 5;
const CONTACT_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request.headers);
    const limited = checkRateLimit(`contact:${ip}`, {
      limit: CONTACT_LIMIT,
      windowMs: CONTACT_WINDOW_MS,
    });

    if (!limited.allowed) {
      return jsonError("Too many requests. Please try again later.", 429, undefined);
    }

    const body = contactSchema.parse(await request.json());

    if (body.website) {
      return jsonOk({ success: true, message: "Message received." });
    }

    if (body.formStartedAt && Date.now() - body.formStartedAt < 3000) {
      return jsonOk({ success: true, message: "Message received." });
    }

    await connectDB();

    await ContactMessage.create({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      subject: body.subject,
      message: body.message,
      consentGiven: body.consent,
    });

    return jsonOk(
      { success: true, message: "Message received. We will respond as soon as we can." },
      { status: 201, headers: rateLimitHeaders(limited) },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
