"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "@/components/shared/UserMenu";

const TITLES: { prefix: string; title: string }[] = [
  { prefix: "/dashboard", title: "Student Dashboard" },
  { prefix: "/exams", title: "Mock Exams" },
  { prefix: "/exam", title: "Exam in Progress" },
  { prefix: "/results", title: "Exam Results" },
  { prefix: "/study", title: "Study Materials" },
  { prefix: "/support", title: "Support" },
];

export function TopNav({ userName }: { userName: string }) {
  const pathname = usePathname();
  const title = TITLES.find((t) => pathname.startsWith(t.prefix))?.title ?? "iTEP Center";

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 bg-surface-glass backdrop-blur-md h-20 px-margin-desktop flex items-center justify-between z-40">
      <h2 className="font-headline-md text-headline-md font-bold text-primary">{title}</h2>
      <div className="flex items-center gap-md">
        <Link
          href="/exams"
          className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all"
        >
          New Test
        </Link>
        <UserMenu name={userName} roleLabel="Student" links={[{ label: "Support", href: "/support", icon: "help" }]} />
      </div>
    </header>
  );
}
