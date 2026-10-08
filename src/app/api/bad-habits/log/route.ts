import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import BadHabitLog from '@/models/BadHabitLog';
import { getTodayString } from '@/lib/date-utils';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { badHabitId, durationMinutes } = body;
    
    if (!badHabitId) {
      return NextResponse.json({ success: false, error: 'badHabitId is required' }, { status: 400 });
    }
    
    const date = getTodayString();
    
    const entry = await BadHabitLog.findOneAndUpdate(
      { badHabitId, date },
      { badHabitId, date, durationMinutes },
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    console.error('Error logging bad habit:', error);
    return NextResponse.json({ success: false, error: 'Failed to log bad habit' }, { status: 500 });
  }
}
