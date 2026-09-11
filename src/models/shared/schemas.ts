import { Schema } from "mongoose";

export interface IFocalPoint {
  x: number;
  y: number;
}

export interface IImageRef {
  mediaId?: Schema.Types.ObjectId | string;
  url: string;
  alt: string;
  caption?: string;
  credit?: string;
  focalPoint?: IFocalPoint;
}

export interface ISeoFields {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: IImageRef;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface IArchiveFields {
  isArchived: boolean;
  archivedAt?: Date;
}

export interface IStatItem {
  label: string;
  value: string;
}

export interface ICabinSleepingRow {
  bedType: string;
  count: number;
  location: string;
  notes?: string;
}

export interface ICabinFaqItem {
  question: string;
  answer: string;
  order: number;
}

export const focalPointSchema = new Schema<IFocalPoint>(
  {
    x: { type: Number, default: 0.5, min: 0, max: 1 },
    y: { type: Number, default: 0.5, min: 0, max: 1 },
  },
  { _id: false },
);

export const imageRefSchema = new Schema<IImageRef>(
  {
    mediaId: { type: Schema.Types.ObjectId, ref: "MediaAsset" },
    url: { type: String, required: true, trim: true },
    alt: { type: String, default: "", trim: true },
    caption: { type: String, default: "", trim: true },
    credit: { type: String, default: "", trim: true },
    focalPoint: { type: focalPointSchema },
  },
  { _id: false },
);

export const seoSchema = new Schema<ISeoFields>(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    keywords: [{ type: String, trim: true }],
    ogImage: { type: imageRefSchema },
    canonicalUrl: { type: String, trim: true },
    noIndex: { type: Boolean, default: false },
  },
  { _id: false },
);

export const archiveFields = {
  isArchived: { type: Boolean, default: false, index: true },
  archivedAt: { type: Date },
};

export const statItemSchema = new Schema<IStatItem>(
  {
    label: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
  },
  { _id: false },
);

export const sleepingRowSchema = new Schema<ICabinSleepingRow>(
  {
    bedType: { type: String, required: true, trim: true },
    count: { type: Number, required: true, min: 1 },
    location: { type: String, required: true, trim: true },
    notes: { type: String, trim: true },
  },
  { _id: false },
);

export const cabinFaqItemSchema = new Schema<ICabinFaqItem>(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
  },
  { _id: false },
);
