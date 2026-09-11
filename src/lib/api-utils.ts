import { NextResponse } from "next/server";
import { ZodError } from "zod";
import type { IBookingInquiry } from "@/models/BookingInquiry";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, init);
}

export function jsonError(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status });
}

export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return jsonError("Validation failed", 422, error.flatten());
  }

  console.error(error);
  return jsonError("Internal server error", 500);
}

export function parseObjectId(id: string) {
  return /^[a-f\d]{24}$/i.test(id);
}

export function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, Number(searchParams.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 25)));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
}

export const notArchivedFilter = { isArchived: false } as const;

export function serializeInquiry(inquiry: IBookingInquiry) {
  const snapshot = inquiry.snapshot;
  return {
    _id: inquiry._id.toString(),
    inquiryNumber: inquiry.inquiryNumber,
    firstName: snapshot.firstName,
    lastName: snapshot.lastName,
    email: snapshot.email,
    phone: snapshot.phone,
    arrivalDate: snapshot.arrivalDate,
    departureDate: snapshot.departureDate,
    dateFlexible: snapshot.dateFlexible,
    adults: snapshot.adults,
    children: snapshot.children,
    preferredCabins: snapshot.preferredCabinLabels,
    message: snapshot.message,
    specialRequests: snapshot.specialRequests,
    status: inquiry.status,
    quoteAmount: inquiry.quoteAmount,
    quoteCurrency: inquiry.quoteCurrency,
    adminNotes: inquiry.adminNotes,
    followUpDate: inquiry.followUpDate,
    statusHistory: inquiry.statusHistory,
    createdAt: inquiry.createdAt,
    updatedAt: inquiry.updatedAt,
  };
}
