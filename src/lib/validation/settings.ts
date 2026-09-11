import { z } from "zod";
import {
  emailSchema,
  imageRefSchema,
  optionalUrlSchema,
  richTextSchema,
  shortTextSchema,
} from "./common";

const generalSettingsSchema = z.object({
  brandName: z.string().trim().min(1).max(160).optional(),
  shortBrandName: z.string().trim().min(1).max(80).optional(),
  projectName: z.string().trim().min(1).max(160).optional(),
  logo: imageRefSchema.optional().nullable(),
  primaryHeadline: shortTextSchema.optional(),
  supportingHeadline: shortTextSchema.optional(),
  announcement: shortTextSchema.optional().nullable(),
  defaultSeoTitle: z.string().trim().max(120).optional(),
  defaultSeoDescription: z.string().trim().max(320).optional(),
});

const contactSettingsSchema = z.object({
  email: emailSchema.optional(),
  phoneDisplay: z.string().trim().min(7).max(40).optional(),
  phoneLink: z.string().trim().max(40).optional(),
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
