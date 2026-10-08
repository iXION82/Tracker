'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Minus, Plus, Play, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodayHabitsProps {
  initialHabits: any[];
  initialLogs: any[];
}

export default function TodayHabits({ initialHabits, initialLogs }: TodayHabitsProps) {
  const [habits] = useState(initialHabits);
  const [logs, setLogs] = useState<Record<string, any>>(
    initialLogs.reduce((acc, log) => ({ ...acc, [log.habitId]: log }), {})
  );

  const handleToggle = async (habitId: string, completed: boolean, value?: number) => {
    const habit = habits.find(h => h._id === habitId);
    if (!habit) return;

    const previousLog = logs[habitId];
    
    // Optimistic update
    const newLog = {
      habitId,
      date: new Date().toISOString(),
      completed,
      value: value !== undefined ? value : (completed ? 1 : 0),
    };
    
    setLogs(prev => ({ ...prev, [habitId]: newLog }));
    if (completed && !previousLog?.completed) {
      toast.success(`${habit.name} completed! 🎉`);
    }

    try {
      const res = await fetch('/api/habits/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog),
      });

      if (!res.ok) throw new Error('Failed to update habit');
    } catch (error) {
      // Rollback
      if (previousLog) {
        setLogs(prev => ({ ...prev, [habitId]: previousLog }));
      } else {
        const newLogs = { ...logs };
        delete newLogs[habitId];
        setLogs(newLogs);
      }
      toast.error('Failed to update habit. Reverting.');
    }
  };

  const renderHabitControl = (habit: any, log: any) => {
    const isCompleted = log?.completed || false;
    const value = log?.value || 0;

    switch (habit.type) {
      case 'boolean':
        return (
          <Checkbox 
            checked={isCompleted} 
            onCheckedChange={(checked) => handleToggle(habit._id, checked as boolean)} 
            className="w-6 h-6 rounded-full border-zinc-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          />
        );
      case 'numeric':
        return (
          <div className="flex items-center gap-2">
            <Input 
              type="number" 
              value={value}
              onChange={(e) => {
                const val = Number(e.target.value);
                handleToggle(habit._id, val >= habit.target, val);
              }}
              className="w-20 bg-[#18181B] border-white/10 h-8 text-right"
            />
            <span className="text-zinc-400 text-sm">{habit.unit}</span>
          </div>
        );
      case 'count':
        return (
          <div className="flex items-center gap-3 bg-[#18181B] rounded-lg p-1 border border-white/5">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-md hover:bg-zinc-800"
              onClick={() => {
                const newVal = Math.max(0, value - 1);
                handleToggle(habit._id, newVal >= habit.target, newVal);
              }}
            >
              <Minus className="w-3 h-3 text-zinc-400" />
            </Button>
            <span className="w-6 text-center font-medium text-white">{value}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 rounded-md hover:bg-zinc-800"
              onClick={() => {
                const newVal = value + 1;
                handleToggle(habit._id, newVal >= habit.target, newVal);
              }}
            >
              <Plus className="w-3 h-3 text-zinc-400" />
            </Button>
          </div>
        );
      case 'timer':
        return (
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-[#18181B] border-white/10 hover:bg-zinc-800 hover:text-white"
            onClick={() => handleToggle(habit._id, true, habit.target)}
          >
            <Play className="w-3 h-3 mr-2" />
            {habit.target} min
          </Button>
        );
      default:
        return (
          <Checkbox 
            checked={isCompleted} 
            onCheckedChange={(checked) => handleToggle(habit._id, checked as boolean)} 
            className="w-6 h-6 rounded-full border-zinc-500 data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
          />
        );
    }
  };

  const sections = ['Morning', 'Work', 'Evening', 'Night', 'Anytime'];
  const groupedHabits = sections.reduce((acc, section) => {
    acc[section] = habits.filter(h => (h.section || 'Anytime') === section);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      {sections.map(section => {
        const sectionHabits = groupedHabits[section];
        if (!sectionHabits || sectionHabits.length === 0) return null;

        const completedCount = sectionHabits.filter(h => logs[h._id]?.completed).length;
        const progress = (completedCount / sectionHabits.length) * 100;

        return (
          <div key={section} className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-medium text-white">{section}</h3>
              <span className="text-sm text-zinc-500">{completedCount} / {sectionHabits.length}</span>
            </div>
            
            <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="space-y-2 mt-3">
              {sectionHabits.map(habit => (
                <Card 
                  key={habit._id} 
                  className={cn(
                    "bg-[#111113] border-white/5 rounded-xl p-3 flex items-center justify-between transition-colors",
                    logs[habit._id]?.completed ? "opacity-60 bg-[#0A0A0B]" : "hover:bg-[#18181B]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: habit.color || '#3b82f6' }} />
                    <span className="text-lg">{habit.icon}</span>
                    <div>
                      <div className={cn("font-medium text-white transition-all", logs[habit._id]?.completed && "line-through text-zinc-500")}>
                        {habit.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-zinc-500 px-1.5 py-0.5 rounded-md bg-[#18181B]">
                          {habit.category?.name || 'General'}
                        </span>
                        {habit.streak > 0 && (
                          <span className="text-xs text-orange-400 flex items-center gap-1">
                            <Flame className="w-3 h-3" /> {habit.streak}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {renderHabitControl(habit, logs[habit._id])}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
