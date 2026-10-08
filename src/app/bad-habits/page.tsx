import { connection } from 'next/server';
import connectDB from '@/lib/db';
import BadHabit from '@/models/BadHabit';
import BadHabitLog from '@/models/BadHabitLog';
import { getTodayString } from '@/lib/date-utils';
import BadHabitsClient from '@/components/bad-habits/BadHabitsClient';

export default async function BadHabitsPage() {
  await connection();
  await connectDB();
  
  const todayStr = getTodayString();
  
  const badHabits = await BadHabit.find({ active: true }).lean();
  const logs = await BadHabitLog.find({ date: todayStr }).lean();
  
  // Format the data
  const data = badHabits.map((h: any) => {
    const log = logs.find((l: any) => l.badHabitId.toString() === h._id.toString());
    return {
      _id: h._id.toString(),
      name: h.name,
      dailyLimitMinutes: h.dailyLimitMinutes,
      icon: h.icon || 'alert',
      durationMinutes: log ? log.durationMinutes : 0
    };
  });

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-6 md:p-10 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Bad Habits</h1>
        <p className="text-zinc-400">Track and limit your daily distractions.</p>
      </header>

      <BadHabitsClient initialData={JSON.parse(JSON.stringify(data))} />
    </div>
  );
}
