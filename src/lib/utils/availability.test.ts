import { describe, expect, it } from "vitest";
import {
  BLOCKING_AVAILABILITY_STATUSES,
  dateRangesOverlap,
  findConflictingBlocks,
  hasBlockingConflict,
  isBlockingStatus,
  isValidDateRange,
  rangesConflict,
  type AvailabilityRange,
} from "./availability";

function d(iso: string): Date {
  return new Date(`${iso}T00:00:00.000Z`);
}

function block(
  overrides: Partial<AvailabilityRange> & Pick<AvailabilityRange, "startDate" | "endDate" | "status">,
): AvailabilityRange {
  return {
    cabinId: "507f1f77bcf86cd799439011",
    cabinNumber: 5,
    ...overrides,
  };
}

describe("dateRangesOverlap", () => {
  it("detects partial overlap at the start of a range", () => {
    const a = { startDate: d("2026-07-01"), endDate: d("2026-07-10") };
    const b = { startDate: d("2026-07-05"), endDate: d("2026-07-15") };
    expect(dateRangesOverlap(a, b)).toBe(true);
  });

  it("detects partial overlap at the end of a range", () => {
    const a = { startDate: d("2026-07-10"), endDate: d("2026-07-20") };
    const b = { startDate: d("2026-07-01"), endDate: d("2026-07-12") };
    expect(dateRangesOverlap(a, b)).toBe(true);
  });

  it("detects when one range fully contains another", () => {
    const outer = { startDate: d("2026-07-01"), endDate: d("2026-07-31") };
    const inner = { startDate: d("2026-07-10"), endDate: d("2026-07-15") };
    expect(dateRangesOverlap(outer, inner)).toBe(true);
    expect(dateRangesOverlap(inner, outer)).toBe(true);
  });

  it("does not overlap when ranges are adjacent (checkout = next check-in)", () => {
    const first = { startDate: d("2026-07-01"), endDate: d("2026-07-08") };
    const second = { startDate: d("2026-07-08"), endDate: d("2026-07-15") };
    expect(dateRangesOverlap(first, second)).toBe(false);
  });

  it("does not overlap when ranges are separated by a gap", () => {
    const a = { startDate: d("2026-07-01"), endDate: d("2026-07-05") };
    const b = { startDate: d("2026-07-10"), endDate: d("2026-07-15") };
    expect(dateRangesOverlap(a, b)).toBe(false);
  });

  it("does not overlap identical single-day invalid ranges", () => {
    const sameDay = { startDate: d("2026-07-01"), endDate: d("2026-07-01") };
    expect(dateRangesOverlap(sameDay, sameDay)).toBe(false);
  });
});

describe("isValidDateRange", () => {
  it("accepts ranges where end is after start", () => {
    expect(
      isValidDateRange({ startDate: d("2026-07-01"), endDate: d("2026-07-08") }),
    ).toBe(true);
  });

  it("rejects equal start and end dates", () => {
    expect(
      isValidDateRange({ startDate: d("2026-07-01"), endDate: d("2026-07-01") }),
    ).toBe(false);
  });

  it("rejects inverted ranges", () => {
    expect(
      isValidDateRange({ startDate: d("2026-07-10"), endDate: d("2026-07-01") }),
    ).toBe(false);
  });
});

describe("isBlockingStatus", () => {
  it("treats confirmed, owner-blocked, held, and maintenance as blocking", () => {
    for (const status of BLOCKING_AVAILABILITY_STATUSES) {
      expect(isBlockingStatus(status)).toBe(true);
    }
  });

  it("does not treat advisory statuses as blocking", () => {
    expect(isBlockingStatus("available-note")).toBe(false);
    expect(isBlockingStatus("tentative")).toBe(false);
  });
});

