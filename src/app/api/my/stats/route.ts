import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import DailyStats from '@/models/DailyStats';
import { getTodayString } from '@/lib/date-utils';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { longestSessionMinutes } = body;
    
    const date = getTodayString();
    
    const entry = await DailyStats.findOneAndUpdate(
      { date },
      { $set: { date, longestSessionMinutes } },
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    console.error('Error saving daily stats:', error);
    return NextResponse.json({ success: false, error: 'Failed to save stats' }, { status: 500 });
  }
}
