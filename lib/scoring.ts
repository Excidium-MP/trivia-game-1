import { TIME_LIMIT_SECONDS } from "./questions";

const MAX_POINTS = 1000;
const MIN_CORRECT_POINTS = 500;

/**
 * Kahoot-style scoring: a correct answer earns points scaled by speed.
 * Instant correct ≈ 1000, a slow-but-in-time correct ≈ 500, wrong or late = 0.
 */
export function scoreAnswer(correct: boolean, elapsedMs: number): number {
  if (!correct) return 0;
  const limitMs = TIME_LIMIT_SECONDS * 1000;
  if (elapsedMs >= limitMs) return 0; // answered after time ran out
  const fractionUsed = Math.max(0, elapsedMs) / limitMs;
  const points = MIN_CORRECT_POINTS + (MAX_POINTS - MIN_CORRECT_POINTS) * (1 - fractionUsed);
  return Math.round(points);
}
