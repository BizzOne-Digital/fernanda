"use client";

import { Button } from "@/components/ui/button";
import { AdminHeader, AdminPanel } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable } from "@/components/admin/data-table";
import { AdminInput, AdminSelect, AdminTextarea, FormField } from "@/components/admin/form-field";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminFetch, useAdminMutation } from "@/hooks/use-admin-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const faqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
  category: z.string().min(1),
  relatedPageSlug: z.string().optional(),
  relatedCabinSlug: z.string().optional(),
  relatedServiceSlug: z.string().optional(),
  sortOrder: z.coerce.number().optional(),
  status: z.enum(["draft", "published", "archived"]),
});

type FaqForm = z.infer<typeof faqSchema>;
type FaqRow = FaqForm & { _id: string };

export default function AdminFaqsPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error, reload } = useAdminFetch<{ faqs?: FaqRow[]; items?: FaqRow[] }>(
    "/api/admin/faqs",
  );
  const { mutate, saving } = useAdminMutation();
  const [editing, setEditing] = useState<FaqRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const faqs = data?.faqs ?? data?.items ?? [];

  const form = useForm<FaqForm>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      question: "",
      answer: "",
      category: "General",
      status: "published",
      sortOrder: 0,
    },
  });

  const openCreate = () => {
    form.reset({
      question: "",
      answer: "",
      category: "General",
      status: "published",
      sortOrder: faqs.length,
    });
    setEditing(null);
    setCreating(true);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (editing) {
      await mutate(
        `/api/admin/faqs/${editing._id}`,
        { method: "PATCH", body: JSON.stringify(values) },
        { successMessage: "FAQ updated" },
      );
    } else {
      await mutate(
        "/api/admin/faqs",
        { method: "POST", body: JSON.stringify(values) },
        { successMessage: "FAQ created" },
      );
    }
    setEditing(null);
    setCreating(false);
    reload();
  });

  return (
    <>
      <AdminHeader
        title="FAQs"
        description="Answer common guest questions by category."
        onMenuClick={openMenu}
        actions={
          <Button variant="golden" type="button" onClick={openCreate}>
            Add FAQ
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
            <h2 className="mb-4 font-serif text-xl text-lake-deep">{editing ? "Edit FAQ" : "New FAQ"}</h2>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <FormField label="Category" required>
                <AdminInput {...form.register("category")} />
              </FormField>
              <FormField label="Status">
                <AdminSelect {...form.register("status")}>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </AdminSelect>
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Question" required>
                  <AdminInput {...form.register("question")} />
                </FormField>
              </div>
              <div className="sm:col-span-2">
                <FormField label="Answer" required>
                  <AdminTextarea rows={4} {...form.register("answer")} />
                </FormField>
              </div>
              <FormField label="Related page slug">
                <AdminInput {...form.register("relatedPageSlug")} />
              </FormField>
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
            { key: "category", header: "Category", render: (row) => row.category },
            { key: "question", header: "Question", render: (row) => row.question },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
            {
              key: "actions",
              header: "",
              render: (row) => (
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="text-sm text-lake-medium"
                    onClick={() => {
                      form.reset(row);
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
          rows={faqs}
          rowKey={(row) => row._id}
          emptyTitle="No FAQs yet"
          emptyDescription="Create answers for booking, amenities, and local area questions."
          emptyAction={
            <Button variant="golden" onClick={openCreate}>
              Add FAQ
            </Button>
          }
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Archive FAQ?"
        confirmLabel="Archive"
        variant="danger"
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await mutate(
            `/api/admin/faqs/${deleteId}`,
            { method: "DELETE" },
            { successMessage: "FAQ archived" },
          );
          setDeleteId(null);
          reload();
        }}
      />
    </>
  );
}
