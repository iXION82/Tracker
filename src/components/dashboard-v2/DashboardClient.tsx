"use client";

import { useState, useEffect } from "react";
import { TimeWindowCard } from "@/components/dashboard-v2/TimeWindowCard";
import { ProductivitySummary } from "@/components/dashboard-v2/ProductivitySummary";
import { TimelineVisualizer } from "@/components/dashboard-v2/TimelineVisualizer";
import { TimeWindow, getQuote, MoodType } from "@/components/dashboard-v2/constants";
import { toast } from "sonner";

export default function DashboardClient() {
  const [data, setData] = useState<Record<TimeWindow, { hours: number, mood?: MoodType, note?: string }>>({
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

  const [quote, setQuote] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setQuote(getQuote());
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
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
  };

  const handleUpdate = async (window: TimeWindow, windowData: { hours: number, mood?: MoodType, note?: string }) => {
    // Optimistic UI update
    setData(prev => ({ ...prev, [window]: windowData }));
    
    // Save to API
    try {
      const res = await fetch('/api/dashboard/window', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ window, ...windowData })
      });
      
      if (!res.ok) {
        throw new Error('Failed to save');
      }
      
      // Refresh stats after save (streak recalculations might happen)
      const statsRes = await fetch('/api/dashboard/stats');
      if (statsRes.ok) {
        const statsJson = await statsRes.json();
        setStats(statsJson.data);
      }
      
    } catch (error) {
      toast.error("Failed to save " + window + " window");
      // Could rollback here if needed
    }
  };

  const totalHours = Object.values(data).reduce((acc, curr) => acc + curr.hours, 0);

  if (isLoading) {
    return <div className="flex justify-center items-center h-64 text-zinc-500">Loading LifeOS...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white p-6 md:p-10 max-w-5xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
          Dashboard
        </h1>
        <p className="text-zinc-400 italic">"{quote}"</p>
      </header>

      <ProductivitySummary 
        totalHours={totalHours}
        goalHours={stats.goalHours}
        tenHourStreak={stats.tenHourStreak}
        onePercentStreak={stats.onePercentStreak}
        longSessionStreak={stats.longSessionStreak}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TimeWindowCard 
          window="morning" 
          initialHours={data.morning.hours}
          initialMood={data.morning.mood}
          initialNote={data.morning.note}
          onUpdate={(d) => handleUpdate("morning", d)}
        />
        <TimeWindowCard 
          window="afternoon" 
          initialHours={data.afternoon.hours}
          initialMood={data.afternoon.mood}
          initialNote={data.afternoon.note}
          onUpdate={(d) => handleUpdate("afternoon", d)}
        />
        <TimeWindowCard 
          window="evening" 
          initialHours={data.evening.hours}
          initialMood={data.evening.mood}
          initialNote={data.evening.note}
          onUpdate={(d) => handleUpdate("evening", d)}
        />
        <TimeWindowCard 
          window="night" 
          initialHours={data.night.hours}
          initialMood={data.night.mood}
          initialNote={data.night.note}
          onUpdate={(d) => handleUpdate("night", d)}
        />
      </div>

      <TimelineVisualizer windows={data} />
    </div>
  );
}
