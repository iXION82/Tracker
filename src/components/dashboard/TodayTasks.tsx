'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Plus, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodayTasksProps {
  initialTasks: any[];
}

export default function TodayTasks({ initialTasks }: TodayTasksProps) {
  const [tasks, setTasks] = useState(initialTasks);

  const handleToggle = async (taskId: string, completed: boolean) => {
    const taskIndex = tasks.findIndex(t => t._id === taskId);
    if (taskIndex === -1) return;

    const originalTask = tasks[taskIndex];
    
    // Optimistic update
    const newTasks = [...tasks];
    newTasks[taskIndex] = { ...originalTask, completed, completedAt: completed ? new Date().toISOString() : null };
    setTasks(newTasks);

    if (completed) {
      toast.success('Task completed!');
    }

    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed, completedAt: completed ? new Date().toISOString() : null }),
      });

      if (!res.ok) throw new Error('Failed to update task');
    } catch (error) {
      // Rollback
      const revertTasks = [...tasks];
      revertTasks[taskIndex] = originalTask;
      setTasks(revertTasks);
      toast.error('Failed to update task.');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'low': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-white">Today's Tasks</h3>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center py-6 text-zinc-500 text-sm bg-[#111113] rounded-xl border border-white/5">
          No tasks for today. Enjoy your day!
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map(task => (
            <Card 
              key={task._id} 
              className={cn(
                "bg-[#111113] border-white/5 rounded-xl p-3 flex items-start gap-3 transition-colors hover:bg-[#18181B]",
                task.completed && "opacity-60 bg-[#0A0A0B]"
              )}
            >
              <Checkbox 
                checked={task.completed} 
                onCheckedChange={(checked) => handleToggle(task._id, checked as boolean)} 
                className="mt-1 w-5 h-5 rounded border-zinc-500 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <div className="flex-1">
                <div className={cn("font-medium text-white text-sm transition-all", task.completed && "line-through text-zinc-500")}>
                  {task.title}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded border uppercase tracking-wider font-semibold", getPriorityColor(task.priority))}>
                    {task.priority || 'None'}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-zinc-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Button variant="outline" className="w-full mt-4 bg-[#111113] border-white/5 hover:bg-[#18181B] text-zinc-400">
        <Plus className="w-4 h-4 mr-2" />
        Add Task
      </Button>
    </div>
  );
}
