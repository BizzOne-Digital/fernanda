import mongoose, { type Document, type Model, Schema } from "mongoose";

import {
  archiveFields,
  cabinFaqItemSchema,
  imageRefSchema,
  seoSchema,
  sleepingRowSchema,
  type ICabinFaqItem,
  type IImageRef,
  type ISeoFields,
  type ICabinSleepingRow,
} from "@/models/shared/schemas";

export type CabinStatus = "draft" | "published";

export interface ICabin extends Document {
  cabinNumber: number;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription?: string;
  capacity: number;
  hasSeparateBedroom: boolean;
  sleepingSummary: string;
  sleepingArrangement: ICabinSleepingRow[];
  cardImage?: IImageRef;
  heroHeading?: string;
  heroSubheading?: string;
  heroImage?: IImageRef;
  galleryImages: IImageRef[];
  featureHighlights: string[];
  amenities: string[];
  sharedAmenitiesOverride?: string[];
  packingNotes?: string;
  importantNotes?: string;
  bestSuitedFor?: string;
  cabinFaqs: ICabinFaqItem[];
  relatedCabinIds: Schema.Types.ObjectId[];
  status: CabinStatus;
  sortOrder: number;
  seo: ISeoFields;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const cabinSchema = new Schema<ICabin>(
  {
    cabinNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: { type: String, required: true, trim: true },
    fullDescription: { type: String, trim: true },
    capacity: { type: Number, required: true, min: 1 },
    hasSeparateBedroom: { type: Boolean, default: false, index: true },
    sleepingSummary: { type: String, required: true, trim: true },
    sleepingArrangement: [sleepingRowSchema],
    cardImage: imageRefSchema,
    heroHeading: { type: String, trim: true },
    heroSubheading: { type: String, trim: true },
    heroImage: imageRefSchema,
    galleryImages: { type: [imageRefSchema], default: [] },
    featureHighlights: [{ type: String, trim: true }],
    amenities: [{ type: String, trim: true }],
    sharedAmenitiesOverride: [{ type: String, trim: true }],
    packingNotes: { type: String, trim: true },
    importantNotes: { type: String, trim: true },
    bestSuitedFor: { type: String, trim: true },
    cabinFaqs: [cabinFaqItemSchema],
    relatedCabinIds: [{ type: Schema.Types.ObjectId, ref: "Cabin" }],
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    sortOrder: { type: Number, default: 0, index: true },
    seo: { type: seoSchema, default: () => ({}) },
    ...archiveFields,
  },
  { timestamps: true },
);

cabinSchema.index({ status: 1, isArchived: 1, sortOrder: 1 });
cabinSchema.index({ capacity: 1, hasSeparateBedroom: 1 });

const Cabin: Model<ICabin> =
  mongoose.models.Cabin ?? mongoose.model<ICabin>("Cabin", cabinSchema);

export default Cabin;
