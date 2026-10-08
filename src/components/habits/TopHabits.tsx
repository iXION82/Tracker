'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TopHabitsProps {
  habits: Array<{ id: string; name: string; color: string; completionRate: number }>;
}

export default function TopHabits({ habits }: TopHabitsProps) {
  const sorted = [...habits].sort((a, b) => b.completionRate - a.completionRate).slice(0, 10);

  return (
    <Card className="w-full bg-[#111113] border-white/5 h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">Top Habits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-4">
          {sorted.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-4">No data available</p>
          ) : (
            sorted.map((habit, idx) => (
              <div key={habit.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#18181B] flex items-center justify-center text-xs text-zinc-500 font-medium">
                    {idx + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color }} />
                    <span className="text-sm text-zinc-300">{habit.name}</span>
                  </div>
                </div>
                <span className="text-sm font-medium" style={{ color: habit.color }}>
                  {Math.round(habit.completionRate * 100)}%
                </span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
