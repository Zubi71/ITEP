export const CEFR_BANDS = [
  { code: "A1", name: "Beginner", min: 0 },
  { code: "A2", name: "Elementary", min: 40 },
  { code: "B1", name: "Intermediate", min: 55 },
  { code: "B2", name: "Upper-Intermediate", min: 70 },
  { code: "C1", name: "Advanced", min: 90 },
  { code: "C2", name: "Proficient", min: 96 },
] as const;

export function cefrBand(scorePct: number) {
  return [...CEFR_BANDS].reverse().find((b) => scorePct >= b.min) ?? CEFR_BANDS[0];
}
