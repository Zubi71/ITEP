import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/shell/Sidebar";
import { TopNav } from "@/components/shell/TopNav";
import { Footer } from "@/components/shell/Footer";
import { MobileNavProvider } from "@/components/shared/MobileNavContext";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true },
  });

  return (
    <MobileNavProvider>
      <Sidebar />
      <main className="md:ml-64 min-h-screen flex flex-col flex-1">
        <TopNav userName={user?.name ?? user?.email ?? "Student"} />
        <div className="mt-20 flex-1 flex flex-col">{children}</div>
        <Footer />
      </main>
    </MobileNavProvider>
  );
}
