"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { cn } from "@/lib/utils/cn";

type AdminLayoutContextValue = {
  openMenu: () => void;
  closeMenu: () => void;
  mobileOpen: boolean;
};

const AdminLayoutContext = createContext<AdminLayoutContextValue | null>(null);

export function useAdminLayout() {
  const context = useContext(AdminLayoutContext);
  if (!context) {
    throw new Error("useAdminLayout must be used within AdminShell");
  }
  return context;
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <AdminLayoutContext.Provider
      value={{
        openMenu: () => setMobileOpen(true),
        closeMenu: () => setMobileOpen(false),
        mobileOpen,
      }}
    >
      <div className="min-h-screen bg-cream text-ink lg:flex">
        <AdminSidebar />
        {mobileOpen ? (
          <button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        ) : null}
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform lg:hidden",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <AdminSidebar mobile />
        </div>
        <div className="flex min-h-screen flex-1 flex-col">{children}</div>
      </div>
    </AdminLayoutContext.Provider>
  );
}
