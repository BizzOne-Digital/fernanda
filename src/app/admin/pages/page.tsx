"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import { formatDistanceToNow } from "date-fns";

type PageRow = {
  slug: string;
  title: string;
  status: string;
  updatedAt?: string;
  sections?: unknown[];
};

export default function AdminPagesListPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error } = useAdminFetch<{ pages?: PageRow[]; items?: PageRow[] }>(
    "/api/admin/pages",
  );
  const pages = data?.pages ?? data?.items ?? [];

  return (
    <>
      <AdminHeader
        title="Pages"
        description="Edit homepage and marketing pages section by section."
        onMenuClick={openMenu}
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
            {
              key: "sections",
              header: "Sections",
              render: (row) => row.sections?.length ?? "—",
            },
            {
              key: "updated",
              header: "Updated",
              render: (row) =>
                row.updatedAt
                  ? formatDistanceToNow(new Date(row.updatedAt), { addSuffix: true })
                  : "—",
            },
          ]}
          rows={pages}
          rowKey={(row) => row.slug}
          rowHref={(row) => `/admin/pages/${row.slug}`}
          emptyTitle="No pages found"
          emptyDescription="Seed data or create pages to manage site content."
        />
      </div>
    </>
  );
}
