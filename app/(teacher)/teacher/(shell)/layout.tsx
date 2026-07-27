import { auth } from "@/lib/auth";
import { TeacherSidebar } from "@/components/teacher/TeacherSidebar";
import { TeacherTopNav } from "@/components/teacher/TeacherTopNav";
import { MobileNavProvider } from "@/components/shared/MobileNavContext";

export default async function TeacherShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const roleLabel = session?.user?.role === "ADMIN" ? "Admin" : "Teacher";

  return (
    <MobileNavProvider>
      <TeacherSidebar />
      <main className="md:ml-64 min-h-screen flex flex-col flex-1">
        <TeacherTopNav name={session?.user?.name ?? session?.user?.email ?? "Teacher"} roleLabel={roleLabel} />
        <div className="mt-20 flex-1 flex flex-col">{children}</div>
      </main>
    </MobileNavProvider>
  );
}
