import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { getPassThreshold } from "@/lib/settings";
import { cefrBand } from "@/lib/cefr";

export function levelLabel(scorePct: number) {
  const band = cefrBand(scorePct);
  return `Level ${band.code} — ${band.name}`;
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

  const passThreshold = await getPassThreshold();
  if ((attempt.scorePct ?? 0) < passThreshold) return null;

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
