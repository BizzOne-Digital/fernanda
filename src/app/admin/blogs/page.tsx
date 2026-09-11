"use client";

import { Button } from "@/components/ui/button";
import { AdminHeader } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import { format } from "date-fns";

type BlogRow = {
  _id: string;
  title: string;
  slug: string;
  category?: string;
  status: string;
  publishedAt?: string;
  updatedAt?: string;
};

export default function AdminBlogsListPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error } = useAdminFetch<{ posts?: BlogRow[]; items?: BlogRow[]; blogs?: BlogRow[] }>(
    "/api/admin/blogs",
  );
  const posts = data?.posts ?? data?.blogs ?? data?.items ?? [];

  return (
    <>
      <AdminHeader
        title="Blog"
        description="Stories, updates, and seasonal guides."
        onMenuClick={openMenu}
        actions={
          <Button variant="secondary" href="/admin/blogs/new">
            New post
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
            { key: "category", header: "Category", render: (row) => row.category ?? "—" },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
            {
              key: "published",
              header: "Published",
              render: (row) =>
                row.publishedAt ? format(new Date(row.publishedAt), "MMM d, yyyy") : "—",
            },
          ]}
          rows={posts}
          rowKey={(row) => row._id}
          rowHref={(row) => `/admin/blogs/${row._id}`}
          emptyTitle="No blog posts"
          emptyDescription="Share lake updates, travel tips, and guest stories."
          emptyAction={
            <Button variant="golden" href="/admin/blogs/new">
              Write first post
            </Button>
          }
        />
      </div>
    </>
  );
}
