import mongoose, { type Document, type Model, Schema } from "mongoose";

import { archiveFields, imageRefSchema, type IImageRef } from "@/models/shared/schemas";

export type TestimonialStatus = "draft" | "published";

export interface ITestimonial extends Document {
  guestName: string;
  location?: string;
  quote: string;
  stayLabel?: string;
  image?: IImageRef;
  featured: boolean;
  isDemo: boolean;
  status: TestimonialStatus;
  sortOrder: number;
  isArchived: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    guestName: { type: String, required: true, trim: true },
    location: { type: String, trim: true },
    quote: { type: String, required: true, trim: true },
    stayLabel: { type: String, trim: true },
    image: imageRefSchema,
    featured: { type: Boolean, default: false, index: true },
    isDemo: { type: Boolean, default: false },
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

testimonialSchema.index({ status: 1, isArchived: 1, featured: -1, sortOrder: 1 });

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial ??
  mongoose.model<ITestimonial>("Testimonial", testimonialSchema);

export default Testimonial;
