import { requireStaff } from "@/lib/staff-auth";

export default async function TeacherRootLayout({ children }: { children: React.ReactNode }) {
  await requireStaff();
  return <>{children}</>;
}
