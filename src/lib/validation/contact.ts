import { z } from "zod";
import {
  consentSchema,
  emailSchema,
  honeypotSchema,
  longTextSchema,
  nameSchema,
  optionalPhoneSchema,
  shortTextSchema,
} from "./common";

export const contactFormSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: optionalPhoneSchema,
  subject: shortTextSchema.min(1, "Subject is required"),
  message: longTextSchema.min(10, "Message must be at least 10 characters"),
  consent: consentSchema,
  website: honeypotSchema,
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const contactSchema = contactFormSchema.extend({
  formStartedAt: z.number().optional(),
});
