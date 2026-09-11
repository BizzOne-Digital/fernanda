import connectDB from "@/lib/mongodb";
import { BookingInquiry } from "@/models";
import { inquirySchema } from "@/lib/validation/inquiry";
import { generateInquiryNumber } from "@/lib/utils/inquiry-number";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "@/lib/utils/rate-limit";
import { handleApiError, jsonError, jsonOk } from "@/lib/api-utils";

const INQUIRE_LIMIT = 4;
const INQUIRE_WINDOW_MS = 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request.headers);
    const limited = checkRateLimit(`inquire:${ip}`, {
      limit: INQUIRE_LIMIT,
      windowMs: INQUIRE_WINDOW_MS,
    });

    if (!limited.allowed) {
      return jsonError("Too many inquiries. Please try again later.", 429);
    }

    const body = inquirySchema.parse(await request.json());

    if (body.website) {
      return jsonOk({ success: true });
    }

    if (body.formStartedAt && Date.now() - body.formStartedAt < 4000) {
      return jsonOk({ success: true });
    }

    await connectDB();

    const inquiryNumber = generateInquiryNumber();
    const snapshot = {
      arrivalDate: body.arrivalDate,
      departureDate: body.departureDate,
      dateFlexible: body.dateFlexible,
      adults: body.adults,
      children: body.children,
      preferredCabinIds: body.preferredCabins,
      preferredCabinLabels: body.preferredCabins,
      helpMeChoose: body.helpMeChoose ?? false,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      provinceState: body.homeRegion,
      country: body.country,
      stayTypeInterest: body.stayType,
      activitiesInterest: body.activities,
      specialRequests: body.specialRequests,
      message: body.message,
      howHeardAbout: body.heardAbout,
      consentGiven: body.consent,
      submittedAt: new Date(),
    };

    const inquiry = await BookingInquiry.create({
      inquiryNumber,
      snapshot,
      statusHistory: [{ status: "new", changedAt: new Date(), note: "Submitted via website" }],
      source: "website",
    });

    return jsonOk(
      {
        success: true,
        inquiryNumber: inquiry.inquiryNumber,
        id: inquiry._id.toString(),
        message: "Thank you — your inquiry has been received.",
      },
      { status: 201, headers: rateLimitHeaders(limited) },
    );
  } catch (error) {
    return handleApiError(error);
  }
}
