type Point = { date: Date | null; scorePct: number };

const WIDTH = 1000;
const HEIGHT = 300;

export function PerformanceChart({ trend }: { trend: Point[] }) {
  if (trend.length < 2) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-on-surface-variant font-body-md text-center px-md">
        Complete a few more exams to see your performance trend over time.
      </div>
    );
  }

  const step = WIDTH / (trend.length - 1);
  const points = trend.map((p, i) => {
    const x = i * step;
    const y = HEIGHT - (p.scorePct / 100) * HEIGHT;
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const areaPath = `${linePath} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;
  const last = points[points.length - 1];

  return (
    <div className="relative h-[300px] w-full group">
      <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${WIDTH} ${HEIGHT}`}>
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(143, 78, 0, 0.2)" />
            <stop offset="100%" stopColor="rgba(143, 78, 0, 0)" />
          </linearGradient>
        </defs>
        <line stroke="#e7e8ec" strokeDasharray="4,4" strokeWidth={1} x1={0} x2={WIDTH} y1={50} y2={50} />
        <line stroke="#e7e8ec" strokeDasharray="4,4" strokeWidth={1} x1={0} x2={WIDTH} y1={150} y2={150} />
        <line stroke="#e7e8ec" strokeDasharray="4,4" strokeWidth={1} x1={0} x2={WIDTH} y1={250} y2={250} />
        <path d={areaPath} fill="url(#chartGradient)" />
        <path d={linePath} fill="none" stroke="#8f4e00" strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} />
        <circle cx={last.x} cy={last.y} fill="#8f4e00" r={6} />
        <circle cx={last.x} cy={last.y} fill="rgba(143, 78, 0, 0.2)" r={12} />
      </svg>
      <div className="absolute top-[30px] right-[10px] bg-primary text-on-primary px-3 py-1.5 rounded text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        Current: {trend[trend.length - 1].scorePct.toFixed(0)}%
      </div>
    </div>
  );
}
