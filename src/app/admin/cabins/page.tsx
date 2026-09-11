"use client";

import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminFetch } from "@/hooks/use-admin-fetch";

type CabinRow = {
  _id: string;
  cabinNumber: number;
  name: string;
  slug: string;
  capacity: number;
  status: string;
  sortOrder?: number;
};

export default function AdminCabinsListPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error } = useAdminFetch<{ cabins?: CabinRow[]; items?: CabinRow[] }>(
    "/api/admin/cabins",
  );
  const cabins = data?.cabins ?? data?.items ?? [];

  return (
    <>
      <AdminHeader
        title="Cabins"
        description="Manage cabin listings and detail pages."
        onMenuClick={openMenu}
        actions={
          <Button variant="secondary" href="/admin/cabins/new">
            Add cabin
          </Button>
        }
      />
      <div className="space-y-4 p-4 lg:p-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
        <DataTable
          loading={loading}
          columns={[
            { key: "number", header: "#", render: (row) => row.cabinNumber },
            { key: "name", header: "Name", render: (row) => row.name },
            { key: "capacity", header: "Capacity", render: (row) => row.capacity },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { key: "order", header: "Sort", render: (row) => row.sortOrder ?? 0 },
          ]}
          rows={cabins}
          rowKey={(row) => row._id}
          rowHref={(row) => `/admin/cabins/${row._id}`}
          emptyTitle="No cabins yet"
          emptyDescription="Add cabins to showcase your waterfront accommodations."
          emptyAction={
            <Button variant="golden" href="/admin/cabins/new">
              Create first cabin
            </Button>
          }
        />
      </div>
    </>
  );
}
