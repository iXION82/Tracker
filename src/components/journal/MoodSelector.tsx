'use client';

import { cn } from '@/lib/utils';
import { MOOD_EMOJIS } from '@/types';

interface MoodSelectorProps {
  value: number;
  onChange: (value: number) => void;
  showLabels?: boolean;
}

export default function MoodSelector({ value, onChange, showLabels }: MoodSelectorProps) {
  const moods = [
    { level: 1, label: 'Terrible', emoji: MOOD_EMOJIS[1] || '😞' },
    { level: 2, label: 'Bad', emoji: MOOD_EMOJIS[2] || '😔' },
    { level: 3, label: 'Okay', emoji: MOOD_EMOJIS[3] || '😐' },
    { level: 4, label: 'Good', emoji: MOOD_EMOJIS[4] || '🙂' },
    { level: 5, label: 'Great', emoji: MOOD_EMOJIS[5] || '😄' },
  ];

  return (
    <div className="flex justify-between items-center gap-2">
      {moods.map((mood) => (
        <button
          key={mood.level}
          type="button"
          onClick={() => onChange(mood.level)}
          className={cn(
            'flex flex-col items-center justify-center p-2 rounded-xl transition-all duration-200 border-2',
            value === mood.level
              ? 'border-blue-500 bg-blue-500/10 scale-110'
              : 'border-transparent hover:bg-white/5 hover:scale-105'
          )}
        >
          <span className="text-3xl">{mood.emoji}</span>
          {showLabels && (
            <span className={cn('text-xs mt-1 font-medium', value === mood.level ? 'text-blue-500' : 'text-zinc-500')}>
              {mood.label}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
