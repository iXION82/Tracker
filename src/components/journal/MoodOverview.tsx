'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MOOD_EMOJIS } from '@/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';

interface MoodOverviewProps {
  moodEntries: any[];
}

export default function MoodOverview({ moodEntries }: MoodOverviewProps) {
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start, end });

  const moodCounts = [1, 2, 3, 4, 5].map(level => ({
    level,
    count: moodEntries.filter(e => e.mood === level).length
  }));

  const avgMood = moodEntries.length 
    ? moodEntries.reduce((acc, curr) => acc + curr.mood, 0) / moodEntries.length 
    : 0;

  return (
    <Card className="bg-[#111113] border-white/5">
      <CardHeader>
        <CardTitle className="text-lg text-white">Mood Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#18181B] p-4 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-zinc-400 text-sm mb-1">Average Mood</span>
            <div className="text-3xl font-semibold text-white flex items-center gap-2">
              {avgMood > 0 ? MOOD_EMOJIS[Math.round(avgMood) as keyof typeof MOOD_EMOJIS] : '-'}
              <span className="text-xl">{avgMood > 0 ? avgMood.toFixed(1) : '-'}</span>
            </div>
          </div>
          <div className="bg-[#18181B] p-4 rounded-xl border border-white/5 flex flex-col items-center">
            <span className="text-zinc-400 text-sm mb-1">Total Entries</span>
            <div className="text-3xl font-semibold text-white">{moodEntries.length}</div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div>
          <h3 className="text-sm font-medium text-zinc-300 mb-3">This Month</h3>
          <div className="grid grid-cols-7 gap-1">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
              <div key={day} className="text-center text-xs text-zinc-500 py-1">{day}</div>
            ))}
            {/* Empty cells for offset */}
            {Array.from({ length: start.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square rounded-md bg-transparent" />
            ))}
            {/* Days */}
            {daysInMonth.map(date => {
              const entry = moodEntries.find(e => isSameDay(new Date(e.date), date));
              return (
                <div 
                  key={date.toISOString()}
                  className="aspect-square rounded-md bg-[#18181B] border border-white/5 flex items-center justify-center text-lg"
                  title={format(date, 'MMM d, yyyy')}
                >
                  {entry ? MOOD_EMOJIS[entry.mood as keyof typeof MOOD_EMOJIS] : ''}
                </div>
              );
            })}
          </div>
        </div>

        {/* Distribution */}
        <div>
          <h3 className="text-sm font-medium text-zinc-300 mb-3">Distribution</h3>
          <div className="space-y-2">
            {moodCounts.reverse().map(({ level, count }) => (
              <div key={level} className="flex items-center gap-3 text-sm">
                <span className="text-lg w-6">{MOOD_EMOJIS[level as keyof typeof MOOD_EMOJIS]}</span>
                <div className="flex-1 h-2 bg-[#18181B] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 rounded-full" 
                    style={{ width: `${moodEntries.length ? (count / moodEntries.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-zinc-400 w-6 text-right">{count}</span>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
