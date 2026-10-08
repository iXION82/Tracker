import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Goal from '@/models/Goal';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();
    
    const goal = await Goal.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!goal) {
      return NextResponse.json({ success: false, error: 'Goal not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: goal });
  } catch (error) {
    console.error('Error updating goal:', error);
    return NextResponse.json({ success: false, error: 'Failed to update goal' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const goal = await Goal.findByIdAndDelete(id);
    if (!goal) {
      return NextResponse.json({ success: false, error: 'Goal not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete goal' }, { status: 500 });
  }
}