describe("rangesConflict", () => {
  const confirmed = block({
    startDate: d("2026-07-10"),
    endDate: d("2026-07-17"),
    status: "confirmed",
    id: "existing-1",
  });

  it("conflicts when blocking ranges overlap on the same cabin", () => {
    const candidate = block({
      startDate: d("2026-07-12"),
      endDate: d("2026-07-20"),
      status: "confirmed",
    });
    expect(rangesConflict(candidate, confirmed)).toBe(true);
  });

  it("does not conflict for overlapping non-blocking statuses", () => {
    const tentative = block({
      startDate: d("2026-07-12"),
      endDate: d("2026-07-20"),
      status: "tentative",
    });
    expect(rangesConflict(tentative, confirmed)).toBe(false);
    expect(
      rangesConflict(
        block({ startDate: d("2026-07-12"), endDate: d("2026-07-20"), status: "tentative" }),
        block({ startDate: d("2026-07-10"), endDate: d("2026-07-17"), status: "available-note" }),
      ),
    ).toBe(false);
  });

  it("does not conflict when dates overlap but cabins differ", () => {
    const otherCabin = block({
      startDate: d("2026-07-12"),
      endDate: d("2026-07-20"),
      status: "confirmed",
      cabinId: "507f1f77bcf86cd799439099",
      cabinNumber: 6,
    });
    expect(rangesConflict(otherCabin, confirmed)).toBe(false);
  });

  it("matches cabins by number when IDs are absent", () => {
    const byNumber = block({
      startDate: d("2026-07-12"),
      endDate: d("2026-07-20"),
      status: "owner-blocked",
      cabinId: undefined,
      cabinNumber: 5,
    });
    const existingByNumber = block({
      startDate: d("2026-07-10"),
      endDate: d("2026-07-17"),
      status: "confirmed",
      cabinId: undefined,
      cabinNumber: 5,
    });
    expect(rangesConflict(byNumber, existingByNumber)).toBe(true);
  });

  it("allows back-to-back stays on the same cabin", () => {
    const nextStay = block({
      startDate: d("2026-07-17"),
      endDate: d("2026-07-24"),
      status: "confirmed",
    });
    expect(rangesConflict(nextStay, confirmed)).toBe(false);
  });
});

describe("findConflictingBlocks and hasBlockingConflict", () => {
  const existing: AvailabilityRange[] = [
    block({
      id: "block-a",
      startDate: d("2026-08-01"),
      endDate: d("2026-08-08"),
      status: "confirmed",
      cabinNumber: 7,
    }),
    block({
      id: "block-b",
      startDate: d("2026-08-10"),
      endDate: d("2026-08-15"),
      status: "maintenance",
      cabinNumber: 7,
    }),
    block({
      id: "block-c",
      startDate: d("2026-08-05"),
      endDate: d("2026-08-12"),
      status: "tentative",
      cabinNumber: 7,
    }),
    block({
      id: "block-d",
      startDate: d("2026-08-01"),
      endDate: d("2026-08-08"),
      status: "confirmed",
      cabinNumber: 8,
    }),
  ];

  it("returns all overlapping blocking blocks for the same cabin", () => {
    const candidate = block({
      startDate: d("2026-08-06"),
      endDate: d("2026-08-11"),
      status: "confirmed",
      cabinNumber: 7,
    });

    const conflicts = findConflictingBlocks(candidate, existing);
    expect(conflicts.map((item) => item.id)).toEqual(["block-a", "block-b"]);
    expect(hasBlockingConflict(candidate, existing)).toBe(true);
  });

  it("excludes the block being updated from conflict checks", () => {
    const candidate = block({
      id: "block-a",
      startDate: d("2026-08-01"),
      endDate: d("2026-08-08"),
      status: "confirmed",
      cabinNumber: 7,
    });

    expect(findConflictingBlocks(candidate, existing, "block-a")).toEqual([]);
    expect(hasBlockingConflict(candidate, existing, "block-a")).toBe(false);
  });

  it("returns no conflicts for non-overlapping blocking ranges", () => {
    const candidate = block({
      startDate: d("2026-08-20"),
      endDate: d("2026-08-25"),
      status: "owner-blocked",
      cabinNumber: 7,
    });

    expect(findConflictingBlocks(candidate, existing)).toEqual([]);
    expect(hasBlockingConflict(candidate, existing)).toBe(false);
  });
});
