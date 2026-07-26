"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function startExam(formData: FormData) {
  const examId = formData.get("examId");
  if (typeof examId !== "string") {
    throw new Error("Missing examId");
  }

  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const exam = await prisma.exam.findUniqueOrThrow({ where: { id: examId } });

  // Reuse an in-progress attempt for this exam if one already exists, so
  // clicking "Start Exam" twice doesn't orphan an abandoned attempt.
  const existing = await prisma.attempt.findFirst({
    where: { userId: session.user.id, examId, status: "IN_PROGRESS" },
  });

  const attempt =
    existing ??
    (await prisma.attempt.create({
      data: {
        userId: session.user.id,
        examId,
        timeLimitSec: exam.durationMin * 60,
      },
    }));

  redirect(`/exam/${attempt.id}`);
}
