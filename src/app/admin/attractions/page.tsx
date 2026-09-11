"use client";

import { Button } from "@/components/ui/button";
import { AdminHeader, AdminPanel } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable } from "@/components/admin/data-table";
import { AdminInput, AdminSelect, AdminTextarea, FormField } from "@/components/admin/form-field";
import { StatusBadge } from "@/components/admin/status-badge";
import { MediaPicker, type ImageRefValue } from "@/components/admin/media-picker";
import { useAdminFetch, useAdminMutation } from "@/hooks/use-admin-fetch";
import { adminImageRefSchema } from "@/lib/validation/admin-ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const attractionSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  category: z.string().min(1),
  summary: z.string().optional(),
  body: z.string().optional(),
  address: z.string().optional(),
  mapLink: z.string().optional(),
  website: z.string().optional(),
  travelTimeText: z.string().optional(),
  season: z.string().optional(),
  familyNotes: z.string().optional(),
  isVerified: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
  status: z.enum(["draft", "published", "archived"]),
  coverImage: adminImageRefSchema,
});

type AttractionForm = z.infer<typeof attractionSchema>;
type AttractionRow = AttractionForm & {
  _id: string;
  images?: ImageRefValue[];
};

export default function AdminAttractionsPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error, reload } = useAdminFetch<{
    attractions?: AttractionRow[];
    items?: AttractionRow[];
  }>("/api/admin/attractions");
  const { mutate, saving } = useAdminMutation();
  const [editing, setEditing] = useState<AttractionRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const attractions = data?.attractions ?? data?.items ?? [];

  const form = useForm<AttractionForm>({
    resolver: zodResolver(attractionSchema),
    defaultValues: {
      title: "",
      slug: "",
      category: "Nature",
      status: "draft",
      sortOrder: 0,
      isVerified: false,
      featured: false,
    },
  });

  const openCreate = () => {
    form.reset({
      title: "",
      slug: "",
      category: "Nature",
      status: "draft",
      sortOrder: attractions.length,
      isVerified: false,
      featured: false,
    });
    setEditing(null);
    setCreating(true);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    const { coverImage, ...rest } = values;
    const payload = {
      ...rest,
      images: coverImage ? [coverImage] : [],
    };

    if (editing) {
      await mutate(
        `/api/admin/attractions/${editing._id}`,
        { method: "PATCH", body: JSON.stringify(payload) },
        { successMessage: "Attraction updated" },
      );
    } else {
      await mutate(
        "/api/admin/attractions",
        { method: "POST", body: JSON.stringify(payload) },
        { successMessage: "Attraction created" },
      );
    }
    setEditing(null);
    setCreating(false);
    reload();
  });

  return (
    <>
      <AdminHeader
        title="Local attractions"
        description="Curate nearby wineries, trails, and family outings."
        onMenuClick={openMenu}
        actions={
          <Button variant="golden" type="button" onClick={openCreate}>
            Add attraction
          </Button>
        }
      />
      <div className="space-y-6 p-4 lg:p-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {(creating || editing) && (
          <AdminPanel>
            <h2 className="mb-4 font-serif text-xl text-lake-deep">
              {editing ? "Edit attraction" : "New attraction"}
            </h2>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <FormField label="Title" required>
                <AdminInput {...form.register("title")} />
              </FormField>
              <FormField label="Slug" required>
                <AdminInput {...form.register("slug")} />
              </FormField>
              <FormField label="Category" required>
                <AdminInput {...form.register("category")} />
              </FormField>
              <FormField label="Status">
                <AdminSelect {...form.register("status")}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </AdminSelect>
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Summary">
                  <AdminTextarea rows={2} {...form.register("summary")} />
                </FormField>
              </div>
              <div className="sm:col-span-2">
                <FormField label="Body">
                  <AdminTextarea rows={5} {...form.register("body")} />
                </FormField>
              </div>
              <div className="sm:col-span-2">
                <MediaPicker
                  label="Cover image"
                  folder="gallery"
                  value={(form.watch("coverImage") as ImageRefValue) ?? null}
                  onChange={(image) => form.setValue("coverImage", image, { shouldDirty: true })}
                />
              </div>
              <FormField label="Travel time">
                <AdminInput {...form.register("travelTimeText")} placeholder="20 min drive" />
              </FormField>
              <FormField label="Season">
                <AdminInput {...form.register("season")} />
              </FormField>
              <FormField label="Website">
                <AdminInput {...form.register("website")} />
              </FormField>
              <FormField label="Map link">
                <AdminInput {...form.register("mapLink")} />
              </FormField>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("featured")} />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("isVerified")} />
                Verified
              </label>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" variant="golden" disabled={saving}>
                  Save
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setCreating(false);
                    setEditing(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </AdminPanel>
        )}

        <DataTable
          loading={loading}
          columns={[
            { key: "title", header: "Title", render: (row) => row.title },
            { key: "category", header: "Category", render: (row) => row.category },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { key: "verified", header: "Verified", render: (row) => (row.isVerified ? "Yes" : "—") },
            {
              key: "actions",
              header: "",
              render: (row) => (
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-sm text-lake-medium"
                    onClick={() => {
                      form.reset({
                        ...row,
                        coverImage: row.images?.[0] ?? null,
                      });
                      setCreating(false);
                      setEditing(row);
                    }}
                  >
                    Edit
                  </button>
                  <button type="button" className="text-sm text-red-600" onClick={() => setDeleteId(row._id)}>
                    Archive
                  </button>
                </div>
              ),
            },
          ]}
          rows={attractions}
          rowKey={(row) => row._id}
          emptyTitle="No attractions"
          emptyDescription="Help guests discover the South Okanagan beyond the lake."
          emptyAction={
            <Button variant="golden" onClick={openCreate}>
              Add attraction
            </Button>
          }
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Archive attraction?"
        confirmLabel="Archive"
        variant="danger"
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await mutate(
            `/api/admin/attractions/${deleteId}`,
            { method: "DELETE" },
            { successMessage: "Attraction archived" },
          );
          setDeleteId(null);
          reload();
        }}
      />
    </>
  );
}
