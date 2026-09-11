"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";

const items = [
  ["Dashboard", "/admin"],
  ["Pages", "/admin/pages"],
  ["Cabins", "/admin/cabins"],
  ["Services", "/admin/services"],
  ["Rates & Seasons", "/admin/seasons"],
  ["Booking Inquiries", "/admin/inquiries"],
  ["Availability", "/admin/availability"],
  ["Gallery", "/admin/gallery"],
  ["Testimonials", "/admin/testimonials"],
  ["FAQs", "/admin/faqs"],
  ["Things to Do", "/admin/attractions"],
  ["Blogs", "/admin/blogs"],
  ["Messages", "/admin/messages"],
  ["Settings", "/admin/settings"],
];

export function AdminSidebar({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  return (
    <aside className={cn("bg-lake-deep text-cream", mobile ? "p-4" : "hidden min-h-screen w-64 shrink-0 p-5 lg:block")}>
      <p className="font-serif text-xl">Vaseaux Admin</p>
      <nav className="mt-6 space-y-1" aria-label="Admin">
        {items.map(([label, href]) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm transition",
                active ? "bg-cream/15 text-cream" : "text-sand hover:bg-cream/10",
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
