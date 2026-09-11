"use client";

import { cn } from "@/lib/utils/cn";
import { useSession } from "next-auth/react";

type AdminHeaderProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
  className?: string;
};

export function AdminHeader({
  title,
  description,
  actions,
  onMenuClick,
  className,
}: AdminHeaderProps) {
  const { data: session } = useSession();

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-sand/40 bg-cream/90 px-4 py-4 backdrop-blur-md lg:px-8",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="mt-0.5 rounded-lg border border-sand/50 bg-white/70 px-2.5 py-1.5 text-sm text-lake-deep lg:hidden"
            aria-label="Open navigation"
          >
            ☰
          </button>
          <div>
            <h1 className="font-serif text-2xl text-lake-deep">{title}</h1>
            {description ? <p className="mt-1 text-sm text-ink/60">{description}</p> : null}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {actions}
          {session?.user?.email ? (
            <span className="hidden text-xs text-ink/50 sm:block">{session.user.email}</span>
          ) : null}
        </div>
      </div>
    </header>
  );
}

export function AdminTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-sand/50 bg-white/60 p-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition",
            active === tab.id
              ? "bg-lake-deep text-cream shadow-sm"
              : "text-ink/60 hover:bg-lake-deep/5 hover:text-lake-deep",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function AdminPanel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-xl border border-sand/50 bg-white/80 p-5 shadow-sm", className)}>
      {children}
    </div>
  );
}

export function AdminPage({
  title,
  description,
  actions,
  onMenuClick,
  children,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  onMenuClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <>
      <AdminHeader title={title} description={description} actions={actions} onMenuClick={onMenuClick} />
      <div className="space-y-6 p-4 lg:p-8">{children}</div>
    </>
  );
}
