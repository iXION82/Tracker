"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function MyDashboardClient({ initialData }: { initialData: any }) {
  const [sessionHours, setSessionHours] = useState(Math.floor(initialData.longestSessionMinutes / 60));
  const [sessionMinutes, setSessionMinutes] = useState(initialData.longestSessionMinutes % 60);
  const [isSaving, setIsSaving] = useState(false);

  const saveLongestSession = async () => {
    setIsSaving(true);
    const totalMinutes = (sessionHours * 60) + sessionMinutes;
    try {
      const res = await fetch('/api/my/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ longestSessionMinutes: totalMinutes })
      });
      if (res.ok) {
        toast.success("Longest session saved!");
      } else {
        throw new Error('Failed');
      }
    } catch (e) {
      toast.error("Failed to save longest session");
    } finally {
      setIsSaving(false);
    }
  };

  const totalProductiveHours = initialData.windows.reduce((acc: number, w: any) => acc + (w.productiveHours || 0), 0);
  const unproductiveHours = 16 - totalProductiveHours; // Assuming 16 waking hours
  const productivePercentage = Math.round((totalProductiveHours / 16) * 100);

  const habitPercentage = initialData.habits.total > 0 
    ? Math.round((initialData.habits.completed / initialData.habits.total) * 100) 
    : 0;

  return (
    <div className="space-y-8">
      {/* LONGEST SESSION INPUT */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Manual Entry</h2>
        <Card className="bg-[#111113] border-white/5 p-5 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <h3 className="font-medium text-white mb-1">Longest Productive Session</h3>
            <p className="text-zinc-400 text-sm">Enter the longest continuous session you had today.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex flex-col items-center">
              <Input 
                type="number" 
                value={sessionHours} 
                onChange={(e) => setSessionHours(parseInt(e.target.value) || 0)}
                className="w-16 h-12 text-center text-lg bg-[#18181B] border-white/10"
                min={0}
              />
              <span className="text-xs text-zinc-500 mt-1">Hours</span>
            </div>
            <span className="text-xl font-bold pb-5">:</span>
            <div className="flex flex-col items-center">
              <Input 
                type="number" 
                value={sessionMinutes} 
                onChange={(e) => setSessionMinutes(parseInt(e.target.value) || 0)}
                className="w-16 h-12 text-center text-lg bg-[#18181B] border-white/10"
                min={0}
                max={59}
              />
              <span className="text-xs text-zinc-500 mt-1">Mins</span>
            </div>
            <Button 
              onClick={saveLongestSession} 
              disabled={isSaving}
              className="ml-4 h-12 bg-blue-600 hover:bg-blue-700 text-white pb-5 self-start"
            >
              Save
            </Button>
          </div>
        </Card>
      </section>

      {/* STATS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* PRODUCTIVITY */}
        <Card className="bg-[#111113] border-white/5 p-5">
          <h3 className="text-zinc-400 text-sm font-medium mb-4 tracking-wide">PRODUCTIVITY</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-300">Total Productive</span>
                <span className="font-bold text-white">{totalProductiveHours}h</span>
              </div>
              <Progress value={productivePercentage} className="h-1.5 bg-white/5 [&>div]:bg-blue-500" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-300">Total Unproductive</span>
              <span className="font-medium text-zinc-400">{unproductiveHours}h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-300">Windows with activity</span>
              <span className="font-medium text-white">{initialData.windows.filter((w: any) => w.productiveHours > 0).length} / 4</span>
            </div>
          </div>
        </Card>

        {/* HABITS */}
        <Card className="bg-[#111113] border-white/5 p-5">
          <h3 className="text-zinc-400 text-sm font-medium mb-4 tracking-wide">HABITS</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-zinc-300">Completion</span>
                <span className="font-bold text-white">{habitPercentage}%</span>
              </div>
              <Progress value={habitPercentage} className="h-1.5 bg-white/5 [&>div]:bg-green-500" />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-300">Completed</span>
              <span className="font-medium text-white">{initialData.habits.completed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-300">Missed</span>
              <span className="font-medium text-zinc-400">{initialData.habits.total - initialData.habits.completed}</span>
            </div>
          </div>
        </Card>

        {/* SLEEP & HEALTH */}
        <Card className="bg-[#111113] border-white/5 p-5">
          <h3 className="text-zinc-400 text-sm font-medium mb-4 tracking-wide">SLEEP & HEALTH</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-300">Sleep Duration</span>
              <span className="font-bold text-white">{initialData.sleep.duration}h</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-300">Sleep Quality</span>
              <span className="font-medium capitalize text-white">{initialData.sleep.quality}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-300">Healthy Meals</span>
              <span className="font-medium text-white">{initialData.health.meals}</span>
            </div>
          </div>
        </Card>

      </section>
    </div>
  );
}
