import mongoose, { type Document, type Model, Schema } from "mongoose";

import {
  archiveFields,
  imageRefSchema,
  seoSchema,
  type IImageRef,
  type ISeoFields,
} from "@/models/shared/schemas";

export const ATTRACTION_CATEGORIES = [
  "On-Property",
  "Nature",
  "Food & Wine",
  "Family",
  "Scenic Drives",
  "Day Trips",
] as const;

export type AttractionCategory = (typeof ATTRACTION_CATEGORIES)[number];

export type AttractionStatus = "draft" | "published";

export interface IAttraction extends Document {
  title: string;
  slug: string;
  category: AttractionCategory;
  summary: string;
  body?: string;
  images: IImageRef[];
  address?: string;
  mapLink?: string;
  website?: string;
  travelTimeText?: string;
  season?: string;
  familyNotes?: string;
  verificationDate?: Date;
  isVerified: boolean;
  featured: boolean;
  status: AttractionStatus;
  sortOrder: number;
  seo: ISeoFields;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const attractionSchema = new Schema<IAttraction>(
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
    category: {
      type: String,
      enum: ATTRACTION_CATEGORIES,
      required: true,
      index: true,
    },
    summary: { type: String, required: true, trim: true },
    body: { type: String, trim: true },
    images: { type: [imageRefSchema], default: [] },
    address: { type: String, trim: true },
    mapLink: { type: String, trim: true },
    website: { type: String, trim: true },
    travelTimeText: { type: String, trim: true },
    season: { type: String, trim: true },
    familyNotes: { type: String, trim: true },
    verificationDate: { type: Date },
    isVerified: { type: Boolean, default: false, index: true },
    featured: { type: Boolean, default: false, index: true },
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

attractionSchema.index({ category: 1, status: 1, sortOrder: 1 });
attractionSchema.index({ status: 1, isArchived: 1, featured: -1 });

const Attraction: Model<IAttraction> =
  mongoose.models.Attraction ??
  mongoose.model<IAttraction>("Attraction", attractionSchema);

export default Attraction;
