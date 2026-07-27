import { requireAdmin } from "@/lib/admin-auth";

export default async function AdminAuthLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <>{children}</>;
}
