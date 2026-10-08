'use client';

import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CategoryBreakdown {
  category: string;
  score: number;
  weight: number;
  color: string;
}

interface LifeScoreProps {
  score: number;
  breakdown: CategoryBreakdown[];
}

export default function LifeScoreWidget({ score, breakdown }: LifeScoreProps) {
  // Calculate stroke dasharray for circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="bg-[#111113] border-white/10 rounded-xl p-5">
      <h3 className="text-lg font-medium text-white mb-6">Life Score</h3>
      
      <div className="flex justify-center mb-8">
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg className="transform -rotate-90 w-32 h-32">
            <circle
              cx="64"
              cy="64"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-zinc-800"
            />
            <circle
              cx="64"
              cy="64"
              r="40"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-white">{Math.round(score)}</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Score</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {breakdown.map((item) => (
          <div key={item.category} className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-zinc-400">{item.category}</span>
              <span className="text-white">{Math.round(item.score)}%</span>
            </div>
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ 
                  width: `${item.score}%`, 
                  backgroundColor: item.color || '#3b82f6' 
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
