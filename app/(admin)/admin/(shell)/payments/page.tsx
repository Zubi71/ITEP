import { prisma } from "@/lib/prisma";
import { RefundButton } from "@/components/admin/RefundButton";

function formatCents(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const STATUS_BADGE: Record<string, string> = {
  COMPLETED: "bg-success/10 text-success",
  PENDING: "bg-warning/10 text-warning",
  REFUNDED: "bg-error/10 text-error",
};

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const purchases = await prisma.purchase.findMany({
    where: status ? { status: status as "PENDING" | "COMPLETED" | "REFUNDED" } : undefined,
    include: { user: true, course: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const [completedAgg, refundedAgg] = await Promise.all([
    prisma.purchase.aggregate({ where: { status: "COMPLETED" }, _sum: { amountCents: true }, _count: true }),
    prisma.purchase.aggregate({ where: { status: "REFUNDED" }, _sum: { amountCents: true }, _count: true }),
  ]);

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-7xl mx-auto w-full">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Payments</h1>
        <p className="text-body-md text-on-surface-variant">
          All course purchase transactions. Enrollment is currently instant/mock — a real payment processor
          will be wired in later, so amounts here reflect course pricing, not an actual charge.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Completed Revenue</p>
          <p className="text-3xl font-bold text-primary mt-xs">{formatCents(completedAgg._sum.amountCents ?? 0)}</p>
          <p className="text-[11px] text-outline mt-1">{completedAgg._count} transactions</p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Refunded</p>
          <p className="text-3xl font-bold text-primary mt-xs">{formatCents(refundedAgg._sum.amountCents ?? 0)}</p>
          <p className="text-[11px] text-outline mt-1">{refundedAgg._count} transactions</p>
        </div>
        <div className="bg-white p-md rounded-xl border border-outline-variant/30 shadow-sm">
          <p className="text-body-sm text-on-surface-variant">Net Revenue</p>
          <p className="text-3xl font-bold text-primary mt-xs">
            {formatCents((completedAgg._sum.amountCents ?? 0) - (refundedAgg._sum.amountCents ?? 0))}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <form method="GET" className="p-md border-b border-outline-variant/30 flex flex-wrap items-center gap-sm">
          <select name="status" defaultValue={status ?? ""} className="px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md">
            <option value="">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="REFUNDED">Refunded</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-surface-container-high rounded-lg font-label-md text-label-md font-bold">
            Filter
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-surface-container-low">
              <tr>
                <th className="px-6 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Student</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Course</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Amount</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Status</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Date</th>
                <th className="px-4 py-3 font-label-sm text-label-sm text-on-surface-variant uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {purchases.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-primary">{p.user.name ?? p.user.email}</div>
                    <div className="text-body-sm text-on-surface-variant">{p.user.email}</div>
                  </td>
                  <td className="px-4 py-4 font-body-sm">{p.course.title}</td>
                  <td className="px-4 py-4 font-body-sm">{formatCents(p.amountCents)}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-block whitespace-nowrap px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${STATUS_BADGE[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-body-sm text-on-surface-variant">
                    {p.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-4 py-4">
                    {p.status === "COMPLETED" ? (
                      <RefundButton purchaseId={p.id} />
                    ) : (
                      <span className="text-outline font-label-sm text-label-sm">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {purchases.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-on-surface-variant">
                    No transactions match this filter.
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
