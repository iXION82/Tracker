"use client";

import { Progress } from "@/components/ui/progress";

interface ProductivitySummaryProps {
  totalHours: number;
  goalHours: number;
  tenHourStreak: number;
  onePercentStreak: number;
  longSessionStreak: number;
}

export function ProductivitySummary({ 
  totalHours, 
  goalHours, 
  tenHourStreak, 
  onePercentStreak, 
  longSessionStreak 
}: ProductivitySummaryProps) {
  const percentage = Math.round((totalHours / goalHours) * 100);
  const remaining = Math.max(0, goalHours - totalHours);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="md:col-span-2 bg-[#111113] border border-white/5 rounded-xl p-5 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 opacity-50"></div>
        
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-zinc-400 text-sm font-medium mb-1">TODAY'S PRODUCTIVITY</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">{totalHours}</span>
              <span className="text-xl text-zinc-500">/ {goalHours}h</span>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-2xl font-bold text-blue-400">{percentage}%</span>
            <p className="text-xs text-zinc-500 mt-1">
              {totalHours >= goalHours ? "🎯 Goal Completed!" : `${remaining}h remaining`}
            </p>
          </div>
        </div>
        
        <Progress value={Math.min(percentage, 100)} className="h-2 bg-white/5" />
      </div>
      
      <div className="bg-[#111113] border border-white/5 rounded-xl p-5 flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🔥</span>
          <h3 className="text-zinc-400 text-sm font-medium">10 HOUR STREAK</h3>
        </div>
        <div className="text-2xl font-bold text-white">{tenHourStreak} <span className="text-sm font-normal text-zinc-500">days</span></div>
      </div>
      
      <div className="bg-[#111113] border border-white/5 rounded-xl p-5 flex flex-col justify-center space-y-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">📈</span>
            <h3 className="text-zinc-400 text-xs font-medium">1% BETTER</h3>
          </div>
          <div className="text-lg font-bold text-white">{onePercentStreak} <span className="text-xs font-normal text-zinc-500">days</span></div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm">⚡</span>
            <h3 className="text-zinc-400 text-xs font-medium">LONG SESSION</h3>
          </div>
          <div className="text-lg font-bold text-white">{longSessionStreak} <span className="text-xs font-normal text-zinc-500">days</span></div>
        </div>
      </div>
    </div>
  );
}
