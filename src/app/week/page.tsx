import connectDB from '@/lib/db';
import Habit from '@/models/Habit';
import HabitLog from '@/models/HabitLog';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export const metadata = {
  title: 'Weekly View | LifeOS',
};

async function getWeeklyData() {
  await connectDB();
  
  const today = new Date();
  const dayOfWeek = today.getDay() || 7;
  
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - dayOfWeek + 1);
  startOfWeek.setHours(0, 0, 0, 0);
  
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const habits = await Habit.find({ isActive: true }).lean();
  const logs = await HabitLog.find({
    date: { $gte: startOfWeek, $lte: endOfWeek }
  }).lean();

  const formattedLogs: Record<string, Record<string, any>> = {};
  logs.forEach((log: any) => {
    const hid = log.habitId.toString();
    const dStr = log.date.toISOString().split('T')[0];
    if (!formattedLogs[hid]) formattedLogs[hid] = {};
    formattedLogs[hid][dStr] = log;
  });

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    weekDays.push({
      date: d,
      dateStr: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: d.getDate()
    });
  }

  return {
    habits: habits.map(h => ({ ...h, _id: (h as any)._id.toString(), id: (h as any)._id.toString() })),
    logs: formattedLogs,
    weekDays
  };
}

export default async function WeekPage() {
  const data = await getWeeklyData();

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Weekly Overview</h1>
      </div>

      <Card className="w-full bg-[#111113] border-white/5 overflow-hidden">
        <div className="overflow-x-auto p-4">
          <div className="min-w-max">
            <div className="flex mb-4">
              <div className="w-48 shrink-0"></div>
              <div className="flex flex-1 gap-2">
                {data.weekDays.map(day => (
                  <div key={day.dateStr} className="w-16 flex flex-col items-center justify-center bg-[#18181B] rounded-md py-2 border border-white/5">
                    <span className="text-xs text-zinc-500 uppercase">{day.dayName}</span>
                    <span className="text-sm text-white font-medium">{day.dayNum}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {data.habits.map((habit: any) => (
                <div key={habit.id} className="flex items-center group">
                  <div className="w-48 shrink-0 flex items-center gap-3 pr-4">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: habit.color || '#3b82f6' }} />
                    <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">{habit.name}</span>
                  </div>
                  <div className="flex flex-1 gap-2">
                    {data.weekDays.map(day => {
                      const isCompleted = data.logs[habit.id]?.[day.dateStr]?.completed;
                      return (
                        <div
                          key={`${habit.id}-${day.dateStr}`}
                          className={cn(
                            "w-16 h-12 rounded-md flex items-center justify-center transition-all",
                            isCompleted ? "" : "bg-[#18181B] border border-white/5"
                          )}
                          style={isCompleted ? { backgroundColor: habit.color || '#3b82f6' } : {}}
                        >
                          {isCompleted && (
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
