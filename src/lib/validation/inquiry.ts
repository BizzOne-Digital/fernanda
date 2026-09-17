import { z } from "zod";
import {
  consentSchema,
  dateInputSchema,
  emailSchema,
  honeypotSchema,
  nameSchema,
  optionalNameSchema,
  phoneSchema,
  shortTextSchema,
} from "./common";
import { BOOKING_INQUIRY_STATUSES } from "@/lib/booking/inquiry-constants";

export const bookingInquirySchema = z
  .object({
    arrivalDate: dateInputSchema,
    departureDate: dateInputSchema,
    dateFlexible: z.boolean(),
    adults: z.coerce.number().int().min(1, "At least one adult is required").max(20),
    children: z.coerce.number().int().min(0).max(20),
    preferredCabins: z.array(z.string().trim().max(80)).max(8),
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    homeRegion: optionalNameSchema,
    country: optionalNameSchema,
    stayType: shortTextSchema.optional().or(z.literal("")),
    activities: z.array(z.string().trim().max(80)).max(20),
    specialRequests: shortTextSchema.optional().or(z.literal("")),
    message: shortTextSchema.optional().or(z.literal("")),
    heardAbout: shortTextSchema.optional().or(z.literal("")),
    consent: consentSchema,
    website: honeypotSchema,
  })
  .superRefine((data, ctx) => {
    if (data.arrivalDate >= data.departureDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Departure must be after arrival",
        path: ["departureDate"],
      });
    }

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    if (data.arrivalDate < today) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Arrival date cannot be in the past",
        path: ["arrivalDate"],
      });
    }

    const totalGuests = data.adults + data.children;
    if (totalGuests > 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total guests cannot exceed 20",
        path: ["adults"],
      });
    }
  });

export type BookingInquiryInput = z.infer<typeof bookingInquirySchema>;

export const inquiryStatusSchema = z.enum(BOOKING_INQUIRY_STATUSES);

export const inquirySchema = bookingInquirySchema.and(
  z.object({
    formStartedAt: z.number().optional(),
    helpMeChoose: z.boolean(),
  }),
);

export const inquiryAdminUpdateSchema = z.object({
  status: inquiryStatusSchema.optional(),
  quoteAmount: z.coerce.number().min(0).max(1_000_000).optional(),
  quoteCurrency: z.string().trim().length(3).default("CAD").optional(),
  adminNotes: z.string().trim().max(10_000).optional(),
  assignedCabinId: z
    .string()
    .regex(/^[a-f\d]{24}$/i)
    .optional()
    .nullable(),
  followUpDate: dateInputSchema.optional().nullable(),
  statusNote: z.string().trim().max(1000).optional(),
});

export type InquiryFormValues = z.infer<typeof inquirySchema>;
export type InquiryAdminUpdateInput = z.infer<typeof inquiryAdminUpdateSchema>;
