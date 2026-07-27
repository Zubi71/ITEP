"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import type { ExamStatus } from "@/app/generated/prisma/client";

export async function updateExamStatus(examId: string, status: ExamStatus) {
  await requireAdmin();
  await prisma.exam.update({ where: { id: examId }, data: { status } });
  revalidatePath("/admin/exams");
  revalidatePath("/exams");
}
