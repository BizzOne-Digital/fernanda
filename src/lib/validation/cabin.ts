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

const sleepingRowSchema = z.object({
  room: z.string().trim().min(1).max(120),
  beds: z.string().trim().min(1).max(200),
});

const cabinFaqSchema = z.object({
  question: z.string().trim().min(1).max(500),
  answer: z.string().trim().min(1).max(5000),
});

const cabinBaseSchema = z.object({
  cabinNumber: z.coerce.number().int().min(1).max(99),
  name: z.string().trim().min(1).max(120),
  slug: slugSchema,
  shortDescription: shortTextSchema.optional(),
  capacity: z.coerce.number().int().min(1).max(20),
  sleepingSummary: shortTextSchema.optional(),
  sleepingRows: z.array(sleepingRowSchema).max(10).default([]),
  hasSeparateBedroom: z.boolean().default(false),
  featureHighlights: z.array(z.string().trim().max(120)).max(20).default([]),
  cardImage: imageRefSchema.optional(),
  heroHeading: shortTextSchema.optional(),
  heroSubheading: shortTextSchema.optional(),
  heroImage: imageRefSchema.optional(),
  fullDescription: longTextSchema.optional(),
  bestSuitedFor: shortTextSchema.optional(),
  amenities: z.array(z.string().trim().max(120)).max(30).default([]),
  sharedAmenitiesOverride: z.array(z.string().trim().max(120)).max(30).default([]),
  packingNotes: longTextSchema.optional(),
  detailImages: z.array(imageRefSchema).max(24).default([]),
  importantNotes: longTextSchema.optional(),
  cabinFaqs: z.array(cabinFaqSchema).max(20).default([]),
  relatedCabinSlugs: z.array(slugSchema).max(8).default([]),
  status: publishStatusSchema.default("published"),
  sortOrder: z.coerce.number().int().min(0).max(9999).default(0),
  seo: seoSchema.optional(),
});

export const cabinCreateSchema = cabinBaseSchema;

export const cabinUpdateSchema = cabinBaseSchema.partial().extend({
  id: objectIdSchema.optional(),
});

export const cabinListingUpdateSchema = cabinBaseSchema.pick({
  cabinNumber: true,
  name: true,
  slug: true,
  shortDescription: true,
  capacity: true,
  sleepingSummary: true,
  sleepingRows: true,
  hasSeparateBedroom: true,
  featureHighlights: true,
  cardImage: true,
  status: true,
  sortOrder: true,
});

export const cabinDetailUpdateSchema = cabinBaseSchema.pick({
  heroHeading: true,
  heroSubheading: true,
  heroImage: true,
  fullDescription: true,
  bestSuitedFor: true,
  amenities: true,
  sharedAmenitiesOverride: true,
  packingNotes: true,
  detailImages: true,
  importantNotes: true,
  cabinFaqs: true,
  relatedCabinSlugs: true,
  seo: true,
});

export type CabinCreateInput = z.infer<typeof cabinCreateSchema>;
export type CabinUpdateInput = z.infer<typeof cabinUpdateSchema>;
