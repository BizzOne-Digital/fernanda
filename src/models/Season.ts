import mongoose, { type Document, type Model, Schema } from "mongoose";

import { archiveFields } from "@/models/shared/schemas";

export interface ISeason extends Document {
  name: string;
  year?: number;
  startDate: Date;
  endDate: Date;
  weeklyAvailabilityText?: string;
  minimumStayText?: string;
  variabilityNote?: string;
  publicInquiryNote?: string;
  adminQuoteGuidance?: string;
  lastMinuteOfferText?: string;
  lastMinuteStartDate?: Date;
  lastMinuteEndDate?: Date;
  lastMinuteCabinIds: Schema.Types.ObjectId[];
  lastMinuteActive: boolean;
  isActive: boolean;
  isPublished: boolean;
  sortOrder: number;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const seasonSchema = new Schema<ISeason>(
  {
    name: { type: String, required: true, trim: true },
    year: { type: Number, index: true },
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    weeklyAvailabilityText: { type: String, trim: true },
    minimumStayText: { type: String, trim: true },
    variabilityNote: { type: String, trim: true },
    publicInquiryNote: { type: String, trim: true },
    adminQuoteGuidance: { type: String, trim: true },
    lastMinuteOfferText: { type: String, trim: true },
    lastMinuteStartDate: { type: Date },
    lastMinuteEndDate: { type: Date },
    lastMinuteCabinIds: [{ type: Schema.Types.ObjectId, ref: "Cabin" }],
    lastMinuteActive: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0, index: true },
    ...archiveFields,
  },
  { timestamps: true },
);

seasonSchema.index({ isActive: 1, isArchived: 1, sortOrder: 1 });
seasonSchema.index({ startDate: 1, endDate: 1 });

const Season: Model<ISeason> =
  mongoose.models.Season ?? mongoose.model<ISeason>("Season", seasonSchema);

export default Season;
