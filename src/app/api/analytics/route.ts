import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import HabitLog from '@/models/HabitLog';
import Habit from '@/models/Habit';
import { subDays, format } from 'date-fns';

export async function GET() {
  try {
    await connectDB();

    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');
    const thirtyDaysAgoStr = format(subDays(today, 30), 'yyyy-MM-dd');

    const thirtyDaysLogs = await HabitLog.find({
      date: { $gte: thirtyDaysAgoStr, $lte: todayStr },
    }).lean() as any[];
    const activeHabitsCount = await Habit.countDocuments({ active: true });

    const dailyRates: Array<{ date: string; rate: number }> = Array.from({ length: 30 }).map((_, i) => {
      const date = subDays(today, 29 - i);
      const dateString = format(date, 'yyyy-MM-dd');
      const logsForDay = thirtyDaysLogs.filter((log: any) => log.date === dateString);
      const completedCount = logsForDay.filter((log: any) => log.completed).length;
      return {
        date: dateString,
        rate: activeHabitsCount > 0 ? Math.round((completedCount / activeHabitsCount) * 100) : 0,
      };
    });

    const weeklyRates: Array<{ week: string; rate: number }> = [];
    const monthlyRates: Array<{ month: string; rate: number }> = [];
    const categoryBreakdown: Array<{ name: string; value: number; color: string }> = [];
    const streaks = {};
    const heatmap = Array.from({ length: 365 }).map((_, i) => ({
      date: format(subDays(today, 364 - i), 'yyyy-MM-dd'),
      level: Math.floor(Math.random() * 5),
    }));

    return NextResponse.json({
      success: true,
      data: {
        dailyRates,
        weeklyRates,
        monthlyRates,
        categoryBreakdown,
        streaks,
        heatmap,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
