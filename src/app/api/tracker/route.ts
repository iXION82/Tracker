import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Habit from '@/models/Habit';
import HabitLog from '@/models/HabitLog';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const year = parseInt(searchParams.get('year') || String(new Date().getFullYear()));
    const month = parseInt(searchParams.get('month') || String(new Date().getMonth() + 1));
    
    const habits = await Habit.find({ active: true }).lean();
    const daysInMonth = new Date(year, month, 0).getDate();
    const startDate = `${year}-${String(month).padStart(2,'0')}-01`;
    const endDate = `${year}-${String(month).padStart(2,'0')}-${String(daysInMonth).padStart(2,'0')}`;
    
    const logs = await HabitLog.find({ date: { $gte: startDate, $lte: endDate } }).lean();
    
    const formattedLogs: Record<string, Record<string, any>> = {};
    logs.forEach((log: any) => {
      const hid = log.habitId.toString();
      if (!formattedLogs[hid]) formattedLogs[hid] = {};
      formattedLogs[hid][log.date] = { completed: log.completed, value: log.value };
    });
    
    return NextResponse.json({
      success: true,
      data: {
        habits: habits.map((h: any) => ({ ...h, _id: h._id.toString() })),
        logs: formattedLogs,
        year,
        month,
        daysInMonth
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed' }, { status: 500 });
  }
}
