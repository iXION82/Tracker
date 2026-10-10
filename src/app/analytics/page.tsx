import connectDB from '@/lib/db';
import Habit from '@/models/Habit';
import HabitLog from '@/models/HabitLog';
import DailyStats from '@/models/DailyStats';
import Goal from '@/models/Goal';
import AnalyticsClient from '@/components/analytics/AnalyticsClient';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Activity, Zap, CheckCircle2, TrendingUp, Clock, BarChart3 } from 'lucide-react';
import { subDays, startOfDay, format, eachDayOfInterval } from 'date-fns';
import { connection } from 'next/server';

export const metadata = { title: 'Analytics | LifeOS' };

export default async function AnalyticsPage() {
  await connection();
  await connectDB();
  
  const now = new Date();
  const todayStr = format(now, 'yyyy-MM-dd');
  const thirtyDaysAgoStr = format(subDays(startOfDay(now), 30), 'yyyy-MM-dd');
  
  const [habits, logs, dailyStatsList, goalsCompleted] = await Promise.all([
    Habit.find({ active: true }).lean(),
    HabitLog.find({ date: { $gte: thirtyDaysAgoStr } }).lean(),
    DailyStats.find({ date: { $gte: thirtyDaysAgoStr } }).sort({ date: 1 }).lean(),
    Goal.countDocuments({ status: 'completed' }),
  ]);

  const habitsCount = habits.length;

  // ── Avg Completion (completions / possible completions per day) ──
  const last30Days = eachDayOfInterval({ start: subDays(now, 29), end: now });
  let totalPossible = 0;
  let totalCompleted = 0;
  last30Days.forEach(date => {
    const dStr = format(date, 'yyyy-MM-dd');
    const dayLogs = logs.filter((l: any) => l.date === dStr);
    const dayCompleted = dayLogs.filter((l: any) => l.completed).length;
    totalCompleted += dayCompleted;
    totalPossible += habitsCount;
  });
  const avgCompletion = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

  // ── Best Day by score ──
  let bestDay = '--';
  let maxScore = 0;
  dailyStatsList.forEach((s: any) => {
    if (s.totalScore > maxScore) {
      maxScore = s.totalScore;
      // Parse YYYY-MM-DD without timezone shift
      const [y, m, d] = (s.date as string).split('-');
      bestDay = format(new Date(+y, +m - 1, +d), 'MMM dd');
    }
  });

  // ── Activity Streak (consecutive days with ≥1 completed habit) ──
  let currentStreak = 0;
  // Start from yesterday if today has nothing logged yet
  const startIdx = (() => {
    const todayLogs = logs.filter((l: any) => l.date === todayStr);
    if (todayLogs.some((l: any) => l.completed)) return 0; // today counts
    return 1; // skip today
  })();
  for (let i = startIdx; i < 30; i++) {
    const dStr = format(subDays(now, i), 'yyyy-MM-dd');
    const dayLogs = logs.filter((l: any) => l.date === dStr);
    if (dayLogs.some((l: any) => l.completed)) {
      currentStreak++;
    } else {
      break;
    }
  }

  // ── Total Productive Hours (last 30 days) ──
  const totalProductiveHours = dailyStatsList.reduce((sum: number, s: any) => {
    // from DailyTimeWindow productive hours
    return sum + (s.totalScore || 0);
  }, 0);

  // ── Average Sleep ──
  const sleepEntries = dailyStatsList.filter((s: any) => s.sleep?.duration > 0);
  const avgSleep = sleepEntries.length > 0
    ? (sleepEntries.reduce((sum: number, s: any) => sum + s.sleep.duration, 0) / sleepEntries.length).toFixed(1)
    : '--';

  // ── Time Allocation Data (Donut) ──
  // Average hours per day over the last 30 days
  const timeAllocationData = (() => {
    if (dailyStatsList.length === 0) return [];
    let prod = 0, sleep = 0, pc = 0, phone = 0, wasted = 0;
    dailyStatsList.forEach((s: any) => {
      prod += (s.totalScore || 0); // approx productive hours from score
      sleep += (s.sleep?.duration || 0);
      pc += (s.pcTimeMinutes || 0) / 60;
      phone += (s.phoneTimeMinutes || 0) / 60;
      wasted += (s.unproductiveHours || 0);
    });
    const days = dailyStatsList.length;
    return [
      { name: 'Productive', value: Math.round((prod / days) * 10) / 10, color: '#3b82f6' },
      { name: 'Sleep', value: Math.round((sleep / days) * 10) / 10, color: '#6366f1' },
      { name: 'PC', value: Math.round((pc / days) * 10) / 10, color: '#06b6d4' },
      { name: 'Phone', value: Math.round((phone / days) * 10) / 10, color: '#ec4899' },
      { name: 'Wasted', value: Math.round((wasted / days) * 10) / 10, color: '#f97316' },
    ].filter(d => d.value > 0);
  })();

  // ── Screen Time (Last 7 Days) ──
  const last7Days = eachDayOfInterval({ start: subDays(now, 6), end: now });
  const screenTimeData = last7Days.map(date => {
    const dStr = format(date, 'yyyy-MM-dd');
    const stat: any = dailyStatsList.find((s: any) => s.date === dStr) || {};
    return {
      date: format(date, 'EEE'),
      PC: Math.round(((stat.pcTimeMinutes || 0) / 60) * 10) / 10,
      Phone: Math.round(((stat.phoneTimeMinutes || 0) / 60) * 10) / 10,
      Wasted: stat.unproductiveHours || 0,
    };
  });

  // ── Habit Completion Heatmap (per-day completion rate) ──
  const completionData = last30Days.map(date => {
    const dStr = format(date, 'yyyy-MM-dd');
    const dayLogs = logs.filter((l: any) => l.date === dStr);
    const completed = dayLogs.filter((l: any) => l.completed).length;
    const rate = habitsCount > 0 ? Math.round((completed / habitsCount) * 100) : 0;
    return { date: format(date, 'dd'), rate, completed, total: habitsCount };
  });

  // ── Score Trend ──
  const scoreTrendData = dailyStatsList.map((s: any) => {
    const [y, m, d] = (s.date as string).split('-');
    return {
      date: format(new Date(+y, +m - 1, +d), 'MMM dd'),
      score: s.totalScore || 0,
      habits: s.habitsCompleted || 0,
      tasks: s.tasksCompleted || 0
    };
  });

  // ── Top Habits (by completion rate) ──
  const habitStats = habits.map((h: any) => {
    const hId = h._id.toString();
    const hLogs = logs.filter((l: any) => l.habitId?.toString() === hId);
    const hCompleted = hLogs.filter((l: any) => l.completed).length;
    const rate = last30Days.length > 0 ? Math.round((hCompleted / last30Days.length) * 100) : 0;
    return { name: h.name, rate, color: h.color || '#3b82f6', completed: hCompleted, total: last30Days.length };
  }).sort((a, b) => b.rate - a.rate).slice(0, 5);

  return (
    <div className="container mx-auto p-6 md:p-10 w-full max-w-[1400px] space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-white">Analytics</h1>
        <p className="text-zinc-500 mt-1">30-day overview of your habits, time, and progress</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Habits', value: String(habitsCount), icon: Target, color: 'blue' },
          { label: 'Completion Rate', value: `${avgCompletion}%`, icon: CheckCircle2, color: 'emerald' },
          { label: 'Activity Streak', value: `${currentStreak}`, suffix: 'days', icon: Zap, color: 'yellow' },
          { label: 'Best Day Score', value: maxScore > 0 ? `${maxScore}` : '--', suffix: maxScore > 0 ? 'pts' : '', icon: TrendingUp, color: 'purple' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const colorMap: Record<string, { bg: string, text: string, glow: string }> = {
            blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', glow: 'from-blue-500/[0.03]' },
            emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', glow: 'from-emerald-500/[0.03]' },
            yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', glow: 'from-yellow-500/[0.03]' },
            purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', glow: 'from-purple-500/[0.03]' },
          };
          const c = colorMap[stat.color];
          return (
            <Card key={i} className="bg-[#111113] border-white/[0.04] relative overflow-hidden group hover:border-white/10 transition-all duration-300">
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-b ${c.glow} to-transparent pointer-events-none`} />
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-2xl ${c.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${c.text}`} />
                </div>
                <p className="text-3xl font-black text-white leading-none tabular-nums">
                  {stat.value}
                  {stat.suffix && <span className="text-sm font-medium text-zinc-500 ml-1">{stat.suffix}</span>}
                </p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Secondary Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-[#111113] border-white/[0.04] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <p className="text-xl font-black text-white tabular-nums">{avgSleep}<span className="text-xs text-zinc-500 ml-1">hrs</span></p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] font-semibold">Avg Sleep</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#111113] border-white/[0.04] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-xl font-black text-white tabular-nums">{goalsCompleted}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] font-semibold">Goals Completed</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#111113] border-white/[0.04] p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-pink-400" />
            </div>
            <div>
              <p className="text-xl font-black text-white tabular-nums">{bestDay}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-[0.15em] font-semibold">Best Day</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Client Charts ── */}
      <AnalyticsClient
        timeAllocationData={timeAllocationData}
        screenTimeData={screenTimeData}
        completionData={completionData}
        scoreTrendData={scoreTrendData}
        habitStats={habitStats}
      />
    </div>
  );
}
