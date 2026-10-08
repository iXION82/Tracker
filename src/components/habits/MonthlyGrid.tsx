'use client';

import { cn } from '@/lib/utils';
import { IHabit } from '@/types';
import { Card } from '@/components/ui/card';
import HabitForm from '@/components/habits/HabitForm';

interface MonthlyGridProps {
  habits: IHabit[];
  logs: Record<string, Record<string, any>>;
  year: number;
  month: number;
  onToggle: (habitId: string, day: number) => void;
  onHabitUpdate?: () => void;
}

export default function MonthlyGrid({ habits, logs, year, month, onToggle, onHabitUpdate }: MonthlyGridProps) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const today = new Date();
  const currentDay = today.getFullYear() === year && today.getMonth() + 1 === month ? today.getDate() : -1;

  const getWeekColor = (day: number) => {
    const week = Math.ceil(day / 7);
    switch(week) {
      case 1: return 'bg-green-500/10 text-green-500';
      case 2: return 'bg-cyan-500/10 text-cyan-500';
      case 3: return 'bg-blue-500/10 text-blue-500';
      case 4: return 'bg-purple-500/10 text-purple-500';
      default: return 'bg-pink-500/10 text-pink-500';
    }
  };

  return (
    <Card className="w-full bg-[#111113] border-white/5 overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-max p-4">
          <div className="flex mb-2">
            <div className="w-48 shrink-0"></div>
            <div className="flex flex-1">
              {days.map(day => (
                <div 
                  key={`header-${day}`} 
                  className={cn(
                    "w-8 h-8 flex items-center justify-center text-xs rounded-sm mx-[2px]",
                    day === currentDay ? "bg-white/10 text-white font-bold" : "text-zinc-500",
                    (day - 1) % 7 === 0 && day !== 1 ? "ml-3" : ""
                  )}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex mb-4">
            <div className="w-48 shrink-0"></div>
            <div className="flex flex-1">
              {[1, 2, 3, 4, 5].map(week => {
                const startDay = (week - 1) * 7 + 1;
                if (startDay > daysInMonth) return null;
                const endDay = Math.min(week * 7, daysInMonth);
                const span = endDay - startDay + 1;
                return (
                  <div 
                    key={`week-${week}`}
                    className={cn(
                      "h-1 rounded-full mx-[2px]",
                      week > 1 ? "ml-3" : "",
                      getWeekColor(startDay)
                    )}
                    style={{ width: `calc(${span * 32}px + ${(span - 1) * 4}px)` }}
                  />
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            {habits.map(habit => (
              <div key={habit._id as string} className="flex items-center group">
                <div className="w-48 shrink-0 flex items-center gap-2 pr-4 justify-between">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: habit.color || '#3b82f6' }} />
                    <span className="text-sm text-zinc-300 truncate group-hover:text-white transition-colors">{habit.name}</span>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <HabitForm habit={habit} onSuccess={onHabitUpdate} />
                  </div>
                </div>
                <div className="flex flex-1">
                  {days.map(day => {
                    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const hid = habit._id as string;
                    const isCompleted = logs[hid]?.[dateStr]?.completed;
                    const isFuture = day > currentDay && currentDay !== -1;
                    
                    return (
                      <button
                        key={`${hid}-${day}`}
                        onClick={() => {
                          if (!isFuture) {
                            onToggle(hid, day);
                          }
                        }}
                        disabled={isFuture}
                        className={cn(
                          "w-8 h-8 rounded mx-[2px] flex items-center justify-center transition-all",
                          (day - 1) % 7 === 0 && day !== 1 ? "ml-3" : "",
                          isCompleted ? "" : "bg-[#18181B] border border-white/5 hover:border-white/20",
                          isFuture ? "opacity-30 cursor-not-allowed" : "cursor-pointer"
                        )}
                        style={isCompleted ? { backgroundColor: habit.color || '#3b82f6' } : {}}
                        title={`${dateStr} - ${habit.name}`}
                      >
                        {isCompleted && (
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
