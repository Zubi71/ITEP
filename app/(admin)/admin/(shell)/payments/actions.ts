"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function refundPurchase(purchaseId: string) {
  await requireAdmin();

  const purchase = await prisma.purchase.findUniqueOrThrow({ where: { id: purchaseId } });
  if (purchase.status !== "COMPLETED") {
    throw new Error("Only completed purchases can be refunded.");
  }

  await prisma.purchase.update({ where: { id: purchaseId }, data: { status: "REFUNDED" } });
  revalidatePath("/admin/payments");
}
