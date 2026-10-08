import { IHabitLog } from '@/types';
import { toDateString, subDays, shouldTrackOnDate } from './date-utils';

/**
 * Calculate current streak for a habit
 * Goes backwards from today, counting consecutive completed days
 */
export function calculateCurrentStreak(
  logs: Pick<IHabitLog, 'date' | 'completed'>[],
  frequency: string = 'daily',
  customDays?: number[]
): number {
  const completedDates = new Set(
    logs.filter((l) => l.completed).map((l) => l.date)
  );

  let streak = 0;
  let currentDate = new Date();

  // Check if today is completed; if not, start from yesterday
  const todayStr = toDateString(currentDate);
  if (!completedDates.has(todayStr)) {
    // If today should be tracked and isn't completed, check yesterday
    if (shouldTrackOnDate(frequency, customDays, todayStr)) {
      currentDate = subDays(currentDate, 1);
    }
  }

  // Count consecutive days backwards
  for (let i = 0; i < 365; i++) {
    const dateStr = toDateString(currentDate);

    if (!shouldTrackOnDate(frequency, customDays, dateStr)) {
      // Skip non-tracking days
      currentDate = subDays(currentDate, 1);
      continue;
    }

    if (completedDates.has(dateStr)) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate longest streak for a habit
 */
export function calculateLongestStreak(
  logs: Pick<IHabitLog, 'date' | 'completed'>[],
  frequency: string = 'daily',
  customDays?: number[]
): number {
  if (logs.length === 0) return 0;

  const completedDates = new Set(
    logs.filter((l) => l.completed).map((l) => l.date)
  );

  // Sort dates
  const allDates = [...completedDates].sort();
  if (allDates.length === 0) return 0;

  let longest = 0;
  let current = 0;

  // Go through all dates from earliest to latest
  const firstDate = new Date(allDates[0]);
  const lastDate = new Date(allDates[allDates.length - 1]);
  const totalDays = Math.ceil(
    (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  let checkDate = new Date(firstDate);

  for (let i = 0; i <= totalDays; i++) {
    const dateStr = toDateString(checkDate);

    if (!shouldTrackOnDate(frequency, customDays, dateStr)) {
      checkDate = new Date(checkDate.getTime() + 86400000);
      continue;
    }

    if (completedDates.has(dateStr)) {
      current++;
      longest = Math.max(longest, current);
    } else {
      current = 0;
    }

    checkDate = new Date(checkDate.getTime() + 86400000);
  }

  return longest;
}

/**
 * Calculate completion rate for a habit over a date range
 */
export function calculateCompletionRate(
  logs: Pick<IHabitLog, 'date' | 'completed'>[],
  startDate: string,
  endDate: string,
  frequency: string = 'daily',
  customDays?: number[]
): number {
  let trackingDays = 0;
  let completedDays = 0;

  const completedDates = new Set(
    logs.filter((l) => l.completed).map((l) => l.date)
  );

  const start = new Date(startDate);
  const end = new Date(endDate);
  const today = new Date();

  let current = new Date(start);
  while (current <= end && current <= today) {
    const dateStr = toDateString(current);
    if (shouldTrackOnDate(frequency, customDays, dateStr)) {
      trackingDays++;
      if (completedDates.has(dateStr)) {
        completedDays++;
      }
    }
    current = new Date(current.getTime() + 86400000);
  }

  if (trackingDays === 0) return 0;
  return Math.round((completedDays / trackingDays) * 100);
}

/**
 * Calculate the overall streak across all habits for a day
 * (number of consecutive days where at least one habit was completed)
 */
export function calculateOverallStreak(
  allLogs: Pick<IHabitLog, 'date' | 'completed'>[]
): number {
  const datesWithCompletions = new Set(
    allLogs.filter((l) => l.completed).map((l) => l.date)
  );

  let streak = 0;
  let currentDate = new Date();

  const todayStr = toDateString(currentDate);
  if (!datesWithCompletions.has(todayStr)) {
    currentDate = subDays(currentDate, 1);
  }

  for (let i = 0; i < 365; i++) {
    const dateStr = toDateString(currentDate);
    if (datesWithCompletions.has(dateStr)) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }

  return streak;
}
