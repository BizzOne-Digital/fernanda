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
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const seasonSchema = z.object({
  name: z.string().min(1),
  year: z.coerce.number(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  weeklyStayText: z.string().optional(),
  shortStayText: z.string().optional(),
  minimumStayText: z.string().optional(),
  variabilityNote: z.string().optional(),
  publicInquiryNote: z.string().optional(),
  adminQuoteGuidance: z.string().optional(),
  lastMinuteOfferText: z.string().optional(),
  status: z.enum(["draft", "published", "archived"]),
  sortOrder: z.coerce.number().optional(),
});

type SeasonForm = z.infer<typeof seasonSchema>;
type SeasonRow = SeasonForm & { _id: string };

function toDateInput(value?: string | Date) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : format(date, "yyyy-MM-dd");
}

export default function AdminSeasonsPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error, reload } = useAdminFetch<{ seasons?: SeasonRow[]; items?: SeasonRow[] }>(
    "/api/admin/seasons",
  );
  const { mutate, saving } = useAdminMutation();
  const [editing, setEditing] = useState<SeasonRow | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const seasons = data?.seasons ?? data?.items ?? [];

  const form = useForm<SeasonForm>({
    resolver: zodResolver(seasonSchema),
    defaultValues: {
      name: "",
      year: new Date().getFullYear(),
      startDate: "",
      endDate: "",
      status: "draft",
      sortOrder: 0,
    },
  });

  const openCreate = () => {
    form.reset({
      name: "",
      year: new Date().getFullYear(),
      startDate: "",
      endDate: "",
      status: "draft",
      sortOrder: seasons.length,
    });
    setEditing(null);
    setCreating(true);
  };

  const openEdit = (season: SeasonRow) => {
    form.reset({
      ...season,
      startDate: toDateInput(season.startDate),
      endDate: toDateInput(season.endDate),
    });
    setCreating(false);
    setEditing(season);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    if (editing) {
      await mutate(
        `/api/admin/seasons/${editing._id}`,
        { method: "PATCH", body: JSON.stringify(values) },
        { successMessage: "Season updated" },
      );
    } else {
      await mutate(
        "/api/admin/seasons",
        { method: "POST", body: JSON.stringify(values) },
        { successMessage: "Season created" },
      );
    }
    setEditing(null);
    setCreating(false);
    reload();
  });

  const showForm = creating || editing;

  return (
    <>
      <AdminHeader
        title="Seasons"
        description="Define booking seasons, stay rules, and quote guidance."
        onMenuClick={openMenu}
        actions={
          <Button variant="golden" type="button" onClick={openCreate}>
            Add season
          </Button>
        }
      />
      <div className="space-y-6 p-4 lg:p-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {showForm ? (
          <AdminPanel>
            <h2 className="mb-4 font-serif text-xl text-lake-deep">
              {editing ? "Edit season" : "New season"}
            </h2>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <FormField label="Name" required>
                <AdminInput {...form.register("name")} />
              </FormField>
              <FormField label="Year" required>
                <AdminInput type="number" {...form.register("year")} />
              </FormField>
              <FormField label="Start date" required>
                <AdminInput type="date" {...form.register("startDate")} />
              </FormField>
              <FormField label="End date" required>
                <AdminInput type="date" {...form.register("endDate")} />
              </FormField>
              <FormField label="Status">
                <AdminSelect {...form.register("status")}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </AdminSelect>
              </FormField>
              <FormField label="Sort order">
                <AdminInput type="number" {...form.register("sortOrder")} />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Weekly stay text">
                  <AdminTextarea rows={2} {...form.register("weeklyStayText")} />
                </FormField>
              </div>
              <div className="sm:col-span-2">
                <FormField label="Public inquiry note">
                  <AdminTextarea rows={2} {...form.register("publicInquiryNote")} />
                </FormField>
              </div>
              <div className="sm:col-span-2">
                <FormField label="Admin quote guidance">
                  <AdminTextarea rows={3} {...form.register("adminQuoteGuidance")} />
                </FormField>
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" variant="golden" disabled={saving}>
                  {saving ? "Saving…" : "Save season"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditing(null);
                    setCreating(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </AdminPanel>
        ) : null}

        <DataTable
          loading={loading}
          columns={[
            { key: "name", header: "Season", render: (row) => row.name },
            { key: "year", header: "Year", render: (row) => row.year },
            {
              key: "dates",
              header: "Dates",
              render: (row) =>
                `${toDateInput(row.startDate)} → ${toDateInput(row.endDate)}`,
            },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
            {
              key: "actions",
              header: "",
              render: (row) => (
                <div className="flex gap-2">
                  <button type="button" className="text-sm text-lake-medium" onClick={() => openEdit(row)}>
                    Edit
                  </button>
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
          rows={seasons}
          rowKey={(row) => row._id}
          emptyTitle="No seasons configured"
          emptyDescription="Add seasons to guide availability and quoting."
          emptyAction={
            <Button variant="golden" onClick={openCreate}>
              Add season
            </Button>
          }
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Archive season?"
        confirmLabel="Archive"
        variant="danger"
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await mutate(
            `/api/admin/seasons/${deleteId}`,
            { method: "DELETE" },
            { successMessage: "Season archived" },
          );
          setDeleteId(null);
          reload();
        }}
      />
    </>
  );
}
