"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

type NavItem = {
  label: string;
  href?: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "dashboard" },
  { label: "Users", href: "/admin/users", icon: "group" },
  { label: "Question Bank", href: "/admin/question-bank", icon: "database" },
  { label: "Exams", href: "/admin/exams", icon: "quiz" },
  { label: "Courses", icon: "school" },
  { label: "Payments", icon: "payments" },
  { label: "Evaluations", href: "/admin/evaluations", icon: "rate_review" },
];

export function AdminSidebar({ adminName }: { adminName: string }) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col p-md z-50 hidden md:flex">
      <div className="mb-lg">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">iTEP Center</h1>
        <p className="font-body-sm text-on-surface-variant">Admin Console</p>
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-xs">
        {NAV_ITEMS.map((item) => {
          if (!item.href) {
            return (
              <span
                key={item.label}
                title="Coming soon"
                className="flex items-center justify-between gap-sm text-outline-variant rounded-lg px-4 py-3 cursor-not-allowed"
              >
                <span className="flex items-center gap-sm">
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-label-md text-label-md">{item.label}</span>
                </span>
                <span className="text-[10px] uppercase font-bold">Soon</span>
              </span>
            );
          }

          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-sm rounded-lg px-4 py-3 transition-colors ${
                active
                  ? "bg-primary-fixed text-on-primary-fixed"
                  : "text-on-surface-variant hover:bg-surface-container-high"
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className="font-label-md text-label-md">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-xs">
        <span
          title="Coming soon"
          className="flex items-center gap-sm text-outline-variant rounded-lg px-4 py-3 cursor-not-allowed"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-label-md text-label-md">Settings</span>
        </span>
        <span
          title="Coming soon"
          className="flex items-center gap-sm text-outline-variant rounded-lg px-4 py-3 cursor-not-allowed"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="font-label-md text-label-md">Support</span>
        </span>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-sm text-on-surface-variant hover:bg-surface-container-high rounded-lg px-4 py-3 transition-colors"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-label-md text-label-md">Sign Out</span>
        </button>

        <div className="flex items-center gap-sm pt-md border-t border-outline-variant">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-high flex items-center justify-center text-on-surface-variant font-bold">
            {adminName.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col overflow-hidden">
            <p className="font-label-md text-on-surface font-bold truncate">{adminName}</p>
            <p className="font-label-sm text-on-surface-variant">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
