import type { WorkoutSession } from '../types';

export interface WeeklyStats {
  workoutCount: number;
  totalVolume: number;
  streak: number;
}

/** Returns a locale-independent string key for the calendar day of a Date (local time). */
function dayKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

/**
 * Returns workout stats for the current Mon–Sun calendar week plus the
 * current training streak.
 *
 * Streak rules:
 *  - Counts consecutive days that each had at least one workout.
 *  - Streak is still "alive" if the most recent workout day was yesterday
 *    (the user hasn't trained today yet).
 *  - If neither today nor yesterday had a workout the streak is 0.
 */
export function getWeeklyStats(sessions: WorkoutSession[]): WeeklyStats {
  const now = new Date();
  // Midnight local time = start of today
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Monday of the current week
  const dow = today.getDay(); // 0 = Sun, 1 = Mon … 6 = Sat
  const daysFromMonday = dow === 0 ? 6 : dow - 1;
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - daysFromMonday);

  // Exclusive upper bound — next Monday 00:00
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 7);

  // Set of unique day-keys that had at least one workout
  const sessionDayKeys = new Set(
    sessions.map((s) => dayKey(new Date(s.startedAt))),
  );

  // This-week sessions
  const thisWeek = sessions.filter((s) => {
    const d = new Date(s.startedAt);
    return d >= weekStart && d < weekEnd;
  });

  // Streak — walk backwards from today (or yesterday) while each day has workouts
  const todayKey = dayKey(today);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayKey = dayKey(yesterday);

  let streak = 0;

  if (sessionDayKeys.has(todayKey) || sessionDayKeys.has(yesterdayKey)) {
    const streakStart = sessionDayKeys.has(todayKey) ? new Date(today) : new Date(yesterday);
    const cursor = new Date(streakStart);

    while (sessionDayKeys.has(dayKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  return {
    workoutCount: thisWeek.length,
    totalVolume: thisWeek.reduce((sum, s) => sum + s.totalVolume, 0),
    streak,
  };
}

/**
 * Returns the most recently started WorkoutSession, or null if there are none.
 * Does not assume the array is sorted.
 */
export function getLastWorkout(sessions: WorkoutSession[]): WorkoutSession | null {
  if (sessions.length === 0) return null;
  return sessions.reduce((latest, s) =>
    new Date(s.startedAt) > new Date(latest.startedAt) ? s : latest,
  );
}
