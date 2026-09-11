import mongoose, { type Document, type Model, Schema } from "mongoose";

import { archiveFields } from "@/models/shared/schemas";

export const AVAILABILITY_BLOCK_STATUSES = [
  "available-note",
  "tentative",
  "held",
  "confirmed",
  "owner-blocked",
  "maintenance",
] as const;

export type AvailabilityBlockStatus =
  (typeof AVAILABILITY_BLOCK_STATUSES)[number];

export interface IAvailabilityBlock extends Document {
  cabinId: Schema.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  status: AvailabilityBlockStatus;
  adminNotes?: string;
  privateReason?: string;
  guestLabel?: string;
  bookingInquiryId?: Schema.Types.ObjectId;
  createdBy?: Schema.Types.ObjectId;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const availabilityBlockSchema = new Schema<IAvailabilityBlock>(
  {
    cabinId: {
      type: Schema.Types.ObjectId,
      ref: "Cabin",
      required: true,
      index: true,
    },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    status: {
      type: String,
      enum: AVAILABILITY_BLOCK_STATUSES,
      required: true,
      index: true,
    },
    adminNotes: { type: String, trim: true },
    privateReason: { type: String, trim: true },
    guestLabel: { type: String, trim: true },
    bookingInquiryId: {
      type: Schema.Types.ObjectId,
      ref: "BookingInquiry",
      index: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    ...archiveFields,
  },
  { timestamps: true },
);

availabilityBlockSchema.index({ cabinId: 1, startDate: 1, endDate: 1 });
availabilityBlockSchema.index({
  cabinId: 1,
  status: 1,
  startDate: 1,
  endDate: 1,
});
availabilityBlockSchema.index({ status: 1, isArchived: 1 });

const AvailabilityBlock: Model<IAvailabilityBlock> =
  mongoose.models.AvailabilityBlock ??
  mongoose.model<IAvailabilityBlock>(
    "AvailabilityBlock",
    availabilityBlockSchema,
  );

export default AvailabilityBlock;
