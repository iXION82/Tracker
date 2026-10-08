import connectDB from '@/lib/db';
import Habit from '@/models/Habit';
import HabitLog from '@/models/HabitLog';
import TodayHabits from '@/components/dashboard/TodayHabits';
import { Card } from '@/components/ui/card';

const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

export default async function TodayPage() {
  await connectDB();

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const habits = await Habit.find({ active: true }).lean();
  const habitLogs = await HabitLog.find({
    date: { $gte: startOfDay, $lte: endOfDay }
  }).lean();

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-6 md:p-10 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Today's Focus</h1>
        <p className="text-zinc-400">{formattedDate}</p>
      </header>

      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-[#111113] border-white/5 rounded-xl p-5">
            <h3 className="text-zinc-400 text-sm font-medium mb-3">How are you feeling?</h3>
            <div className="flex justify-between items-center text-3xl">
              {['😭', '😔', '😐', '🙂', '🤩'].map(emoji => (
                <button key={emoji} className="hover:scale-125 transition-transform opacity-70 hover:opacity-100 cursor-pointer">
                  {emoji}
                </button>
              ))}
            </div>
          </Card>
          
          <Card className="bg-[#111113] border-white/5 rounded-xl p-5">
            <h3 className="text-zinc-400 text-sm font-medium mb-3">Sleep</h3>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-white">7h 30m</div>
              <div className="text-xs text-zinc-500 bg-[#18181B] px-2 py-1 rounded">Quality: Good</div>
            </div>
          </Card>
        </div>

        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-6">Your Routine</h2>
          <TodayHabits 
            initialHabits={serialize(habits)} 
            initialLogs={serialize(habitLogs)} 
          />
        </div>
      </div>
    </div>
  );
}
