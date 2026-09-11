import mongoose, { type Document, type Model, Schema } from "mongoose";

export const ACTIVITY_LOG_ACTIONS = [
  "create",
  "update",
  "delete",
  "archive",
  "restore",
  "publish",
  "unpublish",
  "login",
  "logout",
  "upload",
  "export",
  "status-change",
] as const;

export type ActivityLogAction = (typeof ACTIVITY_LOG_ACTIONS)[number];

export interface IActivityLog extends Document {
  action: ActivityLogAction;
  entityType: string;
  entityId?: Schema.Types.ObjectId | string;
  entityLabel?: string;
  adminUserId?: Schema.Types.ObjectId;
  adminEmail?: string;
  summary: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const activityLogSchema = new Schema<IActivityLog>(
  {
    action: {
      type: String,
      enum: ACTIVITY_LOG_ACTIONS,
      required: true,
      index: true,
    },
    entityType: { type: String, required: true, trim: true, index: true },
    entityId: { type: Schema.Types.Mixed, index: true },
    entityLabel: { type: String, trim: true },
    adminUserId: { type: Schema.Types.ObjectId, ref: "AdminUser", index: true },
    adminEmail: { type: String, trim: true, lowercase: true },
    summary: { type: String, required: true, trim: true },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  { timestamps: true },
);

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
activityLogSchema.index({ adminUserId: 1, createdAt: -1 });

const ActivityLog: Model<IActivityLog> =
  mongoose.models.ActivityLog ??
  mongoose.model<IActivityLog>("ActivityLog", activityLogSchema);

export default ActivityLog;
