import { levelLabel } from "@/lib/certificates";

const RADIUS = 110;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ScoreGauge({ scorePct }: { scorePct: number }) {
  const offset = CIRCUMFERENCE - (scorePct / 100) * CIRCUMFERENCE;

  return (
    <div className="bg-surface-container-lowest rounded-xl p-lg flex flex-col items-center justify-center shadow-sm">
      <h3 className="font-label-md text-label-md font-bold text-outline mb-lg uppercase tracking-widest">
        Overall Score
      </h3>
      <div className="relative flex items-center justify-center w-64 h-64">
        <svg className="w-full h-full -rotate-90">
          <circle
            className="text-surface-container"
            cx="128"
            cy="128"
            fill="transparent"
            r={RADIUS}
            stroke="currentColor"
            strokeWidth="14"
          />
          <circle
            className="text-secondary"
            cx="128"
            cy="128"
            fill="transparent"
            r={RADIUS}
            stroke="currentColor"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={offset}
            strokeLinecap="round"
            strokeWidth="14"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display-lg text-display-lg text-primary leading-none">
            {scorePct.toFixed(0)}%
          </span>
          <span className="font-label-md text-label-md text-on-surface-variant font-bold text-center px-md">
            {levelLabel(scorePct)}
          </span>
        </div>
      </div>
    </div>
  );
}
