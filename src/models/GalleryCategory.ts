import mongoose, { type Document, type Model, Schema } from "mongoose";

import { archiveFields, imageRefSchema, type IImageRef } from "@/models/shared/schemas";

export type GalleryCategoryStatus = "draft" | "published";

export interface IGalleryCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  coverImage?: IImageRef;
  status: GalleryCategoryStatus;
  sortOrder: number;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const galleryCategorySchema = new Schema<IGalleryCategory>(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: { type: String, trim: true },
    coverImage: imageRefSchema,
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
      index: true,
    },
    sortOrder: { type: Number, default: 0, index: true },
    ...archiveFields,
  },
  { timestamps: true },
);

galleryCategorySchema.index({ status: 1, isArchived: 1, sortOrder: 1 });

const GalleryCategory: Model<IGalleryCategory> =
  mongoose.models.GalleryCategory ??
  mongoose.model<IGalleryCategory>("GalleryCategory", galleryCategorySchema);

export default GalleryCategory;
