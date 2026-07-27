import { prisma } from "@/lib/prisma";
import { ResolveTicketButton } from "@/components/admin/ResolveTicketButton";

type Tab = "open" | "resolved";

export default async function AdminSupportPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab: rawTab } = await searchParams;
  const tab: Tab = rawTab === "resolved" ? "resolved" : "open";

  const [openCount, resolvedCount, tickets] = await Promise.all([
    prisma.supportTicket.count({ where: { status: "OPEN" } }),
    prisma.supportTicket.count({ where: { status: "RESOLVED" } }),
    prisma.supportTicket.findMany({
      where: { status: tab === "open" ? "OPEN" : "RESOLVED" },
      include: { user: true, resolvedBy: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-5xl mx-auto w-full">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Support Inbox</h1>
        <p className="text-body-md text-on-surface-variant">
          Messages submitted by students and teachers via the Support form.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant/30 shadow-sm overflow-hidden">
        <div className="flex border-b border-outline-variant/30">
          <a
            href="/admin/support?tab=open"
            className={`px-6 py-3 font-label-md text-label-md font-bold border-b-2 transition-colors ${
              tab === "open" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            Open ({openCount})
          </a>
          <a
            href="/admin/support?tab=resolved"
            className={`px-6 py-3 font-label-md text-label-md font-bold border-b-2 transition-colors ${
              tab === "resolved" ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-primary"
            }`}
          >
            Resolved ({resolvedCount})
          </a>
        </div>

        <div className="p-md space-y-sm">
          {tickets.map((t) => (
            <div key={t.id} className="border border-outline-variant rounded-lg p-md">
              <div className="flex items-start justify-between gap-md mb-xs">
                <div>
                  <p className="font-body-md text-body-md font-semibold text-primary">{t.subject}</p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">
                    {t.user.name ?? t.user.email} • {t.user.email} •{" "}
                    {t.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>
                {t.status === "OPEN" && <ResolveTicketButton ticketId={t.id} />}
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant whitespace-pre-line">{t.message}</p>
              {t.status === "RESOLVED" && t.resolvedBy && (
                <p className="font-label-sm text-label-sm text-outline mt-sm">
                  Resolved by {t.resolvedBy.name ?? t.resolvedBy.email}
                  {t.resolvedAt ? ` on ${t.resolvedAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}` : ""}
                </p>
              )}
            </div>
          ))}
          {tickets.length === 0 && (
            <p className="text-on-surface-variant font-body-md text-center py-8">Nothing here.</p>
          )}
        </div>
      </div>
    </div>
  );
}
