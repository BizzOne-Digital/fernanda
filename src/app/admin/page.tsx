"use client";

import { AdminHeader, AdminPanel } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { DataTable, StatCard } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

type DashboardResponse = {
  counts?: {
    newInquiries?: number;
    newMessages?: number;
    publishedCabins?: number;
    publishedServices?: number;
    mediaCount?: number;
  };
  recentInquiries?: Array<{
    _id: string;
    inquiryNumber: string;
    firstName: string;
    lastName: string;
    status: string;
    createdAt: string;
  }>;
  recentActivity?: Array<{
    _id: string;
    action: string;
    summary?: string;
    createdAt: string;
  }>;
};

export default function AdminDashboardPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error } = useAdminFetch<DashboardResponse>("/api/admin/dashboard");

  const stats = data?.counts;

  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of inquiries, content, and recent activity."
        onMenuClick={openMenu}
      />
      <div className="space-y-8 p-4 lg:p-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard label="New inquiries" value={stats?.newInquiries} loading={loading} hint="Awaiting response" />
          <StatCard label="Unread messages" value={stats?.newMessages} loading={loading} />
          <StatCard label="Published cabins" value={stats?.publishedCabins} loading={loading} />
          <StatCard label="Published services" value={stats?.publishedServices} loading={loading} />
          <StatCard label="Media assets" value={stats?.mediaCount} loading={loading} />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <AdminPanel>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-xl text-lake-deep">Recent inquiries</h2>
              <Link href="/admin/inquiries" className="text-sm text-lake-medium hover:text-lake-deep">
                View all
              </Link>
            </div>
            <DataTable
              loading={loading}
              columns={[
                {
                  key: "number",
                  header: "Inquiry",
                  render: (row) => (
                    <span className="font-medium text-lake-deep">{row.inquiryNumber}</span>
                  ),
                },
                {
                  key: "guest",
                  header: "Guest",
                  render: (row) => `${row.firstName} ${row.lastName}`,
                },
                {
                  key: "status",
                  header: "Status",
                  render: (row) => <StatusBadge status={row.status} />,
                },
                {
                  key: "when",
                  header: "Submitted",
                  render: (row) =>
                    formatDistanceToNow(new Date(row.createdAt), { addSuffix: true }),
                },
              ]}
              rows={data?.recentInquiries ?? []}
              rowKey={(row) => row._id}
              rowHref={(row) => `/admin/inquiries/${row._id}`}
              emptyTitle="No inquiries yet"
              emptyDescription="Booking requests from the website will appear here."
            />
          </AdminPanel>

          <AdminPanel>
            <h2 className="mb-4 font-serif text-xl text-lake-deep">Recent activity</h2>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="h-12 animate-pulse rounded-lg bg-sand/40" />
                ))}
              </div>
            ) : data?.recentActivity?.length ? (
              <ul className="space-y-3">
                {data.recentActivity.map((item) => (
                  <li
                    key={item._id}
                    className="rounded-lg border border-sand/40 bg-cream/50 px-4 py-3 text-sm"
                  >
                    <p className="font-medium text-ink/80">{item.summary ?? item.action}</p>
                    <p className="mt-1 text-xs text-ink/50">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink/50">Activity from uploads and edits will show here.</p>
            )}
          </AdminPanel>
        </div>
      </div>
    </>
  );
}
