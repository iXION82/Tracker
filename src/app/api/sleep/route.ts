import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SleepEntry from '@/models/SleepEntry';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const query: any = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: startOfDay(parseISO(startDate)),
        $lte: endOfDay(parseISO(endDate))
      };
    }

    const entries = await SleepEntry.find(query).sort({ date: -1 });
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error('Error fetching sleep entries:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch sleep entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { date, duration, quality, bedTime, wakeTime, factors, notes } = body;
    
    if (!date) {
      return NextResponse.json({ success: false, error: 'date is required' }, { status: 400 });
    }
    
    const dateStr = date.split('T')[0];
    
    const entry = await SleepEntry.findOneAndUpdate(
      { date: dateStr },
      { date: dateStr, duration, quality, sleepTime: bedTime, wakeTime },
      { new: true, upsert: true, runValidators: true }
    );

    
    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    console.error('Error saving sleep entry:', error);
    return NextResponse.json({ success: false, error: 'Failed to save sleep entry' }, { status: 500 });
  }
}
