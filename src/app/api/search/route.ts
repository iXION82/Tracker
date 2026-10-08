import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Habit from '@/models/Habit';
import Goal from '@/models/Goal';
import Task from '@/models/Task';
import JournalEntry from '@/models/JournalEntry';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');
    
    if (!q || q.length < 2) {
      return NextResponse.json({ success: true, data: { habits: [], goals: [], tasks: [], journal: [] } });
    }

    const regex = new RegExp(q, 'i'); // Case-insensitive search

    // Run searches in parallel
    const [habits, goals, tasks, journal] = await Promise.all([
      Habit.find({ $or: [{ name: regex }, { description: regex }] }).limit(5),
      Goal.find({ $or: [{ title: regex }, { description: regex }] }).limit(5),
      Task.find({ $or: [{ title: regex }, { description: regex }] }).limit(5),
      JournalEntry.find({ $or: [{ content: regex }, { tags: regex }] }).limit(5)
    ]);

    return NextResponse.json({ 
      success: true, 
      data: { 
        habits, 
        goals, 
        tasks, 
        journal 
      } 
    });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json({ success: false, error: 'Failed to search' }, { status: 500 });
  }
}
