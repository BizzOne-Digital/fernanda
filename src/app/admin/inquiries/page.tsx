"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { useAdminFetch } from "@/hooks/use-admin-fetch";
import { format } from "date-fns";

type InquiryRow = {
  _id: string;
  inquiryNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  arrivalDate: string;
  departureDate: string;
  status: string;
  createdAt: string;
};

export default function AdminInquiriesListPage() {
  const { openMenu } = useAdminLayout();
  const { data, loading, error } = useAdminFetch<{ inquiries?: InquiryRow[]; items?: InquiryRow[] }>(
    "/api/admin/inquiries",
  );
  const inquiries = data?.inquiries ?? data?.items ?? [];

  return (
    <>
      <AdminHeader
        title="Booking inquiries"
        description="Review guest requests and send quotes."
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
            {
              key: "number",
              header: "Inquiry",
              render: (row) => <span className="font-medium text-lake-deep">{row.inquiryNumber}</span>,
            },
            {
              key: "guest",
              header: "Guest",
              render: (row) => `${row.firstName} ${row.lastName}`,
            },
            { key: "email", header: "Email", render: (row) => row.email },
            {
              key: "dates",
              header: "Stay",
              render: (row) =>
                `${format(new Date(row.arrivalDate), "MMM d")} – ${format(new Date(row.departureDate), "MMM d, yyyy")}`,
            },
            { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
          ]}
          rows={inquiries}
          rowKey={(row) => row._id}
          rowHref={(row) => `/admin/inquiries/${row._id}`}
          emptyTitle="No inquiries yet"
          emptyDescription="Guest booking requests will appear here."
        />
      </div>
    </>
  );
}
