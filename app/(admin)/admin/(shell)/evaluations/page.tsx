import Link from "next/link";
import { prisma } from "@/lib/prisma";

type Tab = "pending" | "in_progress" | "completed";

const TAB_LABEL: Record<Tab, string> = {
  pending: "Pending",
  in_progress: "In Progress",
  completed: "Completed",
};

export default async function EvaluationsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab: Tab = rawTab === "in_progress" || rawTab === "completed" ? rawTab : "pending";

  const attempts = await prisma.attempt.findMany({
    where: {
      OR: [
        { status: "PENDING_REVIEW" },
        {
          status: "SUBMITTED",
          answers: {
            some: { question: { type: { not: "MULTIPLE_CHOICE" } }, subjectiveScorePct: { not: null } },
          },
        },
      ],
    },
    include: {
      exam: true,
      user: true,
      answers: { include: { question: true } },
    },
    orderBy: { submittedAt: "desc" },
  });

  const rows = attempts.map((a) => {
    const subjectiveAnswers = a.answers.filter((ans) => ans.question.type !== "MULTIPLE_CHOICE");
    const gradedCount = subjectiveAnswers.filter((ans) => ans.subjectiveScorePct != null).length;
    const totalCount = subjectiveAnswers.length;

    let rowTab: Tab;
    if (a.status === "SUBMITTED") rowTab = "completed";
    else if (gradedCount === 0) rowTab = "pending";
    else rowTab = "in_progress";

    return { attempt: a, gradedCount, totalCount, tab: rowTab };
  });

  const counts = {
    pending: rows.filter((r) => r.tab === "pending").length,
    in_progress: rows.filter((r) => r.tab === "in_progress").length,
    completed: rows.filter((r) => r.tab === "completed").length,
  };

  const turnaroundSamples = rows
    .filter((r) => r.tab === "completed" && r.attempt.gradedAt && r.attempt.submittedAt)
    .map((r) => (r.attempt.gradedAt!.getTime() - r.attempt.submittedAt!.getTime()) / (1000 * 60 * 60));
  const avgTurnaroundHours =
    turnaroundSamples.length > 0 ? turnaroundSamples.reduce((s, v) => s + v, 0) / turnaroundSamples.length : null;

  const visibleRows = rows.filter((r) => r.tab === tab);

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-7xl mx-auto w-full">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Evaluation Queue</h1>
        <p className="text-body-md text-on-surface-variant">
          Grade Writing and Speaking submissions awaiting human review.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Pending</p>
          <p className="text-3xl font-bold text-primary mt-xs">{counts.pending}</p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">In Progress</p>
          <p className="text-3xl font-bold text-primary mt-xs">{counts.in_progress}</p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Avg. Turnaround</p>
          <p className="text-3xl font-bold text-primary mt-xs">
            {avgTurnaroundHours != null ? `${avgTurnaroundHours.toFixed(1)}h` : "—"}
          </p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Grading Capacity</p>
          <p className="text-3xl font-bold text-primary mt-xs">Nominal</p>
          <p className="text-[11px] text-outline mt-1">Static placeholder — no grader load balancing yet.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="flex border-b border-outline-variant/30">
          {(Object.keys(TAB_LABEL) as Tab[]).map((t) => (
            <Link
              key={t}
              href={`/admin/evaluations?tab=${t}`}
              className={`px-6 py-3 font-label-md text-label-md font-bold border-b-2 transition-colors ${
                tab === t
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-primary"
              }`}
            >
              {TAB_LABEL[t]} ({counts[t]})
            </Link>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Student</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Exam</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Submitted</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Progress</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {visibleRows.map(({ attempt, gradedCount, totalCount }) => (
                <tr key={attempt.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary">{attempt.user.name ?? attempt.user.email}</div>
                    <div className="text-body-sm text-on-surface-variant">{attempt.user.email}</div>
                  </td>
                  <td className="px-4 py-4 font-body-sm">{attempt.exam.title}</td>
                  <td className="px-4 py-4 font-body-sm text-on-surface-variant">
                    {attempt.submittedAt?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-4 font-body-sm">
                    {gradedCount} / {totalCount} graded
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/evaluations/${attempt.id}`}
                      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-bold hover:opacity-90 transition-all"
                    >
                      View &amp; Grade
                    </Link>
                  </td>
                </tr>
              ))}
              {visibleRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                    Nothing in this tab.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
