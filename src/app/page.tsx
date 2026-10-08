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
import { getTodayString } from '@/lib/date-utils';

const serialize = (obj: unknown) => JSON.parse(JSON.stringify(obj));

import { connection } from 'next/server';

export default async function DashboardPage() {
  await connection();
  await connectDB();

  const settings = await UserSettings.findOne({}).lean();
  const userName = settings?.name ?? 'User';

  const todayStr = getTodayString();

  const habits = await Habit.find({ active: true }).lean();
  const tasks = await Task.find({}).lean();
  const todayTasks = tasks.filter(t => {
    if (!t.dueDate) return false;
    return t.dueDate.toISOString().split('T')[0] === todayStr;
  });

  const habitLogs = await HabitLog.find({ date: todayStr }).lean();

  const habitsTotal = habits.length;
  const habitsCompleted = habitLogs.filter(log => log.completed).length;
  const tasksTotal = todayTasks.length;
  const tasksCompleted = todayTasks.filter(t => t.completed).length;

  const totalItems = habitsTotal + tasksTotal;
  const completedItems = habitsCompleted + tasksCompleted;
  const dailyCompletion = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const productivity = dailyCompletion;
  const currentStreak = 0;

  const stats = {
    dailyCompletion,
    currentStreak,
    habitsCompleted,
    habitsTotal,
    tasksCompleted,
    tasksTotal,
    productivity,
  };

  const lifeScoreBreakdown = [
    { category: 'Health', score: 85, weight: 30, color: '#10B981' },
    { category: 'Learning', score: 70, weight: 25, color: '#8B5CF6' },
    { category: 'Productivity', score: 90, weight: 25, color: '#3B82F6' },
    { category: 'Habits', score: dailyCompletion, weight: 20, color: '#F59E0B' },
  ];
  const lifeScore = Math.round(
    lifeScoreBreakdown.reduce((acc, b) => acc + b.score * b.weight, 0) /
    lifeScoreBreakdown.reduce((acc, b) => acc + b.weight, 0)
  );

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-6 md:p-10 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Good morning, {userName}
          </h1>
          <p className="text-zinc-400">{formattedDate}</p>
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
            <LifeScoreWidget score={lifeScore} breakdown={lifeScoreBreakdown} />
          </section>

          <section>
            <TodayTasks initialTasks={serialize(todayTasks)} />
          </section>
        </div>
      </div>
    </div>
  );
}
