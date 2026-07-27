"use client";

import { usePathname } from "next/navigation";
import { UserMenu } from "@/components/shared/UserMenu";
import { useMobileNav } from "@/components/shared/MobileNavContext";

const TITLES: { prefix: string; title: string }[] = [
  { prefix: "/teacher/dashboard", title: "Teacher Dashboard" },
  { prefix: "/teacher/question-bank", title: "Question Bank" },
  { prefix: "/teacher/evaluations", title: "Evaluation Queue" },
  { prefix: "/teacher/support", title: "Support" },
];

export function TeacherTopNav({ name, roleLabel }: { name: string; roleLabel: string }) {
  const pathname = usePathname();
  const { toggle } = useMobileNav();
  const title = TITLES.find((t) => pathname.startsWith(t.prefix))?.title ?? "Teacher Console";

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 bg-surface-glass backdrop-blur-md h-20 px-margin-mobile md:px-margin-desktop flex items-center justify-between z-40 gap-sm">
      <div className="flex items-center gap-sm min-w-0">
        <button onClick={toggle} className="md:hidden text-on-surface-variant p-1 flex-none">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="font-headline-md text-headline-md font-bold text-primary truncate">{title}</h2>
      </div>
      <UserMenu name={name} roleLabel={roleLabel} links={[{ label: "Support", href: "/teacher/support", icon: "help" }]} />
    </header>
  );
}
