'use client';

import { useState } from 'react';
import { 
  startOfMonth, endOfMonth, eachDayOfInterval, 
  format, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MOOD_EMOJIS } from '@/types';
import DayDetail from './DayDetail';
import { cn } from '@/lib/utils';

interface CalendarViewProps {
  initialDate?: Date;
  habitLogs: any[];
  tasks: any[];
  journalEntries: any[];
  moodEntries: any[];
  sleepEntries: any[];
  timeEntries: any[];
  habits: any[];
}

export default function CalendarView({
  initialDate = new Date(),
  habitLogs, tasks, journalEntries, moodEntries, sleepEntries, timeEntries, habits
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#111113] p-4 rounded-xl border border-white/5">
        <h2 className="text-xl font-semibold text-white">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth} className="bg-transparent border-white/10 text-white hover:bg-white/5">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button variant="outline" onClick={() => setCurrentDate(new Date())} className="bg-transparent border-white/10 text-white hover:bg-white/5">
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth} className="bg-transparent border-white/10 text-white hover:bg-white/5">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/10">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <div key={day} className="bg-[#18181B] py-3 text-center text-xs font-medium text-zinc-400 uppercase tracking-wider">
            {day}
          </div>
        ))}

        {days.map(day => {
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          // Data for this day
          const dayHabitLogs = habitLogs.filter(l => isSameDay(new Date(l.date), day));
          const dayTasks = tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), day));
          const dayJournal = journalEntries.find(j => isSameDay(new Date(j.date), day));
          const dayMood = moodEntries.find(m => isSameDay(new Date(m.date), day));
          const daySleep = sleepEntries.find(s => isSameDay(new Date(s.date), day));
          const dayTime = timeEntries.filter(t => isSameDay(new Date(t.startTime), day));

          const completedHabits = dayHabitLogs.filter(l => l.completed).length;
          const totalHabits = habits.length;
          const habitProgress = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

          return (
            <div 
              key={day.toISOString()}
              onClick={() => setSelectedDay(day)}
              className={cn(
                "min-h-[120px] bg-[#111113] p-2 transition-colors cursor-pointer hover:bg-[#18181B] relative flex flex-col gap-1",
                !isCurrentMonth && "opacity-40",
                isToday && "bg-blue-900/10"
              )}
            >
              <div className="flex justify-between items-start">
                <span className={cn(
                  "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                  isToday ? "bg-blue-600 text-white" : "text-zinc-300"
                )}>
                  {format(day, 'd')}
                </span>
                {dayMood && (
                  <span className="text-lg" title={`Mood: ${dayMood.mood}`}>
                    {MOOD_EMOJIS[dayMood.mood as keyof typeof MOOD_EMOJIS]?.emoji}
                  </span>
                )}
              </div>

              <div className="flex-1 mt-1 space-y-1">
                {totalHabits > 0 && (
                  <div className="w-full bg-[#18181B] rounded-full h-1.5 mt-1 overflow-hidden" title={`${completedHabits}/${totalHabits} habits`}>
                    <div 
                      className="bg-green-500 h-full rounded-full transition-all"
                      style={{ width: `${habitProgress}%` }}
                    />
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {dayTasks.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/20">
                      {dayTasks.length} tasks
                    </span>
                  )}
                  {dayJournal && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/20">
                      journal
                    </span>
                  )}
                  {dayTime.length > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/20">
                      {Math.round(dayTime.reduce((acc, curr) => acc + curr.duration, 0) / 60)}h work
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <DayDetail 
          date={selectedDay}
          habits={habits}
          logs={habitLogs.filter(l => isSameDay(new Date(l.date), selectedDay))}
          tasks={tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), selectedDay))}
          journal={journalEntries.find(j => isSameDay(new Date(j.date), selectedDay))}
          mood={moodEntries.find(m => isSameDay(new Date(m.date), selectedDay))}
          sleep={sleepEntries.find(s => isSameDay(new Date(s.date), selectedDay))}
          timeEntries={timeEntries.filter(t => isSameDay(new Date(t.startTime), selectedDay))}
          open={!!selectedDay}
          onOpenChange={(open) => !open && setSelectedDay(null)}
        />
      )}
    </div>
  );
}
