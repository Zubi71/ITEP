import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GradeAnswerForm } from "@/components/admin/GradeAnswerForm";

export default async function TeacherGradeAttemptPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;

  const attempt = await prisma.attempt.findUnique({
    where: { id: attemptId },
    include: {
      exam: true,
      user: true,
      answers: {
        include: { question: { include: { choices: true } }, choice: true, gradedBy: true },
      },
    },
  });

  if (!attempt) {
    notFound();
  }

  const mcqAnswers = attempt.answers.filter((a) => a.question.type === "MULTIPLE_CHOICE");
  const subjectiveAnswers = attempt.answers.filter((a) => a.question.type !== "MULTIPLE_CHOICE");

  return (
    <div className="min-h-screen bg-surface">
      <header className="h-16 flex items-center px-margin-desktop border-b border-outline-variant bg-surface">
        <Link href="/teacher/evaluations" className="font-label-sm text-label-sm text-primary hover:underline">
          ← Back to Evaluation Queue
        </Link>
      </header>

      <div className="p-margin-desktop max-w-4xl mx-auto w-full flex flex-col gap-lg">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-primary font-bold">{attempt.exam.title}</h1>
          <p className="text-body-md text-on-surface-variant">
            Candidate: {attempt.user.name ?? attempt.user.email} • Submitted:{" "}
            {attempt.submittedAt?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>

        {attempt.status === "SUBMITTED" && (
          <div className="bg-success/10 text-success rounded-xl p-md font-label-md text-label-md font-bold">
            Grading complete — final score {(attempt.scorePct ?? 0).toFixed(0)}%.
          </div>
        )}
        {attempt.status === "PENDING_REVIEW" && (
          <div className="bg-warning/10 text-warning rounded-xl p-md font-label-md text-label-md font-bold">
            Awaiting {subjectiveAnswers.filter((a) => a.subjectiveScorePct == null).length} more grade(s) before this
            attempt can be finalized.
          </div>
        )}

        <section className="bg-surface-container-lowest rounded-xl p-lg shadow-sm">
          <h3 className="font-headline-md text-headline-md text-primary font-bold mb-md">
            Writing / Speaking Responses
          </h3>
          <div className="space-y-md">
            {subjectiveAnswers.map((a, i) => (
              <div key={a.id} className="border border-outline-variant rounded-lg p-md">
                <p className="font-body-md text-body-md font-semibold text-primary mb-sm">
                  {i + 1}. {a.question.prompt}
                </p>
                <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-line bg-surface-container-low rounded-lg p-md mb-md">
                  {a.responseText?.trim() ? a.responseText : "(no response submitted)"}
                </p>
                <GradeAnswerForm attemptId={attempt.id} answerId={a.id} initialScore={a.subjectiveScorePct} />
                {a.gradedBy && (
                  <p className="font-label-sm text-label-sm text-outline mt-sm">
                    Last graded by {a.gradedBy.name ?? a.gradedBy.email}
                    {a.gradedAt ? ` on ${a.gradedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}
                  </p>
                )}
              </div>
            ))}
            {subjectiveAnswers.length === 0 && (
              <p className="text-on-surface-variant font-body-md">No subjective questions on this exam.</p>
            )}
          </div>
        </section>

        {mcqAnswers.length > 0 && (
          <section className="bg-surface-container-lowest rounded-xl p-lg shadow-sm">
            <h3 className="font-headline-md text-headline-md text-primary font-bold mb-md">
              Multiple Choice (auto-graded)
            </h3>
            <div className="space-y-sm">
              {mcqAnswers.map((a, i) => (
                <div key={a.id} className="border border-outline-variant rounded-lg p-md flex items-center justify-between">
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {i + 1}. {a.question.prompt}
                  </p>
                  <span className={`font-label-sm text-label-sm font-bold ${a.isCorrect ? "text-success" : "text-error"}`}>
                    {a.isCorrect ? "Correct" : "Incorrect"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
