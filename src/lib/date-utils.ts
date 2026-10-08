import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  subDays,
  differenceInDays,
  isToday,
  isFuture,
  isPast,
  isSameDay,
  getDaysInMonth,
  getDay,
  parseISO,
} from 'date-fns';

// Format date to YYYY-MM-DD for consistent storage
export function toDateString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return format(d, 'yyyy-MM-dd');
}

// Parse YYYY-MM-DD string to Date
export function fromDateString(dateStr: string): Date {
  return parseISO(dateStr);
}

// Get today's date string
export function getTodayString(): string {
  return toDateString(new Date());
}

// Format for display
export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMMM d, yyyy');
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMM d');
}

export function formatDayOfWeek(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'EEEE');
}

export function formatMonthYear(date: Date | string): string {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'MMMM yyyy');
}

// Get all dates in a month
export function getMonthDates(year: number, month: number): string[] {
  const daysInMonth = getDaysInMonth(new Date(year, month));
  const dates: string[] = [];
  for (let day = 1; day <= daysInMonth; day++) {
    dates.push(toDateString(new Date(year, month, day)));
  }
  return dates;
}

// Get all dates in a week (Mon-Sun)
export function getWeekDates(date: Date = new Date()): string[] {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(toDateString(addDays(start, i)));
  }
  return dates;
}

// Date range helpers
export function getStartOfDay(date: Date | string): Date {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return startOfDay(d);
}

export function getEndOfDay(date: Date | string): Date {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return endOfDay(d);
}

export function getStartOfWeek(date: Date = new Date()): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function getEndOfWeek(date: Date = new Date()): Date {
  return endOfWeek(date, { weekStartsOn: 1 });
}

export function getStartOfMonth(date: Date = new Date()): Date {
  return startOfMonth(date);
}

export function getEndOfMonth(date: Date = new Date()): Date {
  return endOfMonth(date);
}

// Check helpers
export { isToday, isFuture, isPast, isSameDay, getDaysInMonth, getDay, differenceInDays, addDays, subDays };

// Get date N days ago
export function daysAgo(n: number): string {
  return toDateString(subDays(new Date(), n));
}

// Check if a habit should be tracked on a given date based on frequency
export function shouldTrackOnDate(
  frequency: string,
  customDays: number[] | undefined,
  dateStr: string
): boolean {
  const date = fromDateString(dateStr);
  const dayOfWeek = getDay(date); // 0=Sun, 1=Mon, ... 6=Sat

  switch (frequency) {
    case 'daily':
      return true;
    case 'weekdays':
      return dayOfWeek >= 1 && dayOfWeek <= 5;
    case 'weekends':
      return dayOfWeek === 0 || dayOfWeek === 6;
    case 'custom':
      return customDays ? customDays.includes(dayOfWeek) : true;
    case 'weekly':
      return dayOfWeek === 1; // Monday
    default:
      return true;
  }
}

// Get the number of days between two dates
export function daysBetween(start: string, end: string): number {
  return differenceInDays(fromDateString(end), fromDateString(start));
}
