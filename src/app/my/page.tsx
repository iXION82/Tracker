import { connection } from 'next/server';
import connectDB from '@/lib/db';
import DailyStats from '@/models/DailyStats';
import DailyTimeWindow from '@/models/DailyTimeWindow';
import HabitLog from '@/models/HabitLog';
import Habit from '@/models/Habit';
import SleepEntry from '@/models/SleepEntry';
import { getTodayString } from '@/lib/date-utils';
import MyDashboardClient from '@/components/my/MyDashboardClient';

export default async function MyPage() {
  await connection();
  await connectDB();
  
  const todayStr = getTodayString();
  
  const dailyStats = await DailyStats.findOne({ date: todayStr }).lean();
  const timeWindows = await DailyTimeWindow.find({ date: todayStr }).lean();
  const habitLogs = await HabitLog.find({ date: todayStr }).lean();
  const activeHabits = await Habit.countDocuments({ active: true });
  const sleepEntry = await SleepEntry.findOne({ date: todayStr }).lean();
  
  // Assemble the initial data for the client component
  const initialData = {
    longestSessionMinutes: dailyStats?.longestSessionMinutes || 0,
    unproductiveHours: dailyStats?.unproductiveHours || 0,
    phoneTimeMinutes: dailyStats?.phoneTimeMinutes || 0,
    pcTimeMinutes: dailyStats?.pcTimeMinutes || 0,
    productiveSessions: dailyStats?.productiveSessions || 0,
    health: dailyStats?.health || { meals: 0, water: 0 },
    windows: timeWindows,
    habits: {
      completed: habitLogs.filter((l: any) => l.completed).length,
      total: activeHabits
    },
    sleep: sleepEntry || { duration: 0, quality: 'none' }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-6 md:p-10 w-full max-w-[1400px] mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">My Day</h1>
        <p className="text-zinc-400">Your personal daily statistics.</p>
      </header>

      <MyDashboardClient initialData={JSON.parse(JSON.stringify(initialData))} />
    </div>
  );
}
