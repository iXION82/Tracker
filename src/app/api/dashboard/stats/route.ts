import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { getTodayString } from '@/lib/date-utils';
import { calculateDailyProductiveHours, calculate10HourStreak, calculateOnePercentBetterStreak, calculateLongSessionStreak } from '@/lib/streak-engine';

export async function GET() {
  try {
    await connectDB();
    const today = getTodayString();
    
    const totalHours = await calculateDailyProductiveHours(today);
    const tenHourStreak = await calculate10HourStreak(today);
    const onePercentStreak = await calculateOnePercentBetterStreak(today);
    const longSessionStreak = await calculateLongSessionStreak(today);

    return NextResponse.json({
      success: true,
      data: {
        goalHours: 10,
        totalHours,
        tenHourStreak,
        onePercentStreak,
        longSessionStreak
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch stats' }, { status: 500 });
  }
}
