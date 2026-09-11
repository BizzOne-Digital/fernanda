import { cn } from "@/lib/utils/cn";

const STATUS_STYLES: Record<string, string> = {
  draft: "bg-sand/30 text-ink/70 border-sand/60",
  published: "bg-forest/15 text-forest border-forest/30",
  archived: "bg-ink/5 text-ink/50 border-ink/10",
  new: "bg-golden/20 text-ink border-golden/40",
  contacted: "bg-lake-medium/15 text-lake-deep border-lake-medium/30",
  "quote-sent": "bg-lake-medium/20 text-lake-deep border-lake-medium/40",
  tentative: "bg-golden/15 text-ink border-golden/30",
  confirmed: "bg-forest/20 text-forest border-forest/40",
  declined: "bg-red-50 text-red-700 border-red-200",
  closed: "bg-ink/5 text-ink/50 border-ink/10",
  spam: "bg-red-50 text-red-600 border-red-200",
  read: "bg-lake-medium/10 text-lake-deep border-lake-medium/20",
  replied: "bg-forest/15 text-forest border-forest/30",
  "available-note": "bg-forest/15 text-forest border-forest/30",
  held: "bg-golden/20 text-ink border-golden/40",
  "owner-blocked": "bg-ink/10 text-ink/60 border-ink/20",
  maintenance: "bg-red-50 text-red-700 border-red-200",
};

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  const style = STATUS_STYLES[normalized] ?? "bg-sand/20 text-ink/70 border-sand/50";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
        style,
        className,
      )}
    >
      {status.replace(/-/g, " ")}
    </span>
  );
}
