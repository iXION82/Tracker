import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import TimeEntry from '@/models/TimeEntry';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const category = searchParams.get('category');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
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
    
    if (category) {
      query.categoryId = category;
    }

    const entries = await TimeEntry.find(query).sort({ startTime: -1 });
    return NextResponse.json({ success: true, data: entries });
  } catch (error) {
    console.error('Error fetching time entries:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch time entries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const entry = await TimeEntry.create(body);
    return NextResponse.json({ success: true, data: entry }, { status: 201 });
  } catch (error) {
    console.error('Error creating time entry:', error);
    return NextResponse.json({ success: false, error: 'Failed to create time entry' }, { status: 500 });
  }
}
