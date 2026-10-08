import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import JournalEntry from '@/models/JournalEntry';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const tag = searchParams.get('tag');
    
    const query: any = {};
    
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

    if (tag) {
      query.tags = tag;
    }

    const entries = await JournalEntry.find(query).sort({ date: -1 });
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error('Error fetching journal entries:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch journal entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { date, content, tags, mood, isFavorite } = body;
    
    if (!date) {
      return NextResponse.json({ success: false, error: 'date is required' }, { status: 400 });
    }
    
    const parsedDate = parseISO(date);
    
    // Upsert journal entry by date (one per day usually)
    const entry = await JournalEntry.findOneAndUpdate(
      { 
        date: {
          $gte: startOfDay(parsedDate),
          $lte: endOfDay(parsedDate)
        }
      },
      { date: parsedDate, content, tags, mood, isFavorite },
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    console.error('Error saving journal entry:', error);
    return NextResponse.json({ success: false, error: 'Failed to save journal entry' }, { status: 500 });
  }
}
