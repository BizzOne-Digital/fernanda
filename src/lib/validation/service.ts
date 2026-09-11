import { z } from "zod";
import {
  imageRefSchema,
  longTextSchema,
  objectIdSchema,
  publishStatusSchema,
  seoSchema,
  shortTextSchema,
  slugSchema,
} from "./common";

const serviceFaqSchema = z.object({
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().min(1).max(5000),
});

const serviceBaseSchema = z.object({
  title: z.string().trim().min(1).max(160),
  slug: slugSchema,
  shortDescription: shortTextSchema.optional(),
  cardImage: imageRefSchema.optional(),
  iconAccent: z.string().trim().max(80).optional(),
  ctaText: z.string().trim().max(80).optional(),
  heroHeading: shortTextSchema.optional(),
  heroSubheading: shortTextSchema.optional(),
  heroImage: imageRefSchema.optional(),
  overview: longTextSchema.optional(),
  intendedGuestType: shortTextSchema.optional(),
  benefits: z.array(z.string().trim().max(200)).max(20).default([]),
  experienceDetails: longTextSchema.optional(),
  inquirySteps: z.array(z.string().trim().max(300)).max(10).default([]),
  seasonalNotes: longTextSchema.optional(),
  safetyPolicies: longTextSchema.optional(),
  relatedCabinSlugs: z.array(slugSchema).max(8).default([]),
  relatedServiceSlugs: z.array(slugSchema).max(8).default([]),
  serviceFaqs: z.array(serviceFaqSchema).max(20).default([]),
  sectionImages: z.array(imageRefSchema).max(12).default([]),
  status: publishStatusSchema.default("published"),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  seo: seoSchema.optional(),
});

export const serviceCreateSchema = serviceBaseSchema;

export const serviceUpdateSchema = serviceBaseSchema.partial().extend({
  id: objectIdSchema.optional(),
});

export const serviceCardUpdateSchema = serviceBaseSchema.pick({
  title: true,
  slug: true,
  shortDescription: true,
  cardImage: true,
  iconAccent: true,
  ctaText: true,
  status: true,
  sortOrder: true,
});

export const serviceDetailUpdateSchema = serviceBaseSchema.pick({
  heroHeading: true,
  heroSubheading: true,
  heroImage: true,
  overview: true,
  intendedGuestType: true,
  benefits: true,
  experienceDetails: true,
  inquirySteps: true,
  seasonalNotes: true,
  safetyPolicies: true,
  relatedCabinSlugs: true,
  relatedServiceSlugs: true,
  serviceFaqs: true,
  sectionImages: true,
  seo: true,
});

export type ServiceCreateInput = z.infer<typeof serviceCreateSchema>;
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;
