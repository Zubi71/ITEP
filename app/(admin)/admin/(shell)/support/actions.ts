"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function resolveTicket(ticketId: string) {
  const session = await requireAdmin();

  await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status: "RESOLVED", resolvedById: session.user.id, resolvedAt: new Date() },
  });

  revalidatePath("/admin/support");
}
