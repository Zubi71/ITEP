import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExamRunner, type QuestionVM } from "@/components/exam/ExamRunner";
import { submitAttempt } from "@/app/exam/[attemptId]/actions";
import { computeRemainingSeconds } from "@/lib/exam";

export default async function ExamPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      exam: {
        include: {
          sections: {
            orderBy: { order: "asc" },
            include: {
              questions: {
                orderBy: { order: "asc" },
                include: { choices: true },
              },
            },
          },
        },
      },
      answers: true,
      flags: true,
    },
  });

  if (!attempt || attempt.userId !== session.user.id) {
    notFound();
  }

  if (attempt.status === "SUBMITTED") {
    redirect(`/results/${attempt.id}`);
  }

  const answerByQuestion = new Map(attempt.answers.map((a) => [a.questionId, a]));
  const flaggedQuestions = new Set(attempt.flags.map((f) => f.questionId));

  const questions: QuestionVM[] = attempt.exam.sections.flatMap((section) =>
    section.questions.map((q) => {
      const answer = answerByQuestion.get(q.id);
      return {
        id: q.id,
        prompt: q.prompt,
        hint: q.hint,
        passage: section.passage,
        sectionTitle: section.title,
        type: q.type,
        choices: q.choices.map((c) => ({ id: c.id, label: c.label, text: c.text })),
        selectedChoiceId: answer?.choiceId ?? null,
        responseText: answer?.responseText ?? null,
        flagged: flaggedQuestions.has(q.id),
      };
    })
  );

  const remainingSec = computeRemainingSeconds(attempt.startedAt, attempt.timeLimitSec);

  if (remainingSec <= 0) {
    // Timer already ran out server-side (e.g. long-abandoned attempt) — grade with whatever was saved.
    await submitAttempt(attempt.id);
  }

  return (
    <ExamRunner
      attemptId={attempt.id}
      examTitle={attempt.exam.title}
      questions={questions}
      initialIndex={attempt.currentIndex}
      initialRemainingSec={remainingSec}
    />
  );
}
