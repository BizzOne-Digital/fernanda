import mongoose, { type Document, type Model, Schema } from "mongoose";

import {
  archiveFields,
  focalPointSchema,
  type IFocalPoint,
} from "@/models/shared/schemas";

export interface IMediaDimensions {
  width: number;
  height: number;
}

export interface IMediaVariant {
  label: string;
  diskPath: string;
  publicUrl: string;
  width: number;
  height: number;
  bytes: number;
}

export interface IMediaMetadata {
  variants?: IMediaVariant[];
  dominantColor?: string;
  exif?: Record<string, unknown>;
}

export type MediaAssetStatus = "draft" | "published";

export interface IMediaAsset extends Document {
  originalFilename: string;
  diskPath: string;
  publicUrl: string;
  mimeType: string;
  bytes: number;
  dimensions: IMediaDimensions;
  alt: string;
  caption?: string;
  credit?: string;
  categoryId?: Schema.Types.ObjectId;
  categorySlug?: string;
  focalPoint?: IFocalPoint;
  referenceCount: number;
  metadata: IMediaMetadata;
  uploadedBy?: Schema.Types.ObjectId;
  featured: boolean;
  status: MediaAssetStatus;
  sortOrder: number;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const mediaDimensionsSchema = new Schema<IMediaDimensions>(
  {
    width: { type: Number, required: true, min: 0 },
    height: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const mediaVariantSchema = new Schema<IMediaVariant>(
  {
    label: { type: String, required: true, trim: true },
    diskPath: { type: String, required: true, trim: true },
    publicUrl: { type: String, required: true, trim: true },
    width: { type: Number, required: true, min: 0 },
    height: { type: Number, required: true, min: 0 },
    bytes: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const mediaMetadataSchema = new Schema<IMediaMetadata>(
  {
    variants: [mediaVariantSchema],
    dominantColor: { type: String, trim: true },
    exif: { type: Schema.Types.Mixed },
  },
  { _id: false },
);

const mediaAssetSchema = new Schema<IMediaAsset>(
  {
    originalFilename: { type: String, required: true, trim: true },
    diskPath: { type: String, required: true, trim: true, unique: true },
    publicUrl: { type: String, required: true, trim: true, index: true },
    mimeType: { type: String, required: true, trim: true },
    bytes: { type: Number, required: true, min: 0 },
    dimensions: { type: mediaDimensionsSchema, required: true },
    alt: { type: String, default: "", trim: true },
    caption: { type: String, default: "", trim: true },
    credit: { type: String, default: "", trim: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "GalleryCategory",
      index: true,
    },
    categorySlug: { type: String, trim: true, index: true },
    focalPoint: focalPointSchema,
    referenceCount: { type: Number, default: 0, min: 0, index: true },
    metadata: { type: mediaMetadataSchema, default: () => ({}) },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    featured: { type: Boolean, default: false, index: true },
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

mediaAssetSchema.index({ categoryId: 1, sortOrder: 1, status: 1 });
mediaAssetSchema.index({ status: 1, isArchived: 1, featured: -1, sortOrder: 1 });
mediaAssetSchema.index({ referenceCount: 1 });

const MediaAsset: Model<IMediaAsset> =
  mongoose.models.MediaAsset ??
  mongoose.model<IMediaAsset>("MediaAsset", mediaAssetSchema);

export default MediaAsset;
