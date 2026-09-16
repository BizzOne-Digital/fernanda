"use client";

import { Button } from "@/components/ui/button";
import { AdminHeader, AdminPanel } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable } from "@/components/admin/data-table";
import { AdminInput, AdminSelect, AdminTextarea, FormField } from "@/components/admin/form-field";
import { MediaPicker, type ImageRefValue } from "@/components/admin/media-picker";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminFetch, useAdminMutation } from "@/hooks/use-admin-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { adminImageRefSchema } from "@/lib/validation/admin-ui";

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  coverImage: adminImageRefSchema,
  sortOrder: z.coerce.number().optional(),
  status: z.enum(["draft", "published", "archived"]),
});

type CategoryForm = z.infer<typeof categorySchema>;
type CategoryRow = CategoryForm & { _id: string; assetCount?: number };

export default function AdminGalleryPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error, reload } = useAdminFetch<{
    categories?: CategoryRow[];
    items?: CategoryRow[];
  }>("/api/admin/gallery");
  const { mutate, saving } = useAdminMutation();
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const categories = data?.categories ?? data?.items ?? [];

  const form = useForm<CategoryForm>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", slug: "", status: "published", sortOrder: 0 },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await mutate("/api/admin/gallery", { method: "POST", body: JSON.stringify(values) }, {
      successMessage: "Category created",
    });
    setCreating(false);
    form.reset({ name: "", slug: "", status: "published", sortOrder: categories.length });
    reload();
  });

  return (
    <>
      <AdminHeader
        title="Gallery"
        description="Organize photo categories and manage media."
        onMenuClick={openMenu}
        actions={
          <div className="flex gap-2">
            <Link href="/admin/gallery/photos" className="resort-btn-outline">
              Site photos
            </Link>
            <Button variant="golden" type="button" onClick={() => setCreating(true)}>
              New category
            </Button>
          </div>
        }
      />
      <div className="space-y-6 p-4 lg:p-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {creating ? (
          <AdminPanel>
            <h2 className="mb-4 font-serif text-xl text-lake-deep">New gallery category</h2>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <FormField label="Name" required>
                <AdminInput {...form.register("name")} />
              </FormField>
              <FormField label="Slug" required>
                <AdminInput {...form.register("slug")} />
              </FormField>
              <FormField label="Sort order">
                <AdminInput type="number" {...form.register("sortOrder")} />
              </FormField>
              <FormField label="Status">
                <AdminSelect {...form.register("status")}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </AdminSelect>
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Description">
                  <AdminTextarea rows={2} {...form.register("description")} />
                </FormField>
              </div>
              <div className="sm:col-span-2">
                <MediaPicker
                  label="Cover image"
                  value={(form.watch("coverImage") as ImageRefValue) ?? null}
                  onChange={(image) => form.setValue("coverImage", image, { shouldDirty: true })}
                  folder="gallery"
                />
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" variant="golden" disabled={saving}>
                  Create category
                </Button>
                <Button type="button" variant="ghost" onClick={() => setCreating(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </AdminPanel>
        ) : null}

        <DataTable
          loading={loading}
          columns={[
            { key: "name", header: "Category", render: (row) => row.name },
            { key: "slug", header: "Slug", render: (row) => row.slug },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { key: "assets", header: "Photos", render: (row) => row.assetCount ?? "—" },
            {
              key: "manage",
              header: "",
              render: (row) => (
                <div className="flex gap-2">
                  <Link href={`/admin/gallery/${row._id}`} className="text-sm text-lake-medium">
                    Manage
                  </Link>
                  <button
                    type="button"
                    className="text-sm text-red-600"
                    onClick={() => setDeleteId(row._id)}
                  >
                    Archive
                  </button>
                </div>
              ),
            },
          ]}
          rows={categories}
          rowKey={(row) => row._id}
          emptyTitle="No gallery categories"
          emptyDescription="Create categories like Cabins, Lake Views, or Activities."
          emptyAction={
            <Button variant="golden" onClick={() => setCreating(true)}>
              Create category
            </Button>
          }
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Archive category?"
        confirmLabel="Archive"
        variant="danger"
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await mutate(
            `/api/admin/gallery/${deleteId}`,
            { method: "DELETE" },
            { successMessage: "Category archived" },
          );
          setDeleteId(null);
          reload();
        }}
      />
    </>
  );
}
