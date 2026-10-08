import connectDB from '@/lib/db';
import UserSettings from '@/models/UserSettings';
import Habit from '@/models/Habit';
import HabitLog from '@/models/HabitLog';
import Task from '@/models/Task';
import SummaryCards from '@/components/dashboard/SummaryCards';
import TodayHabits from '@/components/dashboard/TodayHabits';
import TodayTasks from '@/components/dashboard/TodayTasks';
import LifeScoreWidget from '@/components/dashboard/LifeScoreWidget';
import HabitForm from '@/components/habits/HabitForm';

const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

export default async function DashboardPage() {
  await connectDB();

  let settings = await UserSettings.findOne({});
  if (!settings) {
    settings = { name: 'User' };
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const habits = await Habit.find({ active: true }).lean();
  const tasks = await Task.find({
    dueDate: { $gte: startOfDay, $lte: endOfDay }
  }).lean();
  
  const habitLogs = await HabitLog.find({
    date: { $gte: startOfDay, $lte: endOfDay }
  }).lean();

  const habitsTotal = habits.length;
  const habitsCompleted = habitLogs.filter(log => log.completed).length;
  const tasksTotal = tasks.length;
  const tasksCompleted = tasks.filter(t => t.completed).length;

  const totalItems = habitsTotal + tasksTotal;
  const completedItems = habitsCompleted + tasksCompleted;
  const dailyCompletion = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
  
  const productivity = dailyCompletion;
  const currentStreak = 12; // Mock for now

  const stats = {
    dailyCompletion,
    currentStreak,
    habitsCompleted,
    habitsTotal,
    tasksCompleted,
    tasksTotal,
    productivity
  };

  const lifeScoreBreakdown = [
    { category: 'Health', score: 85, weight: 1, color: '#22c55e' },
    { category: 'Work', score: 70, weight: 1, color: '#3b82f6' },
    { category: 'Mind', score: 90, weight: 1, color: '#8b5cf6' },
    { category: 'Social', score: 60, weight: 1, color: '#f59e0b' },
  ];
  const lifeScore = 76;

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-6 md:p-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Good morning, {settings.name}
          </h1>
          <p className="text-zinc-400">
            {formattedDate}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <HabitForm />
        </div>
      </header>

      <SummaryCards stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <TodayHabits 
              initialHabits={serialize(habits)} 
              initialLogs={serialize(habitLogs)} 
            />
          </section>
        </div>

        <div className="space-y-8">
          <section>
            <LifeScoreWidget 
              score={lifeScore} 
              breakdown={lifeScoreBreakdown} 
            />
          </section>
          
          <section>
            <TodayTasks initialTasks={serialize(tasks)} />
          </section>
        </div>
      </div>
    </div>
  );
}
