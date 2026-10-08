import DailyTimeWindow from '@/models/DailyTimeWindow';
import DailyStats from '@/models/DailyStats';
import { subDays, format } from 'date-fns';
import { parseISO } from 'date-fns';

export async function calculateDailyProductiveHours(dateStr: string): Promise<number> {
  const windows = await DailyTimeWindow.find({ date: dateStr }).lean();
  return windows.reduce((sum: number, w: any) => sum + (w.productiveHours || 0), 0);
}

export async function calculate10HourStreak(todayStr: string): Promise<number> {
  let streak = 0;
  let currentDate = new Date(todayStr);

  while (true) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const hours = await calculateDailyProductiveHours(dateStr);
    
    if (hours >= 10) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }
  return streak;
}

export async function calculateOnePercentBetterStreak(todayStr: string): Promise<number> {
  let streak = 0;
  let currentDate = new Date(todayStr);

  while (true) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const yesterdayDate = subDays(currentDate, 1);
    const yesterdayStr = format(yesterdayDate, 'yyyy-MM-dd');

    const todayHours = await calculateDailyProductiveHours(dateStr);
    const yesterdayHours = await calculateDailyProductiveHours(yesterdayStr);

    if (todayHours >= 10 && todayHours >= yesterdayHours * 1.01) {
      streak++;
      currentDate = yesterdayDate;
    } else {
      break;
    }
  }
  return streak;
}

export async function calculateLongSessionStreak(todayStr: string): Promise<number> {
  let streak = 0;
  let currentDate = new Date(todayStr);

  while (true) {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const stats = await DailyStats.findOne({ date: dateStr }).lean();
    
    // Check if longestSession is > 4 hours (240 minutes)
    if (stats && stats.longestSessionMinutes > 240) {
      streak++;
      currentDate = subDays(currentDate, 1);
    } else {
      break;
    }
  }
  return streak;
}
