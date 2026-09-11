const INQUIRY_PREFIX = "VLR";

function pad(value: number, length: number): string {
  return String(value).padStart(length, "0");
}

function randomSuffix(length = 4): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < length; i += 1) {
    result += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return result;
}

export function formatInquiryDatePart(date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1, 2);
  const day = pad(date.getUTCDate(), 2);
  return `${year}${month}${day}`;
}

export function generateInquiryNumber(date = new Date()): string {
  return `${INQUIRY_PREFIX}-${formatInquiryDatePart(date)}-${randomSuffix()}`;
}

export function isValidInquiryNumber(value: string): boolean {
  return /^VLR-\d{8}-[A-Z2-9]{4}$/.test(value);
}

export function parseInquiryNumber(value: string): {
  prefix: string;
  datePart: string;
  suffix: string;
} | null {
  const match = value.match(/^(VLR)-(\d{8})-([A-Z2-9]{4})$/);
  if (!match) {
    return null;
  }

  return {
    prefix: match[1],
    datePart: match[2],
    suffix: match[3],
  };
}
