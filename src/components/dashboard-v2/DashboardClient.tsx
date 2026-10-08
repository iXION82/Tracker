"use client";

import { useState, useEffect, useCallback } from "react";
import { TimeWindowCard } from "@/components/dashboard-v2/TimeWindowCard";
import { ProductivitySummary } from "@/components/dashboard-v2/ProductivitySummary";
import { TimelineVisualizer } from "@/components/dashboard-v2/TimelineVisualizer";
import { TimeWindow, getQuote, MoodType } from "@/components/dashboard-v2/constants";
import { toast } from "sonner";

type WindowData = { hours: number; mood?: MoodType; note?: string };

export default function DashboardClient() {
  const [data, setData] = useState<Record<TimeWindow, WindowData>>({
    morning: { hours: 0 },
    afternoon: { hours: 0 },
    evening: { hours: 0 },
    night: { hours: 0 }
  });

  const [stats, setStats] = useState({
    goalHours: 10,
    tenHourStreak: 0,
    onePercentStreak: 0,
    longSessionStreak: 0
  });

  const [quote] = useState(() => getQuote());
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setData(json.data.windows);
          setStats(json.data.stats);
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleUpdate = async (windowName: TimeWindow, windowData: WindowData) => {
    // Save previous for rollback
    const prev = { ...data };

    // Optimistic UI
    setData(d => ({ ...d, [windowName]: windowData }));

    try {
      const res = await fetch('/api/dashboard/window', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ window: windowName, ...windowData })
      });

      if (!res.ok) throw new Error('Failed to save');

      // Refresh stats
      const statsRes = await fetch('/api/dashboard/stats');
      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        if (statsJson.data) setStats(statsJson.data);
      }
    } catch {
      // Rollback
      setData(prev);
      toast.error("Failed to save " + windowName + " data");
    }
  };

  const totalHours = Object.values(data).reduce((acc, curr) => acc + curr.hours, 0);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-zinc-500">Loading LifeOS...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-6 md:p-10 w-full max-w-[1400px] mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-zinc-500 text-sm italic">&ldquo;{quote}&rdquo;</p>
      </header>

      <ProductivitySummary
        totalHours={totalHours}
        goalHours={stats.goalHours}
        tenHourStreak={stats.tenHourStreak}
        onePercentStreak={stats.onePercentStreak}
        longSessionStreak={stats.longSessionStreak}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            {(['morning', 'afternoon', 'evening', 'night'] as TimeWindow[]).map(w => (
              <TimeWindowCard
                key={w}
                window={w}
                initialHours={data[w].hours}
                initialMood={data[w].mood}
                initialNote={data[w].note}
                onUpdate={(d) => handleUpdate(w, d)}
              />
            ))}
          </div>
        </div>

        <div className="lg:w-80 shrink-0">
          <TimelineVisualizer windows={data} />
        </div>
      </div>
    </div>
  );
}
