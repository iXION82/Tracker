import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import HabitLog from '@/models/HabitLog';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get('habitId');
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const query: any = {};
    if (habitId) query.habitId = habitId;
    
    if (date) {
      const parsedDate = parseISO(date);
      query.date = {
        $gte: startOfDay(parsedDate),
        $lte: endOfDay(parsedDate)
      };
    } else if (startDate && endDate) {
      query.date = {
        $gte: startOfDay(parseISO(startDate)),
        $lte: endOfDay(parseISO(endDate))
      };
    }

    const logs = await HabitLog.find(query).sort({ date: -1 });
    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    console.error('Error fetching habit logs:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch habit logs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { habitId, date, completed, value, duration, note } = body;
    
    if (!habitId || !date) {
      return NextResponse.json({ success: false, error: 'habitId and date are required' }, { status: 400 });
    }
    
    const parsedDate = parseISO(date);
    
    // Upsert habit log
    const log = await HabitLog.findOneAndUpdate(
      { 
        habitId,
        date: {
          $gte: startOfDay(parsedDate),
          $lte: endOfDay(parsedDate)
        }
      },
      { habitId, date: parsedDate, completed, value, duration, note },
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, data: log });
  } catch (error) {
    console.error('Error saving habit log:', error);
    return NextResponse.json({ success: false, error: 'Failed to save habit log' }, { status: 500 });
  }
}
