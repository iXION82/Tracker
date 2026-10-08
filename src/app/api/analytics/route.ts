import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import HabitLog from '@/models/HabitLog';
import Habit from '@/models/Habit';
import { subDays, subWeeks, subMonths, startOfDay, endOfDay, format } from 'date-fns';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    const today = new Date();
    
    // Example logic for daily completion rates for last 30 days
    const thirtyDaysAgo = subDays(today, 30);
    const thirtyDaysLogs = await HabitLog.find({
      date: { $gte: startOfDay(thirtyDaysAgo), $lte: endOfDay(today) }
    });
    const activeHabitsCount = await Habit.countDocuments({ isActive: true });
    
    const dailyRates = Array.from({ length: 30 }).map((_, i) => {
      const date = subDays(today, 29 - i);
      const dateString = format(date, 'yyyy-MM-dd');
      const logsForDay = thirtyDaysLogs.filter(log => format(new Date(log.date), 'yyyy-MM-dd') === dateString);
      const completedCount = logsForDay.filter(log => log.completed).length;
      return {
        date: dateString,
        rate: activeHabitsCount > 0 ? (completedCount / activeHabitsCount) * 100 : 0
      };
    });

    // Mocking weekly, monthly, category breakdown, streaks, and heatmap data for now
    // In a full implementation, these would use more complex MongoDB aggregation pipelines
    const weeklyRates = [];
    const monthlyRates = [];
    const categoryBreakdown = [];
    const streaks = {};
    const heatmap = Array.from({ length: 365 }).map((_, i) => ({
      date: format(subDays(today, 364 - i), 'yyyy-MM-dd'),
      level: Math.floor(Math.random() * 5) // 0-4
    }));

    return NextResponse.json({
      success: true,
      data: {
        dailyRates,
        weeklyRates,
        monthlyRates,
        categoryBreakdown,
        streaks,
        heatmap
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 });
  }
}
