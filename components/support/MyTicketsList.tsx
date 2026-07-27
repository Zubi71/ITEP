type TicketVM = {
  id: string;
  subject: string;
  message: string;
  status: "OPEN" | "RESOLVED";
  createdAt: Date;
};

export function MyTicketsList({ tickets }: { tickets: TicketVM[] }) {
  if (tickets.length === 0) {
    return <p className="text-on-surface-variant font-body-md">You haven't contacted support yet.</p>;
  }

  return (
    <div className="space-y-sm">
      {tickets.map((t) => (
        <div key={t.id} className="border border-outline-variant rounded-lg p-md">
          <div className="flex items-center justify-between mb-xs">
            <p className="font-body-md text-body-md font-semibold text-primary">{t.subject}</p>
            <span
              className={`inline-block whitespace-nowrap flex-none px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${
                t.status === "RESOLVED" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
              }`}
            >
              {t.status}
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant whitespace-pre-line mb-xs">{t.message}</p>
          <p className="font-label-sm text-label-sm text-outline">
            {t.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </p>
        </div>
      ))}
    </div>
  );
}
