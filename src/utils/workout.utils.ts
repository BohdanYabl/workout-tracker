import { WorkoutSet, PersonalRecord } from '../types';

/**
 * Sums weight × reps for every completed set.
 */
export function calculateVolume(sets: WorkoutSet[]): number {
  return sets
    .filter((s) => s.isCompleted)
    .reduce((total, s) => total + s.weight * s.reps, 0);
}

/**
 * Formats a duration in seconds to a human-readable string.
 * e.g. 2730 → "45m 30s", 45 → "45s", 3600 → "1h 0m"
 */
export function formatDuration(seconds: number): string {
  if (seconds < 0) return '0s';

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return s > 0 ? `${m}m ${s}s` : `${m}m`;
  return `${s}s`;
}

/**
 * Returns true if the given weight/reps combination sets a new personal
 * record for the exercise, using the Epley estimated-1RM formula so that
 * both weight and rep count are taken into account.
 *
 * Epley 1RM = weight × (1 + reps / 30)
 */
export function isPersonalRecord(
  weight: number,
  reps: number,
  history: PersonalRecord[],
  exerciseId: string,
): boolean {
  if (weight <= 0 || reps <= 0) return false;

  const estimated1RM = weight * (1 + reps / 30);

  const best = history
    .filter((r) => r.exerciseId === exerciseId)
    .reduce<number>((max, r) => {
      const e1rm = r.weight * (1 + r.reps / 30);
      return e1rm > max ? e1rm : max;
    }, 0);

  return estimated1RM > best;
}

/**
 * Formats an ISO date string as a relative label.
 * e.g. today → "Today", yesterday → "Yesterday", recent → "3 days ago",
 * older → "12 Jan" or "12 Jan 2024".
 */
export function formatRelativeDate(date: string): string {
  const now = new Date();
  const target = new Date(date);

  // Zero out times to compare calendar days.
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetStart = new Date(
    target.getFullYear(),
    target.getMonth(),
    target.getDate(),
  );

  const diffMs = todayStart.getTime() - targetStart.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 6) return `${diffDays} days ago`;

  const day = target.getDate();
  const month = target.toLocaleString('en', { month: 'short' });
  const year = target.getFullYear();

  return year === now.getFullYear() ? `${day} ${month}` : `${day} ${month} ${year}`;
}
