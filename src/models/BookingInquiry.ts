import mongoose, { type Document, type Model, Schema } from "mongoose";
import {
  BOOKING_INQUIRY_STATUSES,
  type BookingInquiryStatus,
} from "@/lib/booking/inquiry-constants";

export { BOOKING_INQUIRY_STATUSES, type BookingInquiryStatus };

export interface IBookingInquirySnapshot {
  arrivalDate: Date;
  departureDate: Date;
  dateFlexible: boolean;
  adults: number;
  children: number;
  preferredCabinIds: string[];
  preferredCabinLabels: string[];
  helpMeChoose: boolean;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  provinceState?: string;
  country?: string;
  stayTypeInterest?: string;
  activitiesInterest?: string[];
  specialRequests?: string;
  message?: string;
  howHeardAbout?: string;
  consentGiven: boolean;
  submittedAt: Date;
}

export interface IBookingInquiryStatusHistoryEntry {
  status: BookingInquiryStatus;
  changedAt: Date;
  changedBy?: Schema.Types.ObjectId;
  note?: string;
}

export interface IBookingInquiry extends Document {
  inquiryNumber: string;
  snapshot: IBookingInquirySnapshot;
  status: BookingInquiryStatus;
  statusHistory: IBookingInquiryStatusHistoryEntry[];
  quoteAmount?: number;
  quoteCurrency: string;
  adminNotes?: string;
  assignedCabinId?: Schema.Types.ObjectId;
  followUpDate?: Date;
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingInquirySnapshotSchema = new Schema<IBookingInquirySnapshot>(
  {
    arrivalDate: { type: Date, required: true },
    departureDate: { type: Date, required: true },
    dateFlexible: { type: Boolean, default: false },
    adults: { type: Number, required: true, min: 1 },
    children: { type: Number, default: 0, min: 0 },
    preferredCabinIds: [{ type: String }],
    preferredCabinLabels: [{ type: String }],
    helpMeChoose: { type: Boolean, default: false },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    provinceState: { type: String, trim: true },
    country: { type: String, trim: true },
    stayTypeInterest: { type: String, trim: true },
    activitiesInterest: [{ type: String, trim: true }],
    specialRequests: { type: String, trim: true },
    message: { type: String, trim: true },
    howHeardAbout: { type: String, trim: true },
    consentGiven: { type: Boolean, required: true },
    submittedAt: { type: Date, required: true },
  },
  { _id: false },
);

const statusHistorySchema = new Schema<IBookingInquiryStatusHistoryEntry>(
  {
    status: {
      type: String,
      enum: BOOKING_INQUIRY_STATUSES,
      required: true,
    },
    changedAt: { type: Date, required: true, default: Date.now },
    changedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    note: { type: String, trim: true },
  },
  { _id: true },
);

const bookingInquirySchema = new Schema<IBookingInquiry>(
  {
    inquiryNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    snapshot: { type: bookingInquirySnapshotSchema, required: true },
    status: {
      type: String,
      enum: BOOKING_INQUIRY_STATUSES,
      default: "new",
      index: true,
    },
    statusHistory: { type: [statusHistorySchema], default: [] },
    quoteAmount: { type: Number, min: 0 },
    quoteCurrency: { type: String, default: "CAD", trim: true },
    adminNotes: { type: String, trim: true },
    assignedCabinId: { type: Schema.Types.ObjectId, ref: "Cabin" },
    followUpDate: { type: Date, index: true },
    source: { type: String, trim: true },
  },
  { timestamps: true },
);

bookingInquirySchema.index({ status: 1, createdAt: -1 });
bookingInquirySchema.index({
  "snapshot.arrivalDate": 1,
  "snapshot.departureDate": 1,
});
bookingInquirySchema.index({ "snapshot.email": 1 });
bookingInquirySchema.index({ createdAt: -1 });

const BookingInquiry: Model<IBookingInquiry> =
  mongoose.models.BookingInquiry ??
  mongoose.model<IBookingInquiry>("BookingInquiry", bookingInquirySchema);

export default BookingInquiry;
