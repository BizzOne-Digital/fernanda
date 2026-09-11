"use client";

import { Button } from "@/components/ui/button";
import { AdminHeader, AdminPanel } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { ConfirmDialog } from "@/components/admin/confirm-dialog";
import { DataTable } from "@/components/admin/data-table";
import { AdminInput, AdminSelect, AdminTextarea, FormField } from "@/components/admin/form-field";
import { StatusBadge } from "@/components/admin/status-badge";
import { AVAILABILITY_BLOCK_STATUSES } from "@/models/AvailabilityBlock";
import { useAdminFetch, useAdminMutation } from "@/hooks/use-admin-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const blockSchema = z.object({
  cabinId: z.string().optional(),
  cabinNumber: z.coerce.number().optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  status: z.enum(AVAILABILITY_BLOCK_STATUSES as unknown as [string, ...string[]]),
  publicNote: z.string().optional(),
  adminNote: z.string().optional(),
});

type BlockForm = z.infer<typeof blockSchema>;
type BlockRow = BlockForm & { _id: string; cabinNumber?: number };
type CabinOption = { _id: string; cabinNumber: number; name: string };

export default function AdminAvailabilityPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error, reload } = useAdminFetch<{
    blocks?: BlockRow[];
    items?: BlockRow[];
    cabins?: CabinOption[];
  }>("/api/admin/availability");
  const { mutate, saving } = useAdminMutation();
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const blocks = data?.blocks ?? data?.items ?? [];
  const cabins = data?.cabins ?? [];

  const form = useForm<BlockForm>({
    resolver: zodResolver(blockSchema),
    defaultValues: {
      startDate: "",
      endDate: "",
      status: "tentative",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await mutate("/api/admin/availability", { method: "POST", body: JSON.stringify(values) }, {
      successMessage: "Block added",
    });
    setShowForm(false);
    form.reset({ startDate: "", endDate: "", status: "tentative" });
    reload();
  });

  return (
    <>
      <AdminHeader
        title="Availability"
        description="Manage cabin holds, confirmations, and owner blocks."
        onMenuClick={openMenu}
        actions={
          <Button variant="golden" type="button" onClick={() => setShowForm(true)}>
            Add block
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
            <h2 className="mb-4 font-serif text-xl text-lake-deep">New availability block</h2>
            <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
              <FormField label="Cabin">
                <AdminSelect
                  {...form.register("cabinId")}
                  onChange={(event) => {
                    form.setValue("cabinId", event.target.value);
                    const cabin = cabins.find((item) => item._id === event.target.value);
                    if (cabin) form.setValue("cabinNumber", cabin.cabinNumber);
                  }}
                >
                  <option value="">All cabins / unspecified</option>
                  {cabins.map((cabin) => (
                    <option key={cabin._id} value={cabin._id}>
                      Cabin {cabin.cabinNumber} — {cabin.name}
                    </option>
                  ))}
                </AdminSelect>
              </FormField>
              <FormField label="Status">
                <AdminSelect {...form.register("status")}>
                  {AVAILABILITY_BLOCK_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status.replace(/-/g, " ")}
                    </option>
                  ))}
                </AdminSelect>
              </FormField>
              <FormField label="Start date" required>
                <AdminInput type="date" {...form.register("startDate")} />
              </FormField>
              <FormField label="End date" required>
                <AdminInput type="date" {...form.register("endDate")} />
              </FormField>
              <div className="sm:col-span-2">
                <FormField label="Public note">
                  <AdminTextarea rows={2} {...form.register("publicNote")} />
                </FormField>
              </div>
              <div className="sm:col-span-2">
                <FormField label="Admin note">
                  <AdminTextarea rows={2} {...form.register("adminNote")} />
                </FormField>
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <Button type="submit" variant="golden" disabled={saving}>
                  {saving ? "Saving…" : "Save block"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </AdminPanel>
        ) : null}

        <DataTable
          loading={loading}
          columns={[
            {
              key: "cabin",
              header: "Cabin",
              render: (row) => (row.cabinNumber ? `Cabin ${row.cabinNumber}` : "—"),
            },
            {
              key: "dates",
              header: "Dates",
              render: (row) =>
                `${format(new Date(row.startDate), "MMM d")} – ${format(new Date(row.endDate), "MMM d, yyyy")}`,
            },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { key: "public", header: "Public note", render: (row) => row.publicNote ?? "—" },
            {
              key: "actions",
              header: "",
              render: (row) => (
                <button
                  type="button"
                  className="text-sm text-red-600"
                  onClick={() => setDeleteId(row._id)}
                >
                  Remove
                </button>
              ),
            },
          ]}
          rows={blocks}
          rowKey={(row) => row._id}
          emptyTitle="No availability blocks"
          emptyDescription="Add holds or confirmed bookings to track cabin calendar."
          emptyAction={
            <Button variant="golden" onClick={() => setShowForm(true)}>
              Add block
            </Button>
          }
        />
      </div>

      <ConfirmDialog
        open={Boolean(deleteId)}
        title="Remove availability block?"
        confirmLabel="Remove"
        variant="danger"
        loading={saving}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await mutate(
            `/api/admin/availability/${deleteId}`,
            { method: "DELETE" },
            { successMessage: "Block removed" },
          );
          setDeleteId(null);
          reload();
        }}
      />
    </>
  );
}
