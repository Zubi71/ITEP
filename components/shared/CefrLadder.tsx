import { CEFR_BANDS, cefrBand } from "@/lib/cefr";

export function CefrLadder({ scorePct, compact }: { scorePct: number; compact?: boolean }) {
  const band = cefrBand(scorePct);

  return (
    <div>
      <div className="grid grid-cols-6 gap-1">
        {CEFR_BANDS.map((b) => {
          const reached = scorePct >= b.min;
          const isCurrent = b.code === band.code;
          return (
            <div
              key={b.code}
              className={`flex items-center justify-center rounded font-label-sm text-label-sm font-bold transition-colors ${
                compact ? "h-6" : "h-9"
              } ${
                isCurrent
                  ? "bg-secondary text-on-secondary ring-2 ring-secondary/40"
                  : reached
                    ? "bg-primary text-on-primary"
                    : "bg-surface-container text-on-surface-variant"
              }`}
            >
              {b.code}
            </div>
          );
        })}
      </div>
      {!compact && (
        <div className="flex items-center justify-between mt-xs">
          <span className="font-label-sm text-label-sm text-on-surface-variant">Reported band</span>
          <span className="font-label-sm text-label-sm font-bold text-primary">
            {band.code} — {band.name}
          </span>
        </div>
      )}
    </div>
  );
}
