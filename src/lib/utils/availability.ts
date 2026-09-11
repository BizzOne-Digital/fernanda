import type { AvailabilityBlockStatus } from "@/models/AvailabilityBlock";

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface AvailabilityRange extends DateRange {
  id?: string;
  cabinId?: string | null;
  cabinNumber?: number | null;
  status: AvailabilityBlockStatus;
}

/**
 * Half-open interval overlap: [start, end)
 * Checkout day equals the next guest's check-in day without conflict.
 */
export function dateRangesOverlap(a: DateRange, b: DateRange): boolean {
  return a.startDate < b.endDate && b.startDate < a.endDate;
}

export function isValidDateRange(range: DateRange): boolean {
  return range.startDate < range.endDate;
}

export const BLOCKING_AVAILABILITY_STATUSES: ReadonlySet<AvailabilityBlockStatus> =
  new Set(["confirmed", "owner-blocked", "held", "maintenance"]);

export function isBlockingStatus(status: AvailabilityBlockStatus): boolean {
  return BLOCKING_AVAILABILITY_STATUSES.has(status);
}

export function rangesConflict(
  candidate: AvailabilityRange,
  existing: AvailabilityRange,
): boolean {
  if (!isBlockingStatus(candidate.status) || !isBlockingStatus(existing.status)) {
    return false;
  }

  if (!dateRangesOverlap(candidate, existing)) {
    return false;
  }

  return isSameCabin(candidate, existing);
}

export function isSameCabin(
  candidate: Pick<AvailabilityRange, "cabinId" | "cabinNumber">,
  existing: Pick<AvailabilityRange, "cabinId" | "cabinNumber">,
): boolean {
  if (candidate.cabinNumber != null && existing.cabinNumber != null) {
    if (candidate.cabinNumber !== existing.cabinNumber) {
      return false;
    }
  }

  if (candidate.cabinId && existing.cabinId) {
    return String(candidate.cabinId) === String(existing.cabinId);
  }

  if (candidate.cabinNumber != null && existing.cabinNumber != null) {
    return candidate.cabinNumber === existing.cabinNumber;
  }

  return false;
}

export function findConflictingBlocks(
  candidate: AvailabilityRange,
  existingBlocks: AvailabilityRange[],
  excludeId?: string,
): AvailabilityRange[] {
  return existingBlocks.filter((block) => {
    if (excludeId && block.id === excludeId) {
      return false;
    }
    return rangesConflict(candidate, block);
  });
}

export function hasBlockingConflict(
  candidate: AvailabilityRange,
  existingBlocks: AvailabilityRange[],
  excludeId?: string,
): boolean {
  return findConflictingBlocks(candidate, existingBlocks, excludeId).length > 0;
}

export function normalizeToUtcMidnight(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}
