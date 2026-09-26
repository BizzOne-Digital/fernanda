import mongoose, { type Document, type Model, Schema } from "mongoose";

export const GUEST_MEMORY_STATUSES = ["pending", "approved", "rejected"] as const;

export type GuestMemoryStatus = (typeof GUEST_MEMORY_STATUSES)[number];

export interface IGuestMemory extends Document {
  guestName: string;
  email?: string;
  story: string;
  photoUrl?: string;
  photoAlt?: string;
  consentGiven: boolean;
  status: GuestMemoryStatus;
  adminNotes?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const guestMemorySchema = new Schema<IGuestMemory>(
  {
    guestName: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    story: { type: String, required: true, trim: true },
    photoUrl: { type: String, trim: true },
    photoAlt: { type: String, trim: true },
    consentGiven: { type: Boolean, required: true },
    status: {
      type: String,
      enum: GUEST_MEMORY_STATUSES,
      default: "pending",
      index: true,
    },
    adminNotes: { type: String, trim: true },
    approvedAt: { type: Date },
  },
  { timestamps: true },
);

guestMemorySchema.index({ status: 1, createdAt: -1 });

const GuestMemory: Model<IGuestMemory> =
  mongoose.models.GuestMemory ?? mongoose.model<IGuestMemory>("GuestMemory", guestMemorySchema);

export default GuestMemory;
