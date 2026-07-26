"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { issueCertificateIfPassed } from "@/lib/certificates";

async function requireOwnedInProgressAttempt(attemptId: string) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const attempt = await prisma.attempt.findUniqueOrThrow({ where: { id: attemptId } });
  if (attempt.userId !== session.user.id) {
    throw new Error("Not authorized to modify this attempt.");
  }
  if (attempt.status !== "IN_PROGRESS") {
    throw new Error("This attempt is no longer in progress.");
  }

  return attempt;
}

export async function saveAnswer(attemptId: string, questionId: string, choiceId: string) {
  await requireOwnedInProgressAttempt(attemptId);

  await prisma.answer.upsert({
    where: { attemptId_questionId: { attemptId, questionId } },
    update: { choiceId },
    create: { attemptId, questionId, choiceId },
  });

  revalidatePath(`/exam/${attemptId}`);
}

export async function toggleFlag(attemptId: string, questionId: string) {
  await requireOwnedInProgressAttempt(attemptId);

  const existing = await prisma.attemptFlag.findUnique({
    where: { attemptId_questionId: { attemptId, questionId } },
  });

  if (existing) {
    await prisma.attemptFlag.delete({ where: { id: existing.id } });
  } else {
    await prisma.attemptFlag.create({ data: { attemptId, questionId } });
  }

  revalidatePath(`/exam/${attemptId}`);
}

export async function setCurrentIndex(attemptId: string, index: number) {
  await requireOwnedInProgressAttempt(attemptId);
  await prisma.attempt.update({ where: { id: attemptId }, data: { currentIndex: index } });
}

export async function submitAttempt(attemptId: string) {
  const attempt = await requireOwnedInProgressAttempt(attemptId);

  const questions = await prisma.question.findMany({
    where: { section: { examId: attempt.examId } },
    include: { choices: true },
  });

  const answers = await prisma.answer.findMany({ where: { attemptId } });
  const answerByQuestion = new Map(answers.map((a) => [a.questionId, a]));

  let correctCount = 0;
  for (const question of questions) {
    const answer = answerByQuestion.get(question.id);
    const chosenChoice = answer?.choiceId
      ? question.choices.find((c) => c.id === answer.choiceId)
      : undefined;
    const isCorrect = chosenChoice?.isCorrect ?? false;
    if (isCorrect) correctCount++;

    if (answer) {
      await prisma.answer.update({ where: { id: answer.id }, data: { isCorrect } });
    }
  }

  const scorePct = questions.length > 0 ? (correctCount / questions.length) * 100 : 0;

  await prisma.attempt.update({
    where: { id: attemptId },
    data: {
      status: "SUBMITTED",
      submittedAt: new Date(),
      scorePct,
    },
  });

  await issueCertificateIfPassed(attemptId);

  redirect(`/results/${attemptId}`);
}
