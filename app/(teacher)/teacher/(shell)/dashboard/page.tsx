import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function TeacherDashboardPage() {
  const session = await auth();

  const [pendingCount, questionCount, gradedByMeCount] = await Promise.all([
    prisma.attempt.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.question.count(),
    prisma.answer.count({ where: { gradedById: session?.user.id } }),
  ]);

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-7xl mx-auto w-full">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">
          Welcome, {session?.user.name ?? session?.user.email}
        </h1>
        <p className="text-on-surface-variant font-body-md">
          Grade submissions and manage exam questions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-white p-md rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-md text-label-md text-on-surface-variant">Pending Evaluations</p>
          <p className="font-display-lg text-display-lg text-primary">{pendingCount}</p>
        </div>
        <div className="bg-white p-md rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-md text-label-md text-on-surface-variant">Responses Graded by You</p>
          <p className="font-display-lg text-display-lg text-primary">{gradedByMeCount}</p>
        </div>
        <div className="bg-white p-md rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-md text-label-md text-on-surface-variant">Questions in Bank</p>
          <p className="font-display-lg text-display-lg text-primary">{questionCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <Link
          href="/teacher/evaluations"
          className="bg-white p-lg rounded-xl shadow-sm border border-outline-variant/30 flex items-center gap-md hover:shadow-md transition-all"
        >
          <span className="material-symbols-outlined text-3xl text-primary">rate_review</span>
          <div>
            <p className="font-headline-md text-headline-md font-bold text-primary">Evaluation Queue</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Grade Writing and Speaking submissions.
            </p>
          </div>
        </Link>
        <Link
          href="/teacher/question-bank"
          className="bg-white p-lg rounded-xl shadow-sm border border-outline-variant/30 flex items-center gap-md hover:shadow-md transition-all"
        >
          <span className="material-symbols-outlined text-3xl text-primary">database</span>
          <div>
            <p className="font-headline-md text-headline-md font-bold text-primary">Question Bank</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Create and edit exam questions.
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
