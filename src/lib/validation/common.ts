import { z } from "zod";

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-f\d]{24}$/i, "Invalid ID");

export const slugSchema = z
  .string()
  .trim()
  .min(1, "Slug is required")
  .max(120)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Slug must be lowercase letters, numbers, and hyphens",
  );

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .email("Enter a valid email address")
  .max(254);

export const optionalEmailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address")
  .max(254)
  .optional()
  .or(z.literal(""));

export const phoneSchema = z
  .string()
  .trim()
  .min(7, "Enter a valid phone number")
  .max(30)
  .regex(/^[+\d\s().-]+$/, "Enter a valid phone number");

export const optionalPhoneSchema = z
  .string()
  .trim()
  .max(30)
  .regex(/^[+\d\s().-]*$/, "Enter a valid phone number")
  .optional()
  .or(z.literal(""));

export const nameSchema = z
  .string()
  .trim()
  .min(1, "This field is required")
  .max(80);

export const optionalNameSchema = z.string().trim().max(80).optional();

export const shortTextSchema = z.string().trim().max(500);

export const longTextSchema = z.string().trim().max(10_000);

export const richTextSchema = z.string().trim().max(100_000);

export const urlSchema = z
  .string()
  .trim()
  .url("Enter a valid URL")
  .max(2048);

export const optionalUrlSchema = z
  .string()
  .trim()
  .url("Enter a valid URL")
  .max(2048)
  .optional()
  .or(z.literal(""));

export const publishStatusSchema = z.enum(["draft", "published", "archived"]);

export const consentSchema = z.literal(true, {
  errorMap: () => ({ message: "Consent is required" }),
});

export const honeypotSchema = z
  .string()
  .max(0, "Submission rejected")
  .optional()
  .or(z.literal(""));

export const focalPointSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export const imageRefSchema = z.object({
  mediaId: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || /^[a-f\d]{24}$/i.test(value), "Invalid media id"),
  url: z.string().trim().min(1).max(2048),
  alt: z.string().trim().max(300).optional(),
  caption: z.string().trim().max(500).optional(),
  credit: z.string().trim().max(200).optional(),
  focalPoint: focalPointSchema.optional(),
});

/** Drop empty slots and normalize image refs for admin saves. */
export function sanitizeImageRefList(
  images?: Array<z.infer<typeof imageRefSchema> | null> | null,
): z.infer<typeof imageRefSchema>[] {
  if (!images?.length) return [];
  return images.filter((item): item is z.infer<typeof imageRefSchema> => Boolean(item?.url?.trim()));
}

export const seoSchema = z.object({
  title: z.string().trim().max(120).optional(),
  description: z.string().trim().max(320).optional(),
  canonical: optionalUrlSchema,
  ogImage: imageRefSchema.optional(),
  noIndex: z.boolean().optional(),
});

export const dateInputSchema = z.coerce.date({
  invalid_type_error: "Enter a valid date",
});

export const dateRangeRefinement = (
  data: { startDate: Date; endDate: Date },
  ctx: z.RefinementCtx,
) => {
  if (data.startDate >= data.endDate) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "End date must be after start date",
      path: ["endDate"],
    });
  }
};

export const dateOnlyStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format");

export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function toDateOnlyString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function startOfUtcDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(200).optional(),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
