"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { issueCertificateIfPassed } from "@/lib/certificates";
import { finalizeAttemptIfFullyGraded } from "@/lib/grading";

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

export async function saveTextAnswer(attemptId: string, questionId: string, text: string) {
  await requireOwnedInProgressAttempt(attemptId);

  await prisma.answer.upsert({
    where: { attemptId_questionId: { attemptId, questionId } },
    update: { responseText: text },
    create: { attemptId, questionId, responseText: text },
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

  const hasSubjective = questions.some((q) => q.type !== "MULTIPLE_CHOICE");

  // Grade every MCQ answer — identical to the pre-subjective-questions behavior.
  let correctCount = 0;
  let mcqCount = 0;
  for (const question of questions) {
    if (question.type !== "MULTIPLE_CHOICE") continue;
    mcqCount++;

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

  if (!hasSubjective) {
    // Exam is pure multiple-choice — run the exact original path, unmodified.
    // This is the explicit regression guarantee for every exam that existed
    // before subjective questions were introduced.
    const scorePct = mcqCount > 0 ? (correctCount / mcqCount) * 100 : 0;

    await prisma.attempt.update({
      where: { id: attemptId },
      data: { status: "SUBMITTED", submittedAt: new Date(), scorePct },
    });

    await issueCertificateIfPassed(attemptId);
    redirect(`/results/${attemptId}`);
  }

  // Exam contains at least one subjective (Writing/Speaking) question — it
  // can't get a final score the instant the student finishes, since a human
  // still needs to grade the free-text response(s).
  for (const question of questions) {
    if (question.type === "MULTIPLE_CHOICE") continue;

    const answer = answerByQuestion.get(question.id);
    if (!answer || !answer.responseText?.trim()) {
      // Never answered — auto-graded as 0, no point queuing a blank for a human.
      await prisma.answer.upsert({
        where: { attemptId_questionId: { attemptId, questionId: question.id } },
        update: { subjectiveScorePct: 0 },
        create: { attemptId, questionId: question.id, subjectiveScorePct: 0 },
      });
    }
    // Otherwise: leave subjectiveScorePct as null — awaiting human grading.
  }

  await prisma.attempt.update({
    where: { id: attemptId },
    data: { status: "PENDING_REVIEW", submittedAt: new Date() },
  });

  // Edge case: every subjective question was left blank, so nothing actually
  // needs a human — finalize immediately instead of sitting in the queue forever.
  await finalizeAttemptIfFullyGraded(attemptId);

  redirect(`/results/${attemptId}`);
}
