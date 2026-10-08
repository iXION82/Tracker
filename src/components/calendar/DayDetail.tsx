'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { MOOD_EMOJIS } from '@/types';
import { CheckCircle2, Circle, Clock, Moon, CheckSquare, Square } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface DayDetailProps {
  date: Date;
  habits: any[];
  logs: any[];
  tasks: any[];
  journal: any;
  mood: any;
  sleep: any;
  timeEntries: any[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DayDetail({
  date, habits, logs, tasks, journal, mood, sleep, timeEntries, open, onOpenChange
}: DayDetailProps) {
  
  const completedHabits = logs.filter(l => l.completed).map(l => l.habitId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#111113] border-white/10 text-white max-h-[85vh] p-0 flex flex-col">
        <DialogHeader className="px-6 py-4 border-b border-white/5">
          <DialogTitle className="text-xl flex items-center gap-3">
            {format(date, 'EEEE, MMMM d, yyyy')}
            {mood && (
              <span className="text-2xl" title="Mood">
                {MOOD_EMOJIS[mood.mood as keyof typeof MOOD_EMOJIS]}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            
            {/* Habits Section */}
            {habits.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">Habits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {habits.map(habit => {
                    const isCompleted = completedHabits.includes(habit._id);
                    return (
                      <div key={habit._id} className="flex items-center gap-3 p-3 bg-[#18181B] rounded-lg border border-white/5">
                        {isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <Circle className="w-5 h-5 text-zinc-500" />
                        )}
                        <span className={`text-sm ${isCompleted ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          {habit.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Tasks Section */}
            {tasks.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">Tasks</h3>
                <div className="space-y-2">
                  {tasks.map(task => (
                    <div key={task._id} className="flex items-center gap-3 p-3 bg-[#18181B] rounded-lg border border-white/5">
                      {task.status === 'completed' ? (
                        <CheckSquare className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Square className="w-5 h-5 text-zinc-500" />
                      )}
                      <span className={`text-sm ${task.status === 'completed' ? 'text-zinc-400 line-through' : 'text-zinc-200'}`}>
                        {task.title}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Journal Section */}
            {journal && (
              <section>
                <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider">Journal</h3>
                <Card className="bg-[#18181B] border-white/5 p-4">
                  <h4 className="font-medium text-white mb-2">{journal.title || 'Untitled'}</h4>
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap">{journal.content}</p>
                </Card>
              </section>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Sleep Section */}
              {sleep && (
                <section>
                  <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Moon className="w-4 h-4" /> Sleep
                  </h3>
                  <div className="bg-[#18181B] p-4 rounded-lg border border-white/5">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-zinc-400 text-sm">Duration</span>
                      <span className="text-white font-medium">{sleep.duration} hrs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-400 text-sm">Quality</span>
                      <span className="text-white font-medium">{sleep.quality}/5</span>
                    </div>
                  </div>
                </section>
              )}

              {/* Time Entries Section */}
              {timeEntries.length > 0 && (
                <section>
                  <h3 className="text-sm font-medium text-zinc-400 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Clock className="w-4 h-4" /> Study/Work
                  </h3>
                  <div className="bg-[#18181B] p-4 rounded-lg border border-white/5 space-y-2">
                    {timeEntries.map(entry => (
                      <div key={entry._id} className="flex justify-between items-center">
                        <span className="text-zinc-300 text-sm">{entry.description || 'Session'}</span>
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">
                          {Math.round(entry.duration / 60)} mins
                        </Badge>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {!habits.length && !tasks.length && !journal && !sleep && !timeEntries.length && !mood && (
              <div className="py-8 text-center text-zinc-500">
                No activity recorded for this day.
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
