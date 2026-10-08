import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Goal from '@/models/Goal';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    
    const query: any = {};
    if (status) {
      query.status = status;
    }

    const goals = await Goal.find(query).sort({ deadline: 1, createdAt: -1 });
    return NextResponse.json({ success: true, data: goals });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const goal = await Goal.create(body);
    return NextResponse.json({ success: true, data: goal }, { status: 201 });
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ success: false, error: 'Failed to create goal' }, { status: 500 });
  }
}
