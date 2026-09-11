import mongoose, { type Document, type Model, Schema } from "mongoose";

export const CONTACT_MESSAGE_STATUSES = [
  "new",
  "read",
  "replied",
  "archived",
  "spam",
] as const;

export type ContactMessageStatus = (typeof CONTACT_MESSAGE_STATUSES)[number];

export interface IContactMessage extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  consentGiven: boolean;
  status: ContactMessageStatus;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const contactMessageSchema = new Schema<IContactMessage>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: { type: String, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    consentGiven: { type: Boolean, required: true },
    status: {
      type: String,
      enum: CONTACT_MESSAGE_STATUSES,
      default: "new",
      index: true,
    },
    adminNotes: { type: String, trim: true },
  },
  { timestamps: true },
);

contactMessageSchema.index({ status: 1, createdAt: -1 });
contactMessageSchema.index({ createdAt: -1 });

const ContactMessage: Model<IContactMessage> =
  mongoose.models.ContactMessage ??
  mongoose.model<IContactMessage>("ContactMessage", contactMessageSchema);

export default ContactMessage;
