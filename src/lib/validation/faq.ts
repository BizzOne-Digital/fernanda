import { z } from "zod";
import {
  longTextSchema,
  objectIdSchema,
  publishStatusSchema,
  slugSchema,
} from "./common";

export const FAQ_CATEGORIES = [
  "Booking",
  "Rates & Seasons",
  "Cabins",
  "Packing",
  "Lake & Equipment",
  "Families",
  "Arrival & Stay",
  "Policies",
] as const;

export const faqCategorySchema = z.enum(FAQ_CATEGORIES);

export const faqCreateSchema = z.object({
  question: z.string().trim().min(1).max(500),
  answer: longTextSchema.min(1),
  category: faqCategorySchema,
  relatedPageSlug: slugSchema.optional().or(z.literal("")),
  relatedCabinSlug: slugSchema.optional().or(z.literal("")),
  relatedServiceSlug: slugSchema.optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  status: publishStatusSchema.default("published"),
});

export const faqUpdateSchema = faqCreateSchema.partial().extend({
  id: objectIdSchema.optional(),
});

export type FaqCreateInput = z.infer<typeof faqCreateSchema>;
export type FaqUpdateInput = z.infer<typeof faqUpdateSchema>;
