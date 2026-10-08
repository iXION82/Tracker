'use client';

import { useEffect, useState } from 'react';
import { formatPercentage } from '@/lib/utils';

interface DailyProgressRingProps {
  completed: number;
  total: number;
  label?: string;
  size?: number;
  strokeWidth?: number;
}

export default function DailyProgressRing({
  completed,
  total,
  label = 'habits',
  size = 120,
  strokeWidth = 10,
}: DailyProgressRingProps) {
  const [progress, setProgress] = useState(0);
  const percentage = total > 0 ? (completed / total) * 100 : 0;
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#ffffff10"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-white">{Math.round(percentage)}%</span>
        <span className="text-xs text-zinc-500">{completed} / {total} {label}</span>
      </div>
    </div>
  );
}
