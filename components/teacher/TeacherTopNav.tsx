"use client";

import { usePathname } from "next/navigation";

const TITLES: { prefix: string; title: string }[] = [
  { prefix: "/teacher/dashboard", title: "Teacher Dashboard" },
  { prefix: "/teacher/question-bank", title: "Question Bank" },
  { prefix: "/teacher/evaluations", title: "Evaluation Queue" },
  { prefix: "/teacher/support", title: "Support" },
];

export function TeacherTopNav() {
  const pathname = usePathname();
  const title = TITLES.find((t) => pathname.startsWith(t.prefix))?.title ?? "Teacher Console";

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 bg-surface-glass backdrop-blur-md h-20 px-margin-desktop flex items-center justify-between z-40">
      <h2 className="font-headline-md text-headline-md font-bold text-primary">{title}</h2>
    </header>
  );
}
