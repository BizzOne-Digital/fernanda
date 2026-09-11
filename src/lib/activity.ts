import { ActivityLog, type ActivityLogAction } from "@/models";

export async function logActivity(input: {
  action: ActivityLogAction;
  entityType: string;
  entityId?: string;
  entityLabel?: string;
  summary: string;
  adminEmail?: string;
  adminUserId?: string;
  metadata?: Record<string, unknown>;
}) {
  await ActivityLog.create(input);
}
