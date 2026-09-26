"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdminHeader, AdminPanel } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { DataTable } from "@/components/admin/data-table";
import { AdminSelect, AdminTextarea, FormField } from "@/components/admin/form-field";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { GUEST_MEMORY_STATUSES } from "@/models/GuestMemory";
import { GALLERY_PHOTO_CATEGORIES } from "@/lib/gallery/photo-constants";
import { galleryCategoryLabel } from "@/lib/gallery/categories";
import { useAdminFetch, useAdminMutation } from "@/hooks/use-admin-fetch";
import { requiresUnoptimizedImage } from "@/lib/uploads/public-url";

type MemoryRow = {
  _id: string;
  guestName: string;
  story: string;
  status: string;
  photoUrl?: string;
  createdAt: string;
};

type MemoryDetail = MemoryRow & {
  email?: string;
  photoAlt?: string;
  adminNotes?: string;
};

const patchSchema = z.object({
  status: z.enum(GUEST_MEMORY_STATUSES as unknown as [string, ...string[]]),
  adminNotes: z.string().optional(),
  addToGallery: z.boolean().optional(),
  galleryCategory: z.enum(GALLERY_PHOTO_CATEGORIES).optional(),
});

export default function AdminGuestMemoriesPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error, reload } = useAdminFetch<{
    memories?: MemoryRow[];
    items?: MemoryRow[];
  }>("/api/admin/guest-memories");
  const { mutate, saving } = useAdminMutation();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const memories = data?.memories ?? data?.items ?? [];

  const { data: detailData, loading: detailLoading, reload: reloadDetail } = useAdminFetch<{
    memory?: MemoryDetail;
  }>(selectedId ? `/api/admin/guest-memories/${selectedId}` : null);

  const detail = detailData?.memory;

  const form = useForm({
    resolver: zodResolver(patchSchema),
    values: detail
      ? {
          status: detail.status as (typeof GUEST_MEMORY_STATUSES)[number],
          adminNotes: detail.adminNotes ?? "",
          addToGallery: false,
          galleryCategory: "friends-family" as const,
        }
      : undefined,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!selectedId) return;
    await mutate(
      `/api/admin/guest-memories/${selectedId}`,
      { method: "PATCH", body: JSON.stringify(values) },
      { successMessage: "Memory updated" },
    );
    reload();
    reloadDetail();
  });

  return (
    <>
      <AdminHeader
        title="Guest memories"
        description="Review stories and photos submitted from the public gallery."
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
              { key: "name", header: "Guest", render: (row) => row.guestName },
              {
                key: "story",
                header: "Story",
                render: (row) =>
                  row.story.length > 60 ? `${row.story.slice(0, 60)}…` : row.story,
              },
              { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
              {
                key: "when",
                header: "Received",
                render: (row) => formatDistanceToNow(new Date(row.createdAt), { addSuffix: true }),
              },
            ]}
            rows={memories}
            rowKey={(row) => row._id}
            emptyTitle="No guest memories yet"
            emptyDescription="Submissions from /gallery/share-a-memory will appear here."
            onRowClick={(row) => setSelectedId(row._id)}
          />
        </div>

        <div className="lg:col-span-2">
          <AdminPanel>
            {!selectedId ? (
              <p className="text-sm text-ink/60">Select a submission to review.</p>
            ) : detailLoading || !detail ? (
              <p className="text-sm text-ink/60">Loading…</p>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="font-serif text-xl text-lake-deep">{detail.guestName}</p>
                  {detail.email ? <p className="text-sm text-ink/60">{detail.email}</p> : null}
                </div>
                {detail.photoUrl ? (
                  <div className="relative aspect-[4/3] overflow-hidden rounded-sm bg-sand/20">
                    <Image
                      src={detail.photoUrl}
                      alt={detail.photoAlt || detail.guestName}
                      fill
                      className="object-cover"
                      unoptimized={requiresUnoptimizedImage(detail.photoUrl)}
                    />
                  </div>
                ) : null}
                <p className="whitespace-pre-line text-sm leading-relaxed text-ink/85">{detail.story}</p>

                <form onSubmit={onSubmit} className="space-y-4 border-t border-sand/70 pt-4">
                  <FormField label="Status">
                    <AdminSelect {...form.register("status")}>
                      {GUEST_MEMORY_STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </AdminSelect>
                  </FormField>
                  <FormField label="Admin notes">
                    <AdminTextarea rows={3} {...form.register("adminNotes")} />
                  </FormField>
                  {detail.photoUrl ? (
                    <>
                      <label className="flex items-center gap-2 text-sm text-ink/80">
                        <input type="checkbox" {...form.register("addToGallery")} />
                        Also add photo to site gallery when approving
                      </label>
                      <FormField label="Gallery category (if adding photo)">
                        <AdminSelect {...form.register("galleryCategory")}>
                          {GALLERY_PHOTO_CATEGORIES.map((cat) => (
                            <option key={cat} value={cat}>{galleryCategoryLabel(cat)}</option>
                          ))}
                        </AdminSelect>
                      </FormField>
                    </>
                  ) : null}
                  <Button type="submit" variant="golden" disabled={saving}>
                    Save
                  </Button>
                </form>
              </div>
            )}
          </AdminPanel>
        </div>
      </div>
    </>
  );
}
