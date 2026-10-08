'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import MonthlyProgressChart from '@/components/charts/MonthlyProgressChart';
import DailyProgressRing from '@/components/charts/DailyProgressRing';
import MonthlyGrid from '@/components/habits/MonthlyGrid';
import TopHabits from '@/components/habits/TopHabits';
import HabitForm from '@/components/habits/HabitForm';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { IHabit } from '@/types';

type LogsType = Record<string, Record<string, any>>;

export default function TrackerClient() {
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [habits, setHabits] = useState<IHabit[]>([]);
  const [logs, setLogs] = useState<LogsType>({});
  const [daysInMonth, setDaysInMonth] = useState(30);

  const [chartData, setChartData] = useState<any[]>([]);
  const [habitsStats, setHabitsStats] = useState<any[]>([]);
  const [totalCompletions, setTotalCompletions] = useState(0);
  const [todayCompleted, setTodayCompleted] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);

  const fetchData = async (y: number, m: number) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tracker?year=${y}&month=${m}`);
      const json = await res.json();
      if (json.success) {
        setHabits(json.data.habits);
        setLogs(json.data.logs);
        setDaysInMonth(json.data.daysInMonth);
        updateDerivedState(json.data.logs, json.data.habits, y, m, json.data.daysInMonth);
      }
    } catch (err) {
      toast.error('Failed to load tracker data');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(year, month);
  }, [year, month]);

  const updateDerivedState = (currentLogs: LogsType, currentHabits: IHabit[], y: number, m: number, dim: number) => {
    const today = new Date();
    const currentDay = today.getFullYear() === y && today.getMonth() + 1 === m ? today.getDate() : dim;
    
    let totalComps = 0;
    const newChartData = [];
    
    for (let d = 1; d <= dim; d++) {
      const dateStr = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      let completed = 0;
      currentHabits.forEach(h => {
        if (currentLogs[h._id as string]?.[dateStr]?.completed) {
          completed++;
          totalComps++;
        }
      });
      newChartData.push({ date: dateStr, completed, total: currentHabits.length });
    }
    
    const newHabitsStats = currentHabits.map(h => {
      const hid = h._id as string;
      const habitLogs = currentLogs[hid] || {};
      const completions = Object.values(habitLogs).filter((l: any) => l.completed).length;
      return {
        id: hid,
        name: h.name,
        color: h.color || '#3b82f6',
        completionRate: currentDay > 0 ? completions / currentDay : 0
      };
    });
    
    const todayIdx = Math.max(0, currentDay - 1);
    setChartData(newChartData);
    setHabitsStats(newHabitsStats);
    setTotalCompletions(totalComps);
    setTodayCompleted(newChartData[todayIdx]?.completed || 0);
    setTodayTotal(currentHabits.length);
  };

  const handleToggle = async (habitId: string, day: number) => {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const currentLog = logs[habitId]?.[dateStr];
    const newStatus = currentLog?.completed ? false : true;

    const newLogs = {
      ...logs,
      [habitId]: {
        ...(logs[habitId] || {}),
        [dateStr]: { ...currentLog, completed: newStatus }
      }
    };
    
    setLogs(newLogs);
    updateDerivedState(newLogs, habits, year, month, daysInMonth);

    try {
      const res = await fetch('/api/habits/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ habitId, date: dateStr, completed: newStatus })
      });
      if (!res.ok) throw new Error('Failed to update log');
    } catch (err) {
      toast.error('Failed to save progress');
      const revertedLogs = {
        ...logs,
        [habitId]: {
          ...(logs[habitId] || {}),
          [dateStr]: { ...currentLog, completed: !newStatus }
        }
      };
      setLogs(revertedLogs);
      updateDerivedState(revertedLogs, habits, year, month, daysInMonth);
    }
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(y => y - 1);
    } else {
      setMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(y => y + 1);
    } else {
      setMonth(m => m + 1);
    }
  };

  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  const possibleCompletions = daysInMonth * habits.length;
  const overallCompletionRate = possibleCompletions > 0 ? (totalCompletions / possibleCompletions) * 100 : 0;
  
  let bestDay = { date: '', completed: -1 };
  chartData.forEach(d => {
    if (d.completed > bestDay.completed) bestDay = { date: d.date, completed: d.completed };
  });

  let bestHabit = { name: '-', rate: -1 };
  habitsStats.forEach(h => {
    if (h.completionRate > bestHabit.rate) bestHabit = { name: h.name, rate: h.completionRate };
  });

  return (
    <div className="w-full px-4 md:px-8 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white tracking-tight">Monthly Tracker</h1>
          <HabitForm onSuccess={() => fetchData(year, month)} />
        </div>
        
        <div className="flex items-center gap-4 bg-[#18181B] border border-white/5 rounded-lg p-1">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-white/5 rounded-md text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="text-sm font-medium text-white min-w-[120px] text-center">
            {monthName} {year}
          </div>
          <button onClick={handleNextMonth} className="p-2 hover:bg-white/5 rounded-md text-zinc-400 hover:text-white transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-[#111113] border border-white/5 rounded-xl p-4">
          <div className="text-xs text-zinc-500 mb-1">Total Completions</div>
          <div className="text-2xl font-bold text-white">{totalCompletions}</div>
        </div>
        <div className="bg-[#111113] border border-white/5 rounded-xl p-4">
          <div className="text-xs text-zinc-500 mb-1">Possible</div>
          <div className="text-2xl font-bold text-white">{possibleCompletions}</div>
        </div>
        <div className="bg-[#111113] border border-white/5 rounded-xl p-4">
          <div className="text-xs text-zinc-500 mb-1">Completion %</div>
          <div className="text-2xl font-bold text-white">{overallCompletionRate.toFixed(1)}%</div>
        </div>
        <div className="bg-[#111113] border border-white/5 rounded-xl p-4">
          <div className="text-xs text-zinc-500 mb-1">Best Day</div>
          <div className="text-xl font-bold text-white truncate">{bestDay.date || '-'}</div>
        </div>
        <div className="bg-[#111113] border border-white/5 rounded-xl p-4">
          <div className="text-xs text-zinc-500 mb-1">Best Habit</div>
          <div className="text-xl font-bold text-white truncate">{bestHabit.name}</div>
        </div>
      </div>

      {loading && chartData.length === 0 ? (
        <div className="flex justify-center p-12 text-zinc-500">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <MonthlyProgressChart data={chartData} />
            </div>
            <div className="lg:col-span-1 flex items-center justify-center bg-[#111113] border border-white/5 rounded-xl p-6">
              <DailyProgressRing 
                completed={todayCompleted} 
                total={todayTotal} 
                label="today" 
                size={160} 
                strokeWidth={14} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 overflow-hidden">
              <MonthlyGrid 
                habits={habits} 
                logs={logs} 
                year={year} 
                month={month} 
                onToggle={handleToggle}
                onHabitUpdate={() => fetchData(year, month)}
              />
            </div>
            <div className="lg:col-span-1">
              <TopHabits habits={habitsStats} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
