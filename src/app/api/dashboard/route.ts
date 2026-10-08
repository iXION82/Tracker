import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import DailyTimeWindow from '@/models/DailyTimeWindow';
import { getTodayString } from '@/lib/date-utils';
import { calculateDailyProductiveHours, calculate10HourStreak, calculateOnePercentBetterStreak, calculateLongSessionStreak } from '@/lib/streak-engine';

export async function GET() {
  try {
    await connectDB();
    const today = getTodayString();
    
    // Fetch today's windows
    const windows = await DailyTimeWindow.find({ date: today }).lean();
    
    const formattedWindows = {
      morning: { hours: 0 },
      afternoon: { hours: 0 },
      evening: { hours: 0 },
      night: { hours: 0 }
    };
    
    windows.forEach((w: any) => {
      if (formattedWindows[w.window as keyof typeof formattedWindows]) {
        formattedWindows[w.window as keyof typeof formattedWindows] = {
          hours: w.productiveHours || 0,
          mood: w.mood,
          note: w.note
        };
      }
    });

    // Calculate stats
    const totalHours = await calculateDailyProductiveHours(today);
    const tenHourStreak = await calculate10HourStreak(today);
    const onePercentStreak = await calculateOnePercentBetterStreak(today);
    const longSessionStreak = await calculateLongSessionStreak(today);

    return NextResponse.json({
      success: true,
      data: {
        windows: formattedWindows,
        stats: {
          goalHours: 10, // Could fetch from settings later
          totalHours,
          tenHourStreak,
          onePercentStreak,
          longSessionStreak
        }
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}
