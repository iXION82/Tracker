"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

export default function BadHabitsClient({ initialData }: { initialData: any[] }) {
  const [habits, setHabits] = useState(initialData);

  const formatMinutes = (mins: number) => {
    if (mins < 60) return `${mins}m`;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  };

  const handleUpdate = async (id: string, mins: number) => {
    const newHabits = habits.map(h => h._id === id ? { ...h, durationMinutes: mins } : h);
    setHabits(newHabits);
    
    try {
      const res = await fetch('/api/bad-habits/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ badHabitId: id, durationMinutes: mins })
      });
      if (!res.ok) throw new Error('Failed');
    } catch(e) {
      toast.error("Failed to update time");
    }
  };

  const totalDistraction = habits.reduce((acc, h) => acc + h.durationMinutes, 0);

  return (
    <div className="space-y-8">
      <Card className="bg-[#111113] border-white/5 p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50"></div>
        <h3 className="text-zinc-400 text-sm font-medium tracking-wide mb-2">TOTAL DISTRACTION TODAY</h3>
        <div className="text-4xl font-bold text-white mb-2">{formatMinutes(totalDistraction)}</div>
      </Card>

      <div className="grid gap-4">
        {habits.map(habit => {
          const isOver = habit.durationMinutes > habit.dailyLimitMinutes;
          const percentage = Math.min((habit.durationMinutes / habit.dailyLimitMinutes) * 100, 100);
          
          return (
            <Card key={habit._id} className="bg-[#111113] border-white/5 p-5 flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg text-white">{habit.name}</h3>
                  <div className="text-sm font-medium">
                    <span className="text-white">{formatMinutes(habit.durationMinutes)}</span>
                    <span className="text-zinc-500"> / {formatMinutes(habit.dailyLimitMinutes)} limit</span>
                  </div>
                </div>
                
                <Progress 
                  value={percentage} 
                  className={`h-2 bg-white/5 mb-2 ${isOver ? "[&>div]:bg-red-500" : "[&>div]:bg-orange-500"}`}
                />
                
                {isOver ? (
                  <div className="text-xs text-red-400 font-medium">
                    ⚠ {formatMinutes(habit.durationMinutes - habit.dailyLimitMinutes)} over limit
                  </div>
                ) : (
                  <div className="text-xs text-green-400 font-medium">
                    ✓ Within limit
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 bg-[#18181B] p-2 rounded-lg border border-white/5">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleUpdate(habit._id, Math.max(0, habit.durationMinutes - 15))}
                  className="h-8 w-8 p-0"
                >-</Button>
                <div className="w-16 text-center text-sm font-medium">
                  {formatMinutes(habit.durationMinutes)}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleUpdate(habit._id, habit.durationMinutes + 15)}
                  className="h-8 w-8 p-0"
                >+</Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
