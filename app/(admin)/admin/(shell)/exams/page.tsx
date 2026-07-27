import { prisma } from "@/lib/prisma";
import { ExamStatusSelect } from "@/components/admin/ExamStatusSelect";

const STATUS_BADGE: Record<string, string> = {
  LIVE: "bg-success/10 text-success",
  DRAFT: "bg-warning/10 text-warning",
  ARCHIVED: "bg-surface-container-high text-on-surface-variant",
};

export default async function AdminExamsPage() {
  const exams = await prisma.exam.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: { select: { attempts: true } },
    },
  });

  const [liveCount, draftCount, totalAttempts, pendingGradings] = await Promise.all([
    prisma.exam.count({ where: { status: "LIVE" } }),
    prisma.exam.count({ where: { status: "DRAFT" } }),
    prisma.attempt.count(),
    prisma.attempt.count({ where: { status: "PENDING_REVIEW" } }),
  ]);

  const avgScores = await prisma.attempt.groupBy({
    by: ["examId"],
    where: { status: "SUBMITTED" },
    _avg: { scorePct: true },
  });
  const avgScoreByExam = new Map(avgScores.map((a) => [a.examId, a._avg.scorePct ?? null]));

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-7xl mx-auto w-full">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Exam Management</h1>
        <p className="text-body-md text-on-surface-variant">
          Manage exam visibility and review participation across all instances.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Live Exams</p>
          <p className="text-3xl font-bold text-primary mt-xs">{liveCount}</p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Draft Exams</p>
          <p className="text-3xl font-bold text-primary mt-xs">{draftCount}</p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Total Attempts</p>
          <p className="text-3xl font-bold text-primary mt-xs">{totalAttempts}</p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Pending Gradings</p>
          <p className="text-3xl font-bold text-primary mt-xs">{pendingGradings}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="p-md border-b border-outline-variant/30">
          <h3 className="font-headline-md text-headline-md font-bold text-primary">All Exam Instances</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Exam Title</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Status</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Participants</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Avg. Score</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {exams.map((exam) => {
                const avg = avgScoreByExam.get(exam.id);
                return (
                  <tr key={exam.id} className="hover:bg-surface-container-low/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-primary">{exam.title}</div>
                      <div className="text-body-sm text-on-surface-variant">{exam.difficulty}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block whitespace-nowrap px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${STATUS_BADGE[exam.status]}`}
                      >
                        {exam.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-body-sm">{exam._count.attempts}</td>
                    <td className="px-4 py-4 font-body-sm">{avg != null ? `${avg.toFixed(0)}%` : "—"}</td>
                    <td className="px-4 py-4">
                      <ExamStatusSelect examId={exam.id} status={exam.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
