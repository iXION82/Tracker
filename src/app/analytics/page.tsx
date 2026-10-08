import connectDB from '@/lib/db';
import Habit from '@/models/Habit';
import HabitLog from '@/models/HabitLog';
import MoodEntry from '@/models/MoodEntry';
import TimeEntry from '@/models/TimeEntry';
import CategoryDonut from '@/components/charts/CategoryDonut';
import MoodChart from '@/components/charts/MoodChart';
import StudyTimeChart from '@/components/charts/StudyTimeChart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Target, Activity, Zap, CheckCircle2 } from 'lucide-react';
import { subDays, startOfDay, format, startOfWeek, subWeeks } from 'date-fns';


import { connection } from 'next/server';

export default async function AnalyticsPage() {
  await connection();
  await connectDB();
  
  const now = new Date();
  const thirtyDaysAgoStr = format(subDays(startOfDay(now), 30), 'yyyy-MM-dd');
  
  const [habitsCount, logs, moodEntries, timeEntries] = await Promise.all([
    Habit.countDocuments({ active: true }),
    HabitLog.find({ date: { $gte: thirtyDaysAgoStr } }).lean() as Promise<any[]>,
    MoodEntry.find({ date: { $gte: thirtyDaysAgoStr } }).sort({ date: 1 }).lean() as Promise<any[]>,
    TimeEntry.find({ date: { $gte: thirtyDaysAgoStr } }).lean() as Promise<any[]>,
  ]);

  // Basic stats
  const totalLogs = logs.length;
  const completedLogs = logs.filter((l: any) => l.completed).length;
  const avgCompletion = totalLogs > 0 ? Math.round((completedLogs / totalLogs) * 100) : 0;

  
  // Mood Data
  const moodData = moodEntries.map((entry: any) => ({
    date: format(new Date(entry.date), 'MMM dd'),
    mood: entry.score,
    energy: entry.energyLevel || 3,
    stress: entry.stressLevel || 3
  }));

  const categoryData = [
    { name: 'Health', value: 35, color: '#10b981' },
    { name: 'Work', value: 25, color: '#3b82f6' },
    { name: 'Learning', value: 20, color: '#8b5cf6' },
    { name: 'Personal', value: 15, color: '#f59e0b' },
    { name: 'Social', value: 5, color: '#ec4899' },
  ];

  const studyData = Array.from({ length: 7 }).map((_, i) => ({
    date: format(subDays(now, 6 - i), 'EEE'),
    Code: Math.floor(Math.random() * 120),
    Read: Math.floor(Math.random() * 60),
    Write: Math.floor(Math.random() * 45),
  }));

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">Analytics</h1>
        <p className="text-zinc-400 mt-2">Comprehensive insights into your habits and time</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#111113] border-white/5">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
              <Target className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium">Active Habits</p>
              <h4 className="text-2xl font-bold text-white">{habitsCount}</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111113] border-white/5">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium">Avg Completion</p>
              <h4 className="text-2xl font-bold text-white">{avgCompletion}%</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111113] border-white/5">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium">Current Streak</p>
              <h4 className="text-2xl font-bold text-white">--</h4>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#111113] border-white/5">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-500">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-zinc-400 font-medium">Best Day</p>
              <h4 className="text-2xl font-bold text-white">--</h4>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-[#111113] border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-lg">Habits by Category</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <CategoryDonut data={categoryData} />
          </CardContent>
        </Card>

        <Card className="bg-[#111113] border-white/5">
          <CardHeader>
            <CardTitle className="text-white text-lg">Time Tracking (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <StudyTimeChart data={studyData} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#111113] border-white/5">
        <CardHeader>
          <CardTitle className="text-white text-lg">Mood & Energy Trends</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px]">
          <MoodChart data={moodData} />
        </CardContent>
      </Card>
    </div>
  );
}
