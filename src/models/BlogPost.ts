import mongoose, { type Document, type Model, Schema } from "mongoose";

import {
  archiveFields,
  imageRefSchema,
  seoSchema,
  type IImageRef,
  type ISeoFields,
} from "@/models/shared/schemas";

export type BlogPostStatus = "draft" | "published";

export interface IBlogPost extends Document {
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: IImageRef;
  authorDisplayName: string;
  category?: string;
  tags: string[];
  content: string;
  inlineImages: IImageRef[];
  status: BlogPostStatus;
  publishDate?: Date;
  isDemo: boolean;
  seo: ISeoFields;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
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
    excerpt: { type: String, required: true, trim: true },
    coverImage: imageRefSchema,
    authorDisplayName: { type: String, required: true, trim: true },
    category: { type: String, trim: true, index: true },
    tags: [{ type: String, trim: true }],
    content: { type: String, required: true },
    inlineImages: { type: [imageRefSchema], default: [] },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },
    publishDate: { type: Date, index: true },
    isDemo: { type: Boolean, default: false },
    seo: { type: seoSchema, default: () => ({}) },
    ...archiveFields,
  },
  { timestamps: true },
);

blogPostSchema.index({ status: 1, publishDate: -1 });
blogPostSchema.index({ status: 1, isArchived: 1, category: 1 });

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost ??
  mongoose.model<IBlogPost>("BlogPost", blogPostSchema);

export default BlogPost;
