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
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { adminImageRefSchema } from "@/lib/validation/admin-ui";

const testimonialSchema = z.object({
  guestName: z.string().min(1),
  location: z.string().optional(),
  testimonial: z.string().min(1),
  stayLabel: z.string().optional(),
  image: adminImageRefSchema,
  featured: z.boolean().optional(),
  sortOrder: z.coerce.number().optional(),
  status: z.enum(["draft", "published", "archived"]),
});

type TestimonialForm = z.infer<typeof testimonialSchema>;
type TestimonialRow = TestimonialForm & { _id: string };

export default function AdminTestimonialsPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error, reload } = useAdminFetch<{
    testimonials?: TestimonialRow[];
    items?: TestimonialRow[];
  }>("/api/admin/testimonials");
  const { mutate, saving } = useAdminMutation();
  const [editing, setEditing] = useState<TestimonialRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const testimonials = data?.testimonials ?? data?.items ?? [];

  const form = useForm<TestimonialForm>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      guestName: "",
      testimonial: "",
      status: "draft",
      featured: false,
      sortOrder: 0,
    },
  });

  const openCreate = () => {
    form.reset({
      guestName: "",
      testimonial: "",
      status: "draft",
      featured: false,
      sortOrder: testimonials.length,
    });
    setEditing(null);
    setCreating(true);
  };

  const openEdit = (row: TestimonialRow) => {
    form.reset(row);
    setCreating(false);
    setEditing(row);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (editing) {
      await mutate(
        `/api/admin/testimonials/${editing._id}`,
        { method: "PATCH", body: JSON.stringify(values) },
        { successMessage: "Testimonial updated" },
      );
    } else {
      await mutate(
        "/api/admin/testimonials",
        { method: "POST", body: JSON.stringify(values) },
        { successMessage: "Testimonial created" },
      );
    }
    setEditing(null);
    setCreating(false);
    reload();
  });

  return (
    <>
      <AdminHeader
        title="Testimonials"
        description="Guest stories and featured reviews."
        onMenuClick={openMenu}
        actions={
          <Button variant="golden" type="button" onClick={openCreate}>
            Add testimonial
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
              {editing ? "Edit testimonial" : "New testimonial"}
            </h2>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <FormField label="Guest name" required>
                <AdminInput {...form.register("guestName")} />
              </FormField>
              <FormField label="Location">
                <AdminInput {...form.register("location")} />
              </FormField>
              <FormField label="Stay label">
                <AdminInput {...form.register("stayLabel")} placeholder="Family of four, July 2025" />
              </FormField>
              <FormField label="Status">
                <AdminSelect {...form.register("status")}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </AdminSelect>
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Testimonial" required>
                  <AdminTextarea rows={4} {...form.register("testimonial")} />
                </FormField>
              </div>
              <div className="sm:col-span-2">
                <MediaPicker
                  label="Guest photo (optional)"
                  value={(form.watch("image") as ImageRefValue) ?? null}
                  onChange={(image) => form.setValue("image", image, { shouldDirty: true })}
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" {...form.register("featured")} />
                Featured on homepage
              </label>
              <FormField label="Sort order">
                <AdminInput type="number" {...form.register("sortOrder")} />
              </FormField>
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
            { key: "guest", header: "Guest", render: (row) => row.guestName },
            {
              key: "quote",
              header: "Excerpt",
              render: (row) =>
                row.testimonial.length > 80 ? `${row.testimonial.slice(0, 80)}…` : row.testimonial,
            },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { key: "featured", header: "Featured", render: (row) => (row.featured ? "Yes" : "—") },
            {
              key: "actions",
              header: "",
              render: (row) => (
                <div className="flex gap-2">
                  <button type="button" className="text-sm text-lake-medium" onClick={() => openEdit(row)}>
                    Edit
                  </button>
                  <button type="button" className="text-sm text-red-600" onClick={() => setDeleteId(row._id)}>
                    Archive
                  </button>
                </div>
              ),
            },
          ]}
          rows={testimonials}
          rowKey={(row) => row._id}
          emptyTitle="No testimonials"
          emptyDescription="Add guest quotes to build trust with future visitors."
          emptyAction={
            <Button variant="golden" onClick={openCreate}>
              Add testimonial
            </Button>
          }
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Archive testimonial?"
        confirmLabel="Archive"
        variant="danger"
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await mutate(
            `/api/admin/testimonials/${deleteId}`,
            { method: "DELETE" },
            { successMessage: "Testimonial archived" },
          );
          setDeleteId(null);
          reload();
        }}
      />
    </>
  );
}
