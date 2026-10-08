import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Task from '@/models/Task';
import { parseISO, startOfDay, endOfDay } from 'date-fns';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const completed = searchParams.get('completed');
    const dueDate = searchParams.get('dueDate');
    const priority = searchParams.get('priority');
    
    const query: any = {};
    if (completed === 'true') {
      query.completed = true;
    } else if (completed === 'false') {
      query.completed = false;
    }
    
    if (priority) {
      query.priority = priority;
    }

    if (dueDate) {
      const parsedDate = parseISO(dueDate);
      query.dueDate = {
        $gte: startOfDay(parsedDate),
        $lte: endOfDay(parsedDate)
      };
    }

    const tasks = await Task.find(query).sort({ dueDate: 1, priority: -1, createdAt: -1 });
    return NextResponse.json({ success: true, data: tasks });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tasks' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const task = await Task.create(body);
    return NextResponse.json({ success: true, data: task }, { status: 201 });
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json({ success: false, error: 'Failed to create task' }, { status: 500 });
  }
}
