import MonthlyProgressChart from '@/components/charts/MonthlyProgressChart';
import DailyProgressRing from '@/components/charts/DailyProgressRing';
import MonthlyGrid from '@/components/habits/MonthlyGrid';
import TopHabits from '@/components/habits/TopHabits';
import connectDB from '@/lib/db';
import Habit from '@/models/Habit';
import HabitLog from '@/models/HabitLog';
import { IHabit } from '@/types';

export const metadata = {
  title: 'Monthly Tracker | LifeOS',
};

async function getTrackerData() {
  await connectDB();
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 1-12
  
  const habits = await Habit.find({ isActive: true }).lean() as any[];
  
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0, 23, 59, 59);
  
  const logs = await HabitLog.find({
    date: { $gte: startDate, $lte: endDate }
  }).lean();

  const formattedLogs: Record<string, any> = {};
  logs.forEach((log: any) => {
    const habitId = log.habitId.toString();
    const dateStr = log.date.toISOString().split('T')[0];
    if (!formattedLogs[habitId]) formattedLogs[habitId] = {};
    formattedLogs[habitId][dateStr] = log;
  });

  const daysInMonth = endDate.getDate();
  const chartData = [];
  let totalCompletionsMonth = 0;
  
  for (let i = 1; i <= daysInMonth; i++) {
    const dStr = `${year}-${String(month).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    let completed = 0;
    let total = habits.length;
    
    habits.forEach(h => {
      const hid = h._id.toString();
      if (formattedLogs[hid] && formattedLogs[hid][dStr] && formattedLogs[hid][dStr].completed) {
        completed++;
        totalCompletionsMonth++;
      }
    });
    
    chartData.push({ date: dStr, completed, total });
  }

  const habitsStats = habits.map((h: any) => {
    const hid = h._id.toString();
    const habitLogs = formattedLogs[hid] || {};
    const completions = Object.values(habitLogs).filter((l: any) => l.completed).length;
    return {
      id: hid,
      name: h.name,
      color: h.color || '#3b82f6',
      completionRate: date.getDate() > 0 ? completions / date.getDate() : 0
    };
  });

  return {
    habits: habits.map(h => ({ ...h, _id: h._id.toString(), id: h._id.toString() })),
    logs: formattedLogs,
    chartData,
    habitsStats,
    year,
    month,
    todayCompleted: chartData[date.getDate() - 1]?.completed || 0,
    todayTotal: habits.length
  };
}

export default async function TrackerPage() {
  const data = await getTrackerData();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Monthly Tracker</h1>
        <div className="text-sm text-zinc-400 bg-[#18181B] px-3 py-1.5 rounded-md border border-white/5">
          {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <MonthlyProgressChart data={data.chartData} />
        </div>
        <div className="lg:col-span-1 flex items-center justify-center bg-[#111113] border border-white/5 rounded-xl p-6">
          <DailyProgressRing 
            completed={data.todayCompleted} 
            total={data.todayTotal} 
            label="today" 
            size={160} 
            strokeWidth={14} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <MonthlyGrid 
            habits={data.habits as any} 
            logs={data.logs} 
            year={data.year} 
            month={data.month} 
          />
        </div>
        <div className="lg:col-span-1">
          <TopHabits habits={data.habitsStats} />
        </div>
      </div>
    </div>
  );
}
