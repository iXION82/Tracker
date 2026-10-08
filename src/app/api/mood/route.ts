import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import MoodEntry from '@/models/MoodEntry';
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

    const entries = await MoodEntry.find(query).sort({ date: -1 });
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error('Error fetching mood entries:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch mood entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { date, mood, energy, stress, note, tags } = body;
    
    if (!date || !mood) {
      return NextResponse.json({ success: false, error: 'date and mood are required' }, { status: 400 });
    }
    
    const parsedDate = parseISO(date);
    
    // Upsert mood entry by date (one per day usually)
    const entry = await MoodEntry.findOneAndUpdate(
      { 
        date: {
          $gte: startOfDay(parsedDate),
          $lte: endOfDay(parsedDate)
        }
      },
      { date: parsedDate, mood, energy, stress, note, tags },
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    console.error('Error saving mood entry:', error);
    return NextResponse.json({ success: false, error: 'Failed to save mood entry' }, { status: 500 });
  }
}
