import mongoose, { type Document, type Model, Schema } from "mongoose";

import { PAGE_SECTION_TYPES, type PageSectionType } from "@/lib/pages/page-section-types";
import {
  archiveFields,
  imageRefSchema,
  seoSchema,
  statItemSchema,
  type IImageRef,
  type ISeoFields,
  type IStatItem,
} from "@/models/shared/schemas";

export { PAGE_SECTION_TYPES, type PageSectionType };

export type PageStatus = "draft" | "published";

export interface IPageSection {
  sectionKey: string;
  type: PageSectionType;
  enabled: boolean;
  order: number;
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  body?: string;
  quote?: string;
  listItems?: string[];
  stats?: IStatItem[];
  ctaText?: string;
  ctaUrl?: string;
  label?: string;
  images?: IImageRef[];
  backgroundImage?: IImageRef;
  foregroundImage?: IImageRef;
  metadata?: Record<string, unknown>;
}

export interface IPage extends Document {
  slug: string;
  title: string;
  status: PageStatus;
  sections: IPageSection[];
  seo: ISeoFields;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const pageSectionSchema = new Schema<IPageSection>(
  {
    sectionKey: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: PAGE_SECTION_TYPES,
    },
    enabled: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
    eyebrow: { type: String, trim: true },
    heading: { type: String, trim: true },
    subheading: { type: String, trim: true },
    body: { type: String, trim: true },
    quote: { type: String, trim: true },
    listItems: [{ type: String, trim: true }],
    stats: [statItemSchema],
    ctaText: { type: String, trim: true },
    ctaUrl: { type: String, trim: true },
    label: { type: String, trim: true },
    images: [imageRefSchema],
    backgroundImage: imageRefSchema,
    foregroundImage: imageRefSchema,
    metadata: { type: Schema.Types.Mixed },
  },
  { _id: true },
);

const pageSchema = new Schema<IPage>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    sections: [pageSectionSchema],
    seo: { type: seoSchema, default: () => ({}) },
    ...archiveFields,
  },
  { timestamps: true },
);

pageSchema.index({ status: 1, isArchived: 1 });
pageSchema.index({ "sections.sectionKey": 1 });

const Page: Model<IPage> =
  mongoose.models.Page ?? mongoose.model<IPage>("Page", pageSchema);

export default Page;
