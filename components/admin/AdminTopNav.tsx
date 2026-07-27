"use client";

import { usePathname } from "next/navigation";

const TITLES: { prefix: string; title: string }[] = [
  { prefix: "/admin/dashboard", title: "Center Dashboard" },
  { prefix: "/admin/users", title: "User Management" },
  { prefix: "/admin/question-bank", title: "Question Bank" },
  { prefix: "/admin/exams", title: "Exam Management" },
  { prefix: "/admin/evaluations", title: "Evaluation Queue" },
];

export function AdminTopNav() {
  const pathname = usePathname();
  const title = TITLES.find((t) => pathname.startsWith(t.prefix))?.title ?? "Admin Console";

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 bg-surface-glass backdrop-blur-md h-20 px-margin-desktop flex items-center justify-between z-40">
      <h2 className="font-headline-md text-headline-md font-bold text-primary">{title}</h2>
      <div className="flex items-center gap-sm">
        <span className="font-label-md text-label-md font-semibold text-primary">System Status: Active</span>
        <span className="w-3 h-3 bg-success rounded-full animate-pulse" />
      </div>
    </header>
  );
}
