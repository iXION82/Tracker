import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Habit from '@/models/Habit';
import HabitLog from '@/models/HabitLog';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();
    
    const habit = await Habit.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!habit) {
      return NextResponse.json({ success: false, error: 'Habit not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: habit });
  } catch (error) {
    console.error('Error updating habit:', error);
    return NextResponse.json({ success: false, error: 'Failed to update habit' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const habit = await Habit.findByIdAndDelete(id);
    if (!habit) {
      return NextResponse.json({ success: false, error: 'Habit not found' }, { status: 404 });
    }
    
    // Delete associated logs
    await HabitLog.deleteMany({ habitId: id });
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting habit:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete habit' }, { status: 500 });
  }
}
