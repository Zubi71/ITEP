"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/staff-auth";
import { finalizeAttemptIfFullyGraded } from "@/lib/grading";

export async function gradeAnswer(attemptId: string, answerId: string, scorePct: number) {
  const session = await requireStaff();

  if (!Number.isFinite(scorePct) || scorePct < 0 || scorePct > 100) {
    throw new Error("Score must be a number between 0 and 100.");
  }

  await prisma.answer.update({
    where: { id: answerId },
    data: { subjectiveScorePct: scorePct, gradedById: session.user.id, gradedAt: new Date() },
  });

  await finalizeAttemptIfFullyGraded(attemptId);

  revalidatePath(`/admin/evaluations/${attemptId}`);
  revalidatePath("/admin/evaluations");
  revalidatePath(`/teacher/evaluations/${attemptId}`);
  revalidatePath("/teacher/evaluations");
  revalidatePath(`/results/${attemptId}`);
}
