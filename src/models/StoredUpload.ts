import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IStoredUpload extends Document {
  folder: string;
  filename: string;
  mimeType: string;
  size: number;
  data: Buffer;
  createdAt: Date;
  updatedAt: Date;
}

const storedUploadSchema = new Schema<IStoredUpload>(
  {
    folder: { type: String, required: true, trim: true, index: true },
    filename: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    size: { type: Number, required: true, min: 0 },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

storedUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

const StoredUpload =
  (mongoose.models.StoredUpload as Model<IStoredUpload>) ||
  mongoose.model<IStoredUpload>("StoredUpload", storedUploadSchema);

export default StoredUpload;
