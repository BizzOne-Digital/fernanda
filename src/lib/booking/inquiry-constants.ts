/** Shared inquiry statuses — safe for client + server (no Mongoose). */
export const BOOKING_INQUIRY_STATUSES = [
  "new",
  "contacted",
  "quote-sent",
  "tentative",
  "confirmed",
  "declined",
  "closed",
  "spam",
] as const;

export type BookingInquiryStatus = (typeof BOOKING_INQUIRY_STATUSES)[number];
