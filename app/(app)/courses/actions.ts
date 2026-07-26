"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Mock enrollment — no payment step yet. The client will supply real Stripe
// credentials later; when that happens, replace the direct Purchase.create
// below with a stripe.checkout.sessions.create(...) call + redirect(session.url!),
// and start new Purchase rows as PENDING instead of COMPLETED. The schema
// (nullable Stripe fields) already supports that without a migration.
export async function enrollInCourse(formData: FormData) {
  const courseId = formData.get("courseId");
  if (typeof courseId !== "string") {
    throw new Error("Missing courseId");
  }

  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const course = await prisma.course.findUniqueOrThrow({ where: { id: courseId } });

  const existing = await prisma.purchase.findFirst({
    where: { userId: session.user.id, courseId, status: "COMPLETED" },
  });

  if (!existing) {
    await prisma.purchase.create({
      data: {
        userId: session.user.id,
        courseId,
        status: "COMPLETED",
        amountCents: course.priceCents,
        currency: course.currency,
        completedAt: new Date(),
      },
    });
  }

  revalidatePath("/courses");
  redirect("/courses");
}
