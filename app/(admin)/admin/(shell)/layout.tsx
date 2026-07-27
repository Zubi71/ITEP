import { auth } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopNav } from "@/components/admin/AdminTopNav";

export default async function AdminShellLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <>
      <AdminSidebar adminName={session?.user?.name ?? session?.user?.email ?? "Admin"} />
      <main className="md:ml-64 min-h-screen flex flex-col flex-1">
        <AdminTopNav />
        <div className="mt-20 flex-1 flex flex-col">{children}</div>
      </main>
    </>
  );
}
