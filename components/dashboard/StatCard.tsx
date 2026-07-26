export function StatCard({
  icon,
  label,
  value,
  caption,
}: {
  icon: string;
  label: string;
  value: string;
  caption?: string;
}) {
  return (
    <div className="bg-surface-container-lowest p-xl rounded-xl shadow-sm border border-outline-variant/30 flex flex-col gap-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <span
          className="material-symbols-outlined text-secondary"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        {caption && <span className="text-on-surface-variant font-label-md text-sm">{caption}</span>}
      </div>
      <p className="font-label-md text-on-surface-variant uppercase tracking-wider">{label}</p>
      <p className="font-display-lg text-display-lg font-bold text-primary">{value}</p>
    </div>
  );
}
