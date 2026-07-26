import Link from "next/link";
import { auth } from "@/lib/auth";
import { getDashboardStats } from "@/lib/stats";
import { StatCard } from "@/components/dashboard/StatCard";
import { PerformanceChart } from "@/components/dashboard/PerformanceChart";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;
  const stats = await getDashboardStats(userId);
  const firstName = (session!.user.name ?? "there").split(" ")[0];

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-7xl mx-auto w-full">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row justify-between items-end md:items-center gap-md">
        <div className="flex flex-col gap-xs">
          <h1 className="font-headline-lg text-headline-lg font-bold text-primary">
            Welcome back, {firstName}!
          </h1>
          <p className="font-body-md text-on-surface-variant">
            {stats.examsCompleted > 0
              ? `You've completed ${stats.examsCompleted} mock exam${stats.examsCompleted === 1 ? "" : "s"} with an average score of ${stats.avgScore.toFixed(0)}%.`
              : "Take your first mock exam to start tracking your progress."}
          </p>
        </div>
      </section>

      {/* Analytics Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <StatCard icon="analytics" label="Average Score" value={`${stats.avgScore.toFixed(0)}%`} />
        <StatCard icon="assignment_turned_in" label="Exams Completed" value={String(stats.examsCompleted)} />
        <StatCard icon="schedule" label="Hours Studied" value={stats.hoursStudied.toFixed(1)} />
      </section>

      {/* Performance Chart */}
      <section className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between mb-lg">
          <h3 className="font-headline-md text-headline-md font-bold text-primary">Performance Trends</h3>
        </div>
        <PerformanceChart trend={stats.trend} />
      </section>

      {/* Recent Exams */}
      <section className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant/30">
        <div className="flex items-center justify-between mb-md">
          <h3 className="font-headline-md text-headline-md font-bold text-primary">Recent Mock Exams</h3>
          <Link href="/exams" className="text-primary font-label-md font-bold hover:underline">
            View All
          </Link>
        </div>
        {stats.recent.length === 0 ? (
          <p className="text-on-surface-variant font-body-md py-md">No exams completed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-outline-variant">
                  <th className="pb-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Exam Name</th>
                  <th className="pb-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Date</th>
                  <th className="pb-4 font-label-sm text-on-surface-variant uppercase tracking-wider">Status</th>
                  <th className="pb-4 font-label-sm text-on-surface-variant uppercase tracking-wider text-right">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                {stats.recent.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-4 font-body-md text-primary font-semibold">
                      <Link href={`/results/${r.id}`} className="hover:underline">
                        {r.examTitle}
                      </Link>
                    </td>
                    <td className="py-4 font-body-md text-on-surface-variant">
                      {r.date?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          r.passed ? "bg-success/10 text-success" : "bg-error/10 text-error"
                        }`}
                      >
                        {r.passed ? "Passed" : "Failed"}
                      </span>
                    </td>
                    <td className="py-4 text-right font-body-md font-bold text-primary">
                      {r.scorePct.toFixed(0)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
