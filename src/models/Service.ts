import mongoose, { type Document, type Model, Schema } from "mongoose";

import {
  archiveFields,
  cabinFaqItemSchema,
  imageRefSchema,
  seoSchema,
  type ICabinFaqItem,
  type IImageRef,
  type ISeoFields,
} from "@/models/shared/schemas";

export type ServiceStatus = "draft" | "published" | "archived";

export interface IService extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  iconAccent?: string;
  cardImage?: IImageRef;
  ctaText?: string;
  ctaUrl?: string;
  heroEyebrow?: string;
  heroHeading?: string;
  heroSubheading?: string;
  heroImage?: IImageRef;
  overview?: string;
  benefits: string[];
  experienceDetails?: string;
  inquirySteps: string[];
  seasonalNotes?: string;
  safetyPolicies?: string;
  sectionImages: IImageRef[];
  relatedCabinIds: Schema.Types.ObjectId[];
  relatedServiceIds: Schema.Types.ObjectId[];
  faqs: ICabinFaqItem[];
  status: ServiceStatus;
  sortOrder: number;
  seo: ISeoFields;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: { type: String, required: true, trim: true },
    iconAccent: { type: String, trim: true },
    cardImage: imageRefSchema,
    ctaText: { type: String, trim: true },
    ctaUrl: { type: String, trim: true },
    heroEyebrow: { type: String, trim: true },
    heroHeading: { type: String, trim: true },
    heroSubheading: { type: String, trim: true },
    heroImage: imageRefSchema,
    overview: { type: String, trim: true },
    benefits: [{ type: String, trim: true }],
    experienceDetails: { type: String, trim: true },
    inquirySteps: [{ type: String, trim: true }],
    seasonalNotes: { type: String, trim: true },
    safetyPolicies: { type: String, trim: true },
    sectionImages: { type: [imageRefSchema], default: [] },
    relatedCabinIds: [{ type: Schema.Types.ObjectId, ref: "Cabin" }],
    relatedServiceIds: [{ type: Schema.Types.ObjectId, ref: "Service" }],
    faqs: [cabinFaqItemSchema],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
      index: true,
    },
    sortOrder: { type: Number, default: 0, index: true },
    seo: { type: seoSchema, default: () => ({}) },
    ...archiveFields,
  },
  { timestamps: true },
);

serviceSchema.index({ status: 1, isArchived: 1, sortOrder: 1 });

const Service: Model<IService> =
  mongoose.models.Service ?? mongoose.model<IService>("Service", serviceSchema);

export default Service;
