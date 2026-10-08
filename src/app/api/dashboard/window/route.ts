import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import DailyTimeWindow from '@/models/DailyTimeWindow';
import { getTodayString } from '@/lib/date-utils';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { window, hours, mood, note } = body;
    
    if (!window) {
      return NextResponse.json({ success: false, error: 'Window is required' }, { status: 400 });
    }
    
    const date = getTodayString();
    
    const entry = await DailyTimeWindow.findOneAndUpdate(
      { date, window },
      { date, window, productiveHours: hours, mood, note },
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    console.error('Error updating time window:', error);
    return NextResponse.json({ success: false, error: 'Failed to update time window' }, { status: 500 });
  }
}
