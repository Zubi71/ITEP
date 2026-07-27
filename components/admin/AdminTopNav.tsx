"use client";

import { usePathname } from "next/navigation";
import { UserMenu } from "@/components/shared/UserMenu";
import { useMobileNav } from "@/components/shared/MobileNavContext";

const TITLES: { prefix: string; title: string }[] = [
  { prefix: "/admin/dashboard", title: "Center Dashboard" },
  { prefix: "/admin/users", title: "User Management" },
  { prefix: "/admin/question-bank", title: "Question Bank" },
  { prefix: "/admin/exams", title: "Exam Management" },
  { prefix: "/admin/evaluations", title: "Evaluation Queue" },
  { prefix: "/admin/courses", title: "Course Management" },
  { prefix: "/admin/payments", title: "Payments" },
  { prefix: "/admin/settings", title: "Settings" },
  { prefix: "/admin/support", title: "Support Inbox" },
];

export function AdminTopNav({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  const { toggle } = useMobileNav();
  const title = TITLES.find((t) => pathname.startsWith(t.prefix))?.title ?? "Admin Console";

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 bg-surface-glass backdrop-blur-md h-20 px-margin-mobile md:px-margin-desktop flex items-center justify-between z-40 gap-sm">
      <div className="flex items-center gap-sm min-w-0">
        <button onClick={toggle} className="md:hidden text-on-surface-variant p-1 flex-none">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="font-headline-md text-headline-md font-bold text-primary truncate">{title}</h2>
      </div>
      <div className="flex items-center gap-sm md:gap-md flex-none">
        <div className="hidden lg:flex items-center gap-sm">
          <span className="font-label-md text-label-md font-semibold text-primary">System Status: Active</span>
          <span className="w-3 h-3 bg-success rounded-full animate-pulse" />
        </div>
        <UserMenu
          name={adminName}
          roleLabel="Admin"
          links={[
            { label: "Settings", href: "/admin/settings", icon: "settings" },
            { label: "Support", href: "/admin/support", icon: "help" },
          ]}
        />
      </div>
    </header>
  );
}
