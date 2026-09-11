"use client";

import { cn } from "@/lib/utils/cn";
import Link from "next/link";
import type { ReactNode } from "react";

export type DataColumn<T> = {
  key: string;
  header: string;
  className?: string;
  render: (row: T) => ReactNode;
};

type DataTableProps<T> = {
  columns: DataColumn<T>[];
  rows: T[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  rowHref?: (row: T) => string;
};

function SkeletonRows({ cols }: { cols: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-sand/30">
          {Array.from({ length: cols }).map((__, colIndex) => (
            <td key={colIndex} className="px-4 py-3">
              <div className="h-4 animate-pulse rounded bg-sand/40" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function DataTable<T>({
  columns,
  rows,
  loading,
  emptyTitle = "Nothing here yet",
  emptyDescription = "Items will appear once created or submitted.",
  emptyAction,
  rowKey,
  onRowClick,
  rowHref,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-xl border border-sand/50 bg-white/70 shadow-sm">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-sand/40 bg-cream/80">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium text-ink/60">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <SkeletonRows cols={columns.length} />
          </tbody>
        </table>
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-sand/60 bg-white/50 px-6 py-16 text-center">
        <p className="font-serif text-xl text-lake-deep">{emptyTitle}</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">{emptyDescription}</p>
        {emptyAction ? <div className="mt-6">{emptyAction}</div> : null}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-sand/50 bg-white/70 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-sand/40 bg-cream/80">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn("px-4 py-3 font-medium text-ink/60", column.className)}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const key = rowKey(row);
              const href = rowHref?.(row);
              const clickable = Boolean(onRowClick || href);

              const cells = columns.map((column) => (
                <td key={column.key} className={cn("px-4 py-3 text-ink/80", column.className)}>
                  {column.render(row)}
                </td>
              ));

              if (href) {
                return (
                  <tr key={key} className="border-b border-sand/20 transition hover:bg-lake-deep/[0.03]">
                    {cells.map((cell, index) => (
                      <td key={columns[index].key} className={cn("px-0 py-0", columns[index].className)}>
                        <Link href={href} className="block px-4 py-3">
                          {columns[index].render(row)}
                        </Link>
                      </td>
                    ))}
                  </tr>
                );
              }

              return (
                <tr
                  key={key}
                  className={cn(
                    "border-b border-sand/20",
                    clickable && "cursor-pointer transition hover:bg-lake-deep/[0.03]",
                  )}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {cells}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  loading,
}: {
  label: string;
  value?: string | number;
  hint?: string;
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl border border-sand/50 bg-white/80 p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-ink/50">{label}</p>
      {loading ? (
        <div className="mt-3 h-8 w-16 animate-pulse rounded bg-sand/40" />
      ) : (
        <p className="mt-2 font-serif text-3xl text-lake-deep">{value ?? "—"}</p>
      )}
      {hint ? <p className="mt-1 text-xs text-ink/50">{hint}</p> : null}
    </div>
  );
}
