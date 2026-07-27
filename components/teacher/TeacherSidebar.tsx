"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href?: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/teacher/dashboard", icon: "dashboard" },
  { label: "Question Bank", href: "/teacher/question-bank", icon: "database" },
  { label: "Evaluations", href: "/teacher/evaluations", icon: "rate_review" },
];

export function TeacherSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant flex flex-col p-md z-50 hidden md:flex">
      <div className="mb-lg">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">iTEP Center</h1>
        <p className="font-body-sm text-on-surface-variant">Teacher Console</p>
      </div>

      <nav className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-xs">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.label}
              href={item.href!}
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
