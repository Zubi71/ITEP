import { prisma } from "@/lib/prisma";
import { issueCertificateIfPassed } from "@/lib/certificates";

// Computes the same blended score formula used at submit time: each
// question contributes 100/0 (MCQ) or its graded subjective percentage.
// Mathematically identical to the old correct/total*100 for pure-MCQ exams.
async function computeScorePct(attemptId: string) {
  const answers = await prisma.answer.findMany({
    where: { attemptId },
    include: { question: true },
  });

  if (answers.length === 0) return 0;

  const sum = answers.reduce((total, answer) => {
    const contribution =
      answer.question.type === "MULTIPLE_CHOICE" ? (answer.isCorrect ? 100 : 0) : (answer.subjectiveScorePct ?? 0);
    return total + contribution;
  }, 0);

  return sum / answers.length;
}

export async function finalizeAttemptIfFullyGraded(attemptId: string) {
  const attempt = await prisma.attempt.findUniqueOrThrow({ where: { id: attemptId } });
  if (attempt.status !== "PENDING_REVIEW") return;

  const ungradedCount = await prisma.answer.count({
    where: {
      attemptId,
      question: { type: { not: "MULTIPLE_CHOICE" } },
      subjectiveScorePct: null,
    },
  });
  if (ungradedCount > 0) return;

  const scorePct = await computeScorePct(attemptId);

  await prisma.attempt.update({
    where: { id: attemptId },
    data: {
      status: "SUBMITTED",
      scorePct,
      gradedAt: new Date(),
    },
  });

  await issueCertificateIfPassed(attemptId);
}

export { computeScorePct };
