"use client";

import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminFetch } from "@/hooks/use-admin-fetch";

type ServiceRow = {
  _id: string;
  title: string;
  slug: string;
  status: string;
  sortOrder?: number;
};

export default function AdminServicesListPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error } = useAdminFetch<{ services?: ServiceRow[]; items?: ServiceRow[] }>(
    "/api/admin/services",
  );
  const services = data?.services ?? data?.items ?? [];

  return (
    <>
      <AdminHeader
        title="Services"
        description="Boat rentals, activities, and guest experiences."
        onMenuClick={openMenu}
        actions={
          <Button variant="secondary" href="/admin/services/new">
            Add service
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
            { key: "title", header: "Title", render: (row) => row.title },
            { key: "slug", header: "Slug", render: (row) => row.slug },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
            { key: "order", header: "Sort", render: (row) => row.sortOrder ?? 0 },
          ]}
          rows={services}
          rowKey={(row) => row._id}
          rowHref={(row) => `/admin/services/${row._id}`}
          emptyTitle="No services yet"
          emptyDescription="Add services like boat rentals or guided experiences."
          emptyAction={
            <Button variant="golden" href="/admin/services/new">
              Create service
            </Button>
          }
        />
      </div>
    </>
  );
}
