'use client';

import { Card } from '@/components/ui/card';
import { Target, Flame, CheckSquare, ListTodo, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsProps {
  stats: {
    dailyCompletion: number;
    currentStreak: number;
    habitsCompleted: number;
    habitsTotal: number;
    tasksCompleted: number;
    tasksTotal: number;
    productivity: number;
  };
}

export default function SummaryCards({ stats }: StatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
      <Card className="bg-[#111113] border-white/10 rounded-xl p-4 hover:scale-105 transition-transform duration-200">
        <div className="flex items-center gap-2 text-zinc-400 mb-2 text-sm">
          <Target className="w-4 h-4 text-blue-400" />
          Daily Completion
        </div>
        <div className="text-2xl font-bold text-white">
          {stats.dailyCompletion.toFixed(0)}%
        </div>
      </Card>
      
      <Card className="bg-[#111113] border-white/10 rounded-xl p-4 hover:scale-105 transition-transform duration-200">
        <div className="flex items-center gap-2 text-zinc-400 mb-2 text-sm">
          <Flame className="w-4 h-4 text-orange-500" />
          Current Streak
        </div>
        <div className="text-2xl font-bold text-white">
          {stats.currentStreak} <span className="text-sm font-normal text-zinc-500">days</span>
        </div>
      </Card>

      <Card className="bg-[#111113] border-white/10 rounded-xl p-4 hover:scale-105 transition-transform duration-200">
        <div className="flex items-center gap-2 text-zinc-400 mb-2 text-sm">
          <CheckSquare className="w-4 h-4 text-green-400" />
          Habits
        </div>
        <div className="text-2xl font-bold text-white">
          {stats.habitsCompleted} <span className="text-sm font-normal text-zinc-500">/ {stats.habitsTotal}</span>
        </div>
      </Card>

      <Card className="bg-[#111113] border-white/10 rounded-xl p-4 hover:scale-105 transition-transform duration-200">
        <div className="flex items-center gap-2 text-zinc-400 mb-2 text-sm">
          <ListTodo className="w-4 h-4 text-purple-400" />
          Tasks
        </div>
        <div className="text-2xl font-bold text-white">
          {stats.tasksCompleted} <span className="text-sm font-normal text-zinc-500">/ {stats.tasksTotal}</span>
        </div>
      </Card>

      <Card className="bg-[#111113] border-white/10 rounded-xl p-4 hover:scale-105 transition-transform duration-200">
        <div className="flex items-center gap-2 text-zinc-400 mb-2 text-sm">
          <Zap className="w-4 h-4 text-cyan-400" />
          Productivity
        </div>
        <div className="text-2xl font-bold text-white">
          {stats.productivity.toFixed(0)}%
        </div>
      </Card>
    </div>
  );
}
