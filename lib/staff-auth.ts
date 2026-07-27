import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

// Grading and Question Bank actions are shared between the Teacher and Admin
// consoles — an admin can do everything a teacher can, plus more.
export async function requireStaff() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "TEACHER" && session.user.role !== "ADMIN")) {
    redirect("/login");
  }
  return session;
}
