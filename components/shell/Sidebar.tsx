"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href?: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "My Courses", href: "/courses", icon: "school" },
  { label: "Exams", href: "/exams", icon: "assignment" },
  { label: "Study", href: "/study", icon: "menu_book" },
  { label: "Performance", icon: "monitoring" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant flex-col p-md z-50 hidden md:flex">
      <div className="mb-xl">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">iTEP Center</h1>
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

      <div className="mt-auto">
        <div className="p-sm bg-secondary-container rounded-xl flex flex-col gap-xs">
          <p className="font-label-sm text-on-secondary-container">FREE PLAN</p>
          <p className="font-label-md text-on-secondary-container font-bold">Upgrade Plan</p>
        </div>
      </div>
    </aside>
  );
}
