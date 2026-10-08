import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Habit from '@/models/Habit';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    
    const query: any = {};
    if (active === 'true') {
      query.isActive = true;
    } else if (active === 'false') {
      query.isActive = false;
    }

    const habits = await Habit.find(query).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: habits });
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch habits' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Auto-assign order if not provided
    if (body.order === undefined) {
      const lastHabit = await Habit.findOne().sort({ order: -1 });
      body.order = lastHabit ? (lastHabit.order || 0) + 1 : 0;
    }

    const habit = await Habit.create(body);
    return NextResponse.json({ success: true, data: habit }, { status: 201 });
  } catch (error) {
    console.error('Error creating habit:', error);
    return NextResponse.json({ success: false, error: 'Failed to create habit' }, { status: 500 });
  }
}
