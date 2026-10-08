import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import JournalEntry from '@/models/JournalEntry';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const body = await request.json();
    
    const entry = await JournalEntry.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!entry) {
      return NextResponse.json({ success: false, error: 'Journal entry not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: entry });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return NextResponse.json({ success: false, error: 'Failed to update journal entry' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const entry = await JournalEntry.findByIdAndDelete(id);
    if (!entry) {
      return NextResponse.json({ success: false, error: 'Journal entry not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete journal entry' }, { status: 500 });
  }
}
