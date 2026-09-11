import { z } from "zod";
import {
  dateInputSchema,
  dateRangeRefinement,
  objectIdSchema,
  shortTextSchema,
} from "./common";
import { AVAILABILITY_BLOCK_STATUSES } from "@/models/AvailabilityBlock";

export const availabilityStatusSchema = z.enum(AVAILABILITY_BLOCK_STATUSES);

const availabilityBlockBaseSchema = z.object({
  cabinId: objectIdSchema.optional().nullable(),
  cabinNumber: z.coerce.number().int().min(1).max(99).optional().nullable(),
  startDate: dateInputSchema,
  endDate: dateInputSchema,
  status: availabilityStatusSchema,
  publicNote: shortTextSchema.optional(),
  adminNote: z.string().trim().max(5000).optional(),
  inquiryId: objectIdSchema.optional().nullable(),
});

export const availabilityBlockSchema = availabilityBlockBaseSchema
  .superRefine(dateRangeRefinement)
  .superRefine((data, ctx) => {
    if (!data.cabinId && !data.cabinNumber) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A cabin ID or cabin number is required",
        path: ["cabinId"],
      });
    }
  });

export const availabilityBlockUpdateSchema = availabilityBlockBaseSchema
  .partial()
  .extend({
    id: objectIdSchema,
  });

export type AvailabilityBlockInput = z.infer<typeof availabilityBlockSchema>;
export type AvailabilityBlockUpdateInput = z.infer<
  typeof availabilityBlockUpdateSchema
>;
