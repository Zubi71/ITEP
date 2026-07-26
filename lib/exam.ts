export function computeRemainingSeconds(startedAt: Date, timeLimitSec: number) {
  const elapsedSec = (Date.now() - startedAt.getTime()) / 1000;
  return Math.max(0, timeLimitSec - elapsedSec);
}
