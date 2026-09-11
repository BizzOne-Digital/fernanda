import mongoose, { type Document, type Model, Schema } from "mongoose";

export interface IAdminUser extends Document {
  email: string;
  passwordHash: string;
  name?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const adminUserSchema = new Schema<IAdminUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, trim: true },
    lastLoginAt: { type: Date },
  },
  { timestamps: true },
);

const AdminUser: Model<IAdminUser> =
  mongoose.models.AdminUser ??
  mongoose.model<IAdminUser>("AdminUser", adminUserSchema);

export default AdminUser;
