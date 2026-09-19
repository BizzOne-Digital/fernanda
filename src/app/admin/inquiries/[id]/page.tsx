"use client";

import { Button } from "@/components/ui/button";
import { AdminHeader, AdminPanel } from "@/components/admin/admin-header";
import { useAdminLayout } from "@/components/admin/admin-shell";
import { AdminInput, AdminSelect, AdminTextarea, FormField } from "@/components/admin/form-field";
import { StatusBadge } from "@/components/admin/status-badge";
import { BOOKING_INQUIRY_STATUSES } from "@/lib/booking/inquiry-constants";
import { useAdminFetch, useAdminMutation } from "@/hooks/use-admin-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const inquiryPatchSchema = z.object({
  status: z.enum(BOOKING_INQUIRY_STATUSES as unknown as [string, ...string[]]),
  quoteAmount: z.coerce.number().optional().or(z.literal("")),
  quoteCurrency: z.string().optional(),
  adminNotes: z.string().optional(),
  followUpDate: z.string().optional(),
});

type InquiryDetail = {
  _id: string;
  inquiryNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  arrivalDate: string;
  departureDate: string;
  dateFlexible?: boolean;
  adults: number;
  children?: number;
  preferredCabins?: string[];
  message?: string;
  specialRequests?: string;
  status: string;
  quoteAmount?: number;
  quoteCurrency?: string;
  adminNotes?: string;
  followUpDate?: string;
  statusHistory?: Array<{ status: string; note?: string; changedAt: string }>;
};

export default function AdminInquiryDetailPage() {
  const params = useParams<{ id: string }>();
  const { openMenu } = useAdminLayout();
  const { data, loading, error, reload } = useAdminFetch<{ inquiry?: InquiryDetail }>(
    `/api/admin/inquiries/${params.id}`,
  );
  const { mutate, saving } = useAdminMutation();

  const inquiry = data?.inquiry;

  const form = useForm({
    resolver: zodResolver(inquiryPatchSchema),
    defaultValues: {
      status: "new" as (typeof BOOKING_INQUIRY_STATUSES)[number],
      quoteCurrency: "CAD",
      adminNotes: "",
    },
  });

  useEffect(() => {
    if (inquiry) {
      form.reset({
        status: inquiry.status as (typeof BOOKING_INQUIRY_STATUSES)[number],
        quoteAmount: inquiry.quoteAmount ?? ("" as unknown as number),
        quoteCurrency: inquiry.quoteCurrency ?? "CAD",
        adminNotes: inquiry.adminNotes ?? "",
        followUpDate: inquiry.followUpDate
          ? format(new Date(inquiry.followUpDate), "yyyy-MM-dd")
          : "",
      });
    }
  }, [inquiry, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const payload = {
      ...values,
      quoteAmount: values.quoteAmount === "" ? undefined : values.quoteAmount,
    };
    await mutate(
      `/api/admin/inquiries/${params.id}`,
      { method: "PATCH", body: JSON.stringify(payload) },
      { successMessage: "Inquiry updated" },
    );
    reload();
  });

  return (
    <>
      <AdminHeader
        title={inquiry?.inquiryNumber ?? "Inquiry"}
        description={
          inquiry
            ? `${inquiry.firstName} ${inquiry.lastName} · ${inquiry.email}`
            : "Loading inquiry…"
        }
        onMenuClick={openMenu}
        actions={
          <Link href="/admin/inquiries" className="rounded-full px-4 py-2 text-sm text-ink/60 hover:bg-sand/30">
            Back to list
          </Link>
        }
      />
      <div className="space-y-6 p-4 lg:p-8">
        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading && !inquiry ? (
          <div className="h-64 animate-pulse rounded-xl bg-sand/30" />
        ) : inquiry ? (
          <div className="grid gap-6 xl:grid-cols-2">
            <AdminPanel className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-serif text-xl text-lake-deep">Guest request</h2>
                <StatusBadge status={inquiry.status} />
              </div>
              <dl className="grid gap-3 text-sm">
                <div>
                  <dt className="text-ink/50">Stay dates</dt>
                  <dd className="font-medium">
                    {format(new Date(inquiry.arrivalDate), "MMMM d, yyyy")} –{" "}
                    {format(new Date(inquiry.departureDate), "MMMM d, yyyy")}
                    {inquiry.dateFlexible ? " (flexible)" : ""}
                  </dd>
                </div>
                <div>
                  <dt className="text-ink/50">Party</dt>
                  <dd>
                    {inquiry.adults} adult{inquiry.adults === 1 ? "" : "s"}
                    {inquiry.children ? `, ${inquiry.children} child${inquiry.children === 1 ? "" : "ren"}` : ""}
                  </dd>
                </div>
                {inquiry.phone ? (
                  <div>
                    <dt className="text-ink/50">Phone</dt>
                    <dd>{inquiry.phone}</dd>
                  </div>
                ) : null}
                {inquiry.preferredCabins?.length ? (
                  <div>
                    <dt className="text-ink/50">Preferred cabins</dt>
                    <dd>{inquiry.preferredCabins.join(", ")}</dd>
                  </div>
                ) : null}
                {inquiry.message ? (
                  <div>
                    <dt className="text-ink/50">Message</dt>
                    <dd className="whitespace-pre-wrap">{inquiry.message}</dd>
                  </div>
                ) : null}
                {inquiry.specialRequests ? (
                  <div>
                    <dt className="text-ink/50">Special requests</dt>
                    <dd className="whitespace-pre-wrap">{inquiry.specialRequests}</dd>
                  </div>
                ) : null}
              </dl>
            </AdminPanel>

            <AdminPanel>
              <h2 className="mb-4 font-serif text-xl text-lake-deep">Admin workflow</h2>
              <form onSubmit={onSubmit} className="space-y-4">
                <FormField label="Status">
                  <AdminSelect {...form.register("status")}>
                    {BOOKING_INQUIRY_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.replace(/-/g, " ")}
                      </option>
                    ))}
                  </AdminSelect>
                </FormField>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Quote amount">
                    <AdminInput type="number" step="0.01" {...form.register("quoteAmount")} />
                  </FormField>
                  <FormField label="Currency">
                    <AdminInput {...form.register("quoteCurrency")} />
                  </FormField>
                </div>
                <FormField label="Follow-up date">
                  <AdminInput type="date" {...form.register("followUpDate")} />
                </FormField>
                <FormField label="Admin notes">
                  <AdminTextarea rows={5} {...form.register("adminNotes")} />
                </FormField>
                <Button type="submit" variant="golden" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </form>

              {inquiry.statusHistory?.length ? (
                <div className="mt-8 border-t border-sand/40 pt-6">
                  <h3 className="text-sm font-medium text-ink/60">Status history</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {inquiry.statusHistory.map((entry, index) => (
                      <li key={index} className="rounded-lg bg-cream/60 px-3 py-2">
                        <StatusBadge status={entry.status} />
                        {entry.note ? <span className="ml-2 text-ink/60">{entry.note}</span> : null}
                        <p className="mt-1 text-xs text-ink/40">
                          {format(new Date(entry.changedAt), "MMM d, yyyy h:mm a")}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </AdminPanel>
          </div>
        ) : null}
      </div>
    </>
  );
}
