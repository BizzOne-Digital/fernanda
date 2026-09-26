import { z } from "zod";
import {
  consentSchema,
  honeypotSchema,
  longTextSchema,
  nameSchema,
  optionalEmailSchema,
  shortTextSchema,
} from "@/lib/validation/common";

export const guestMemoryFormSchema = z.object({
  guestName: nameSchema,
  email: optionalEmailSchema,
  story: longTextSchema.min(20, "Please share at least a few sentences about your memory"),
  photoUrl: z.string().trim().max(2048).optional().or(z.literal("")),
  photoAlt: shortTextSchema.optional(),
  consent: consentSchema,
  website: honeypotSchema,
  formStartedAt: z.number().optional(),
});

export type GuestMemoryFormInput = z.infer<typeof guestMemoryFormSchema>;

export const guestMemoryAdminPatchSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  adminNotes: z.string().max(5000).optional(),
  addToGallery: z.boolean().optional(),
  galleryCategory: z
    .enum(["friends-family", "seasons", "wildlife", "exploring", "fishing"])
    .optional(),
});
