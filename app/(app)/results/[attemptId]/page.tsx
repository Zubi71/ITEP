import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getSkillBreakdown } from "@/lib/stats";
import { getPassThreshold } from "@/lib/settings";
import { ScoreGauge } from "@/components/results/ScoreGauge";

const SKILL_ICON: Record<string, string> = {
  GRAMMAR: "edit_note",
  LISTENING: "hearing",
  READING: "menu_book",
  WRITING: "draw",
  SPEAKING: "mic",
};

export default async function ResultsPage({
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
      exam: true,
      user: true,
      answers: {
        include: {
          question: { include: { choices: true } },
          choice: true,
        },
      },
    },
  });

  if (!attempt || attempt.userId !== session.user.id) {
    notFound();
  }

  if (attempt.status === "IN_PROGRESS") {
    redirect(`/exam/${attempt.id}`);
  }

  if (attempt.status === "PENDING_REVIEW") {
    return (
      <div className="p-margin-desktop flex flex-col items-center justify-center gap-lg max-w-2xl mx-auto w-full min-h-[60vh] text-center">
        <span className="material-symbols-outlined text-6xl text-secondary">hourglass_top</span>
        <h1 className="font-display-lg text-display-lg text-primary tracking-tight">Under Review</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Your Writing/Speaking responses for {attempt.exam.title} are being graded by an instructor. Your
          final score and certificate (if you pass) will appear here once grading is complete.
        </p>
        <Link
          href="/exams"
          className="px-8 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all"
        >
          Back to Exams
        </Link>
      </div>
    );
  }

  const scorePct = attempt.scorePct ?? 0;
  const passThreshold = await getPassThreshold();
  const passed = scorePct >= passThreshold;
  const breakdown = await getSkillBreakdown(attempt.id);
  const certificate = passed
    ? await prisma.certificate.findUnique({ where: { attemptId: attempt.id } })
    : null;

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-7xl mx-auto w-full">
      <header className="flex flex-col md:flex-row justify-between items-end mb-lg gap-md">
        <div>
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-outline mb-xs block">
            Attempt #{attempt.id.slice(0, 8).toUpperCase()}
          </span>
          <h1 className="font-display-lg text-display-lg text-primary tracking-tight">
            Exam Performance Report
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-sm">
            Candidate: {attempt.user.name ?? attempt.user.email} • Date:{" "}
            {attempt.submittedAt?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} •{" "}
            {attempt.exam.title}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full font-label-md text-label-md font-bold uppercase ${
            passed ? "bg-success/10 text-success" : "bg-error/10 text-error"
          }`}
        >
          {passed ? "Passed" : "Not Passed"}
        </span>
      </header>

      {certificate && (
        <section className="bg-primary text-on-primary rounded-xl p-md flex flex-col md:flex-row items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-secondary-container text-3xl">
              workspace_premium
            </span>
            <div>
              <p className="font-label-md text-label-md font-bold">Certificate Earned</p>
              <p className="font-body-sm text-on-primary/70">Code: {certificate.code}</p>
            </div>
          </div>
          <Link
            href={`/verify/${certificate.code}`}
            className="px-6 py-2.5 bg-white text-primary rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all"
          >
            View Public Certificate
          </Link>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="col-span-12 lg:col-span-4">
          <ScoreGauge scorePct={scorePct} />
        </div>

        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-lg shadow-sm">
          <h3 className="font-headline-md text-headline-md text-primary font-bold mb-lg">
            Skill Breakdown
          </h3>
          {breakdown.length === 0 ? (
            <p className="text-on-surface-variant font-body-md">No graded questions for this attempt.</p>
          ) : (
            <div className="space-y-md">
              {breakdown.map((b) => (
                <div key={b.skill} className="flex items-center gap-md">
                  <span className="material-symbols-outlined text-secondary">
                    {SKILL_ICON[b.skill] ?? "school"}
                  </span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                        {b.skill.charAt(0) + b.skill.slice(1).toLowerCase()}
                      </span>
                      <span className="font-label-md text-label-md font-bold text-primary">
                        {b.scorePct.toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-secondary rounded-full"
                        style={{ width: `${b.scorePct}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-12 bg-surface-container-lowest rounded-xl p-lg shadow-sm">
          <h3 className="font-headline-md text-headline-md text-primary font-bold mb-md">
            Answer Review
          </h3>
          <div className="space-y-md">
            {attempt.answers.map((a, i) => (
              <div key={a.id} className="border border-outline-variant rounded-lg p-md">
                <p className="font-body-md text-body-md font-semibold text-primary mb-sm">
                  {i + 1}. {a.question.prompt}
                </p>
                {a.question.type === "MULTIPLE_CHOICE" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm font-body-sm text-body-sm">
                    <p className={a.isCorrect ? "text-success" : "text-error"}>
                      Your answer: {a.choice ? `${a.choice.label}. ${a.choice.text}` : "Not answered"}
                    </p>
                    {!a.isCorrect && (
                      <p className="text-success">
                        Correct answer:{" "}
                        {(() => {
                          const correct = a.question.choices.find((c) => c.isCorrect);
                          return correct ? `${correct.label}. ${correct.text}` : "—";
                        })()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-sm font-body-sm text-body-sm">
                    <p className="text-on-surface-variant whitespace-pre-line">
                      {a.responseText?.trim() ? a.responseText : "Not answered"}
                    </p>
                    <p
                      className={
                        a.subjectiveScorePct != null && a.subjectiveScorePct >= passThreshold
                          ? "text-success font-bold"
                          : a.subjectiveScorePct != null
                            ? "text-error font-bold"
                            : "text-outline italic"
                      }
                    >
                      Grader score:{" "}
                      {a.subjectiveScorePct != null ? `${a.subjectiveScorePct.toFixed(0)}%` : "Awaiting review"}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link
          href="/exams"
          className="px-8 py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all"
        >
          Take Another Exam
        </Link>
      </div>
    </div>
  );
}
