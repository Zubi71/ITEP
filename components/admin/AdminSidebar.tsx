"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
  { label: "Courses", href: "/admin/courses", icon: "school" },
  { label: "Payments", href: "/admin/payments", icon: "payments" },
  { label: "Evaluations", href: "/admin/evaluations", icon: "rate_review" },
];

export function AdminSidebar() {
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
    </aside>
  );
}
