"use client";

import { AdminHeader, AdminPanel } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { DataTable } from "@/components/admin/data-table";
import { AdminTextarea, FormField } from "@/components/admin/form-field";
import { StatusBadge } from "@/components/admin/status-badge";
import { CONTACT_MESSAGE_STATUSES } from "@/models/ContactMessage";
import { useAdminFetch, useAdminMutation } from "@/hooks/use-admin-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type MessageRow = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  status: string;
  createdAt: string;
};

type MessageDetail = MessageRow & {
  phone?: string;
  message: string;
  adminNotes?: string;
};

const messagePatchSchema = z.object({
  status: z.enum(CONTACT_MESSAGE_STATUSES as unknown as [string, ...string[]]),
  adminNotes: z.string().optional(),
});

export default function AdminMessagesPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error, reload } = useAdminFetch<{
    messages?: MessageRow[];
    items?: MessageRow[];
  }>("/api/admin/messages");
  const { mutate, saving } = useAdminMutation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const messages = data?.messages ?? data?.items ?? [];
  const selected = messages.find((message) => message._id === selectedId);

  const { data: detailData, loading: detailLoading, reload: reloadDetail } = useAdminFetch<{
    message?: MessageDetail;
  }>(selectedId ? `/api/admin/messages/${selectedId}` : null);

  const detail = detailData?.message;

  const form = useForm({
    resolver: zodResolver(messagePatchSchema),
    values: detail
      ? { status: detail.status as (typeof CONTACT_MESSAGE_STATUSES)[number], adminNotes: detail.adminNotes ?? "" }
      : undefined,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!selectedId) return;
    await mutate(
      `/api/admin/messages/${selectedId}`,
      { method: "PATCH", body: JSON.stringify(values) },
      { successMessage: "Message updated" },
    );
    reload();
    reloadDetail();
  });

  return (
    <>
      <AdminHeader
        title="Contact messages"
        description="General contact form submissions from the website."
        onMenuClick={openMenu}
      />
      <div className="grid gap-6 p-4 lg:grid-cols-5 lg:p-8">
        <div className="lg:col-span-3">
          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <DataTable
            loading={loading}
            columns={[
              {
                key: "from",
                header: "From",
                render: (row) => `${row.firstName} ${row.lastName}`,
              },
              { key: "subject", header: "Subject", render: (row) => row.subject },
              { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
              {
                key: "when",
                header: "Received",
                render: (row) => formatDistanceToNow(new Date(row.createdAt), { addSuffix: true }),
              },
            ]}
            rows={messages}
            rowKey={(row) => row._id}
            onRowClick={(row) => setSelectedId(row._id)}
            emptyTitle="No messages"
            emptyDescription="Contact form messages will appear here."
          />
        </div>

        <div className="lg:col-span-2">
          <AdminPanel>
            {!selected ? (
              <p className="text-sm text-ink/50">Select a message to read and update its status.</p>
            ) : detailLoading && !detail ? (
              <div className="h-48 animate-pulse rounded-lg bg-sand/30" />
            ) : detail ? (
              <div className="space-y-4">
                <div>
                  <h2 className="font-serif text-xl text-lake-deep">{detail.subject}</h2>
                  <p className="mt-1 text-sm text-ink/60">
                    {detail.firstName} {detail.lastName} · {detail.email}
                  </p>
                  <p className="text-xs text-ink/40">
                    {format(new Date(detail.createdAt), "MMMM d, yyyy h:mm a")}
                  </p>
                </div>
                <div className="rounded-lg bg-cream/70 p-4 text-sm whitespace-pre-wrap">{detail.message}</div>
                <form onSubmit={onSubmit} className="space-y-4 border-t border-sand/40 pt-4">
                  <FormField label="Status">
                    <select {...form.register("status")} className="w-full rounded-lg border border-sand/60 px-3 py-2 text-sm">
                      {CONTACT_MESSAGE_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Admin notes">
                    <AdminTextarea rows={4} {...form.register("adminNotes")} />
                  </FormField>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-full bg-golden px-5 py-2 text-sm font-medium text-ink disabled:opacity-50"
                  >
                    {saving ? "Saving…" : "Save"}
                  </button>
                </form>
              </div>
            ) : selected ? (
              <p className="text-sm text-ink/50">Could not load message details.</p>
            ) : null}
          </AdminPanel>
        </div>
      </div>
    </>
  );
}
