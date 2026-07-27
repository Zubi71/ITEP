import Link from "next/link";
import { prisma } from "@/lib/prisma";

function formatCents(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export default async function AdminDashboardPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [totalStudents, mtdRevenue, completedPurchases, pendingAttempts] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.purchase.aggregate({
      where: { status: "COMPLETED", completedAt: { gte: startOfMonth } },
      _sum: { amountCents: true },
    }),
    prisma.purchase.findMany({ where: { status: "COMPLETED" }, include: { course: true } }),
    prisma.attempt.findMany({
      where: { status: "PENDING_REVIEW" },
      include: { exam: true, user: true },
      orderBy: { submittedAt: "asc" },
      take: 8,
    }),
  ]);

  // Revenue trend — real data, last 6 calendar months.
  const monthBuckets = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const totalCents = completedPurchases
      .filter((p) => p.completedAt && p.completedAt.getFullYear() === d.getFullYear() && p.completedAt.getMonth() === d.getMonth())
      .reduce((sum, p) => sum + p.amountCents, 0);
    return { label: d.toLocaleDateString("en-US", { month: "short" }), totalCents };
  });
  const maxMonthCents = Math.max(...monthBuckets.map((b) => b.totalCents), 1);

  // Enrollment distribution by course category — real data.
  const byCategory = new Map<string, number>();
  for (const p of completedPurchases) {
    const key = p.course.category ?? "Uncategorized";
    byCategory.set(key, (byCategory.get(key) ?? 0) + 1);
  }
  const distribution = Array.from(byCategory.entries()).sort((a, b) => b[1] - a[1]);
  const maxCategoryCount = Math.max(...distribution.map(([, count]) => count), 1);

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-7xl mx-auto w-full">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Center Dashboard</h1>
        <p className="text-on-surface-variant font-body-md">
          Overview of your academic ecosystem&apos;s performance and status.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
        <div className="bg-white p-md rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-md text-label-md text-on-surface-variant">Total Students</p>
          <p className="font-display-lg text-display-lg text-primary">{totalStudents}</p>
        </div>
        <div className="bg-white p-md rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-md text-label-md text-on-surface-variant">Revenue MTD</p>
          <p className="font-display-lg text-display-lg text-primary">{formatCents(mtdRevenue._sum.amountCents ?? 0)}</p>
        </div>
        <div className="bg-white p-md rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-md text-label-md text-on-surface-variant">Total Enrollments</p>
          <p className="font-display-lg text-display-lg text-primary">{completedPurchases.length}</p>
        </div>
        <div className="bg-white p-md rounded-xl shadow-sm border border-outline-variant/30">
          <p className="font-label-md text-label-md text-on-surface-variant">Pending Evaluations</p>
          <p className="font-display-lg text-display-lg text-primary">{pendingAttempts.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        <div className="col-span-12 lg:col-span-7 bg-white rounded-xl border border-outline-variant/30 shadow-sm p-lg">
          <h3 className="font-headline-md text-headline-md text-primary font-bold mb-lg">Revenue Trend (6mo)</h3>
          <div className="h-48 flex items-end gap-md">
            {monthBuckets.map((b) => (
              <div key={b.label} className="flex-1 flex flex-col items-center gap-xs">
                <div className="w-full bg-surface-container-high rounded-t-md relative h-40 flex items-end">
                  <div
                    className="w-full bg-primary rounded-t-md transition-all"
                    style={{ height: `${(b.totalCents / maxMonthCents) * 100}%` }}
                  />
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 bg-white rounded-xl border border-outline-variant/30 shadow-sm p-lg">
          <h3 className="font-headline-md text-headline-md text-primary font-bold mb-lg">Enrollment Distribution</h3>
          {distribution.length === 0 ? (
            <p className="text-on-surface-variant font-body-md">No enrollments yet.</p>
          ) : (
            <div className="space-y-md">
              {distribution.map(([category, count]) => (
                <div key={category}>
                  <div className="flex justify-between mb-1">
                    <span className="font-label-md text-label-md text-on-surface-variant">{category}</span>
                    <span className="font-label-md text-label-md font-bold text-primary">{count}</span>
                  </div>
                  <div className="h-2 w-full bg-surface-container rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary rounded-full"
                      style={{ width: `${(count / maxCategoryCount) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="p-md border-b border-outline-variant/30 flex items-center justify-between">
          <h3 className="font-headline-md text-headline-md font-bold text-primary">Pending Evaluations</h3>
          <Link href="/admin/evaluations" className="font-label-sm text-label-sm text-primary hover:underline">
            View full queue →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Student</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Exam</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Submitted</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {pendingAttempts.map((a) => (
                <tr key={a.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4 font-body-sm">{a.user.name ?? a.user.email}</td>
                  <td className="px-4 py-4 font-body-sm">{a.exam.title}</td>
                  <td className="px-4 py-4 font-body-sm text-on-surface-variant">
                    {a.submittedAt?.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/evaluations/${a.id}`}
                      className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-label-sm text-label-sm font-bold hover:opacity-90 transition-all"
                    >
                      Grade
                    </Link>
                  </td>
                </tr>
              ))}
              {pendingAttempts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-on-surface-variant">
                    Nothing pending review.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Platform Health is a static placeholder — nothing in a Next.js app can
          introspect real uptime/session/DB-load metrics without an external
          monitoring integration, which is out of scope this milestone. */}
      <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm p-lg">
        <h3 className="font-headline-md text-headline-md font-bold text-primary mb-md">Platform Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Uptime</p>
            <p className="font-headline-md text-headline-md font-bold text-success">99.98%</p>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">Active Sessions</p>
            <p className="font-headline-md text-headline-md font-bold text-primary">—</p>
          </div>
          <div>
            <p className="font-label-md text-label-md text-on-surface-variant">DB Load</p>
            <p className="font-headline-md text-headline-md font-bold text-primary">Nominal</p>
          </div>
        </div>
        <p className="text-[11px] text-outline mt-md">Static placeholder — not wired to real monitoring.</p>
      </div>
    </div>
  );
}
