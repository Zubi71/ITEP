"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function submitTicket(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const subject = formData.get("subject");
  const message = formData.get("message");
  if (typeof subject !== "string" || !subject.trim() || typeof message !== "string" || !message.trim()) {
    throw new Error("Subject and message are required.");
  }

  await prisma.supportTicket.create({
    data: { userId: session.user.id, subject, message },
  });

  revalidatePath("/support");
  revalidatePath("/teacher/support");
  revalidatePath("/admin/support");
}
