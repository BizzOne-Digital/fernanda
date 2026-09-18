import mongoose, { type Document, type Model, Schema, type Types } from "mongoose";

import {
  GALLERY_PHOTO_CATEGORIES,
  type GalleryPhotoCategory,
  type GalleryPhotoStatus,
} from "@/lib/gallery/photo-constants";
import { archiveFields } from "@/models/shared/schemas";

export { GALLERY_PHOTO_CATEGORIES, type GalleryPhotoCategory, type GalleryPhotoStatus };

export interface IGalleryPhoto extends Document {
  url: string;
  alt: string;
  caption?: string;
  category: GalleryPhotoCategory;
  /** Admin gallery category (Gallery → Manage category). */
  galleryCategoryId?: Types.ObjectId | null;
  sortOrder: number;
  featured: boolean;
  status: GalleryPhotoStatus;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const galleryPhotoSchema = new Schema<IGalleryPhoto>(
  {
    url: { type: String, required: true, trim: true, unique: true },
    alt: { type: String, required: true, trim: true },
    caption: { type: String, trim: true },
    category: {
      type: String,
      enum: GALLERY_PHOTO_CATEGORIES,
      default: "property",
    },
    galleryCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "GalleryCategory",
      default: null,
      index: true,
    },
    sortOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: ["draft", "published"], default: "published" },
    ...archiveFields,
  },
  { timestamps: true },
);

galleryPhotoSchema.index({ status: 1, isArchived: 1, sortOrder: 1 });

const GalleryPhoto =
  (mongoose.models.GalleryPhoto as Model<IGalleryPhoto>) ||
  mongoose.model<IGalleryPhoto>("GalleryPhoto", galleryPhotoSchema);

export default GalleryPhoto;
