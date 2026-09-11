import mongoose, { type Document, type Model, Schema } from "mongoose";

import { archiveFields } from "@/models/shared/schemas";

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

export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export type FaqStatus = "draft" | "published";

export interface IFAQ extends Document {
  question: string;
  answer: string;
  category: FaqCategory;
  relatedPageSlug?: string;
  relatedCabinId?: Schema.Types.ObjectId;
  relatedServiceId?: Schema.Types.ObjectId;
  status: FaqStatus;
  sortOrder: number;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema<IFAQ>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: FAQ_CATEGORIES,
      required: true,
      index: true,
    },
    relatedPageSlug: { type: String, trim: true },
    relatedCabinId: { type: Schema.Types.ObjectId, ref: "Cabin", index: true },
    relatedServiceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    sortOrder: { type: Number, default: 0, index: true },
    ...archiveFields,
  },
  { timestamps: true },
);

faqSchema.index({ category: 1, status: 1, sortOrder: 1 });
faqSchema.index({ status: 1, isArchived: 1 });

const FAQ: Model<IFAQ> =
  mongoose.models.FAQ ?? mongoose.model<IFAQ>("FAQ", faqSchema);

export default FAQ;
