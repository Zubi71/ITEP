import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ExamGrid } from "@/components/exam/ExamGrid";

export default async function ExamsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const [exams, inProgressAttempts, pastAttempts] = await Promise.all([
    prisma.exam.findMany({ where: { status: "LIVE" }, orderBy: { createdAt: "asc" } }),
    prisma.attempt.findMany({ where: { userId, status: "IN_PROGRESS" } }),
    prisma.attempt.findMany({
      where: { userId, status: "SUBMITTED" },
      include: { exam: true },
      orderBy: { submittedAt: "desc" },
      take: 10,
    }),
  ]);

  const inProgressByExam = new Map(inProgressAttempts.map((a) => [a.examId, a.id]));

  const examCards = exams.map((exam) => ({
    id: exam.id,
    title: exam.title,
    description: exam.description,
    category: exam.category,
    durationMin: exam.durationMin,
    difficulty: exam.difficulty,
    inProgressAttemptId: inProgressByExam.get(exam.id) ?? null,
  }));

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-7xl mx-auto w-full">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-md">
        <div>
          <nav className="flex items-center gap-xs text-on-surface-variant mb-xs">
            <Link href="/dashboard" className="font-label-sm text-label-sm hover:underline">
              Dashboard
            </Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="font-label-sm text-label-sm text-primary font-bold">Exam Center</span>
          </nav>
          <h2 className="font-headline-lg text-headline-lg text-primary">Available Mock Exams</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Select an assessment to begin your practice session.
          </p>
        </div>
      </header>

      <ExamGrid exams={examCards} />

      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
        <h3 className="font-headline-md text-headline-md text-primary mb-md">Score History</h3>
        {pastAttempts.length === 0 ? (
          <p className="text-on-surface-variant font-body-md">No completed exams yet.</p>
        ) : (
          <ul className="divide-y divide-outline-variant/30">
            {pastAttempts.map((a) => (
              <li key={a.id} className="py-3 flex items-center justify-between">
                <div>
                  <Link href={`/results/${a.id}`} className="font-body-md text-primary font-semibold hover:underline">
                    {a.exam.title}
                  </Link>
                  <p className="font-label-sm text-on-surface-variant">
                    {a.submittedAt?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                <span className="font-body-md font-bold text-primary">{(a.scorePct ?? 0).toFixed(0)}%</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
