import { z } from "zod";
import {
  imageRefSchema,
  optionalEmailSchema,
  optionalUrlSchema,
  richTextSchema,
  shortTextSchema,
} from "./common";

/** Admin forms send "" for untouched optional fields — treat as omitted. */
function optionalText(max: number) {
  return z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value === "" ? undefined : value));
}

const logoSettingsSchema = imageRefSchema
  .extend({
    mediaId: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value && /^[a-f\d]{24}$/i.test(value) ? value : undefined)),
  })
  .optional()
  .nullable();

const generalSettingsSchema = z.object({
  brandName: optionalText(160),
  shortBrandName: optionalText(80),
  projectName: optionalText(160),
  logo: logoSettingsSchema,
  primaryHeadline: shortTextSchema.optional(),
  supportingHeadline: shortTextSchema.optional(),
  announcement: shortTextSchema.optional().nullable(),
  defaultSeoTitle: z.string().trim().max(120).optional(),
  defaultSeoDescription: z.string().trim().max(320).optional(),
});

const contactSettingsSchema = z.object({
  email: optionalEmailSchema,
  phoneDisplay: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  phoneLink: z
    .string()
    .trim()
    .max(40)
    .optional()
    .transform((value) => (value === "" ? undefined : value)),
  facebook: optionalUrlSchema,
  address: shortTextSchema.optional().nullable(),
  businessHours: shortTextSchema.optional().nullable(),
});

const propertySettingsSchema = z.object({
  sharedAmenities: z.array(z.string().trim().max(200)).max(30).optional(),
  packingNotes: richTextSchema.optional(),
  landscapeDescriptors: z.array(z.string().trim().max(200)).max(20).optional(),
  safetyNotes: richTextSchema.optional(),
});

const bookingSettingsSchema = z.object({
  inquiryConfirmationCopy: richTextSchema.optional(),
  responseTimeWording: shortTextSchema.optional(),
  defaultCapacityRules: shortTextSchema.optional(),
  availabilityDisclaimer: richTextSchema.optional(),
});

const footerSettingsSchema = z.object({
  description: richTextSchema.optional(),
  ctaText: z.string().trim().max(80).optional(),
  ctaUrl: optionalUrlSchema,
  copyright: z.string().trim().max(200).optional(),
});

const motionSettingsSchema = z.object({
  introEnabled: z.boolean().optional(),
  introOncePerSession: z.boolean().optional(),
  animationIntensity: z.enum(["low", "medium", "high"]).optional(),
});

export const settingsPatchSchema = z
  .object({
    general: generalSettingsSchema.optional(),
    contact: contactSettingsSchema.optional(),
    property: propertySettingsSchema.optional(),
    booking: bookingSettingsSchema.optional(),
    footer: footerSettingsSchema.optional(),
    motion: motionSettingsSchema.optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "At least one settings group must be provided" },
  );

export type SettingsPatchInput = z.infer<typeof settingsPatchSchema>;
