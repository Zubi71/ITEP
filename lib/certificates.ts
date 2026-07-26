import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { PASS_THRESHOLD } from "@/lib/stats";

export function levelLabel(scorePct: number) {
  if (scorePct >= 90) return "Level C1 — Advanced";
  if (scorePct >= 75) return "Level B2 — Upper-Intermediate";
  if (scorePct >= 60) return "Level B1 — Intermediate";
  if (scorePct >= 40) return "Level A2 — Elementary";
  return "Level A1 — Beginner";
}

// Excludes visually ambiguous characters (0/O, 1/I/L).
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomGroup(length: number) {
  let group = "";
  for (let i = 0; i < length; i++) {
    group += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  }
  return group;
}

function generateCode() {
  return `ITEP-${randomGroup(4)}-${randomGroup(4)}`;
}

function isUniqueConstraintError(error: unknown, field: string) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    (error.meta?.target as string[] | undefined)?.includes(field)
  );
}

export async function issueCertificateIfPassed(attemptId: string) {
  const attempt = await prisma.attempt.findUniqueOrThrow({
    where: { id: attemptId },
    include: { user: true, exam: true },
  });

  if ((attempt.scorePct ?? 0) < PASS_THRESHOLD) return null;

  const existing = await prisma.certificate.findUnique({ where: { attemptId } });
  if (existing) return existing;

  for (let i = 0; i < 5; i++) {
    try {
      return await prisma.certificate.create({
        data: {
          code: generateCode(),
          attemptId,
          userId: attempt.userId,
          examId: attempt.examId,
          recipientName: attempt.user.name ?? attempt.user.email,
          examTitle: attempt.exam.title,
          scorePct: attempt.scorePct!,
          levelLabel: levelLabel(attempt.scorePct!),
        },
      });
    } catch (error) {
      if (isUniqueConstraintError(error, "code")) continue;
      throw error;
    }
  }

  throw new Error("Failed to generate a unique certificate code.");
}
