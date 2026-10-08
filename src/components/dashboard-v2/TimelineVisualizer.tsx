"use client";

import { TimeWindow } from "./constants";
import { cn } from "@/lib/utils";

interface TimelineVisualizerProps {
  windows: Record<TimeWindow, { hours: number, mood?: string, note?: string }>;
}

const MOOD_TO_EMOJI: Record<string, string> = {
  'Highly Motivated': '🔥',
  'Motivated': '💪',
  'Focused': '⚡',
  'Calm': '😌',
  'Neutral': '😐',
  'Tired': '😴',
  'Unfocused': '😕',
  'Frustrated': '😡',
  'Stressed': '😣',
  'Low': '😞'
};

export function TimelineVisualizer({ windows }: TimelineVisualizerProps) {
  // Rendered top to bottom, which means visually 12 AM is at the top, 8 AM at the bottom.
  // The flex space below a node represents the time *before* that node.
  // So the space below 12 AM represents 8 PM -> 12 AM (the 'night' window).
  const times = [
    { label: '12 AM', endOf: 'night' },
    { label: '8 PM', endOf: 'evening' },
    { label: '4 PM', endOf: 'afternoon' },
    { label: '12 PM', endOf: 'morning' },
    { label: '8 AM', endOf: null } // Bottom node
  ];

  return (
    <div className="bg-[#111113] border border-white/5 rounded-xl p-6 h-full overflow-hidden flex flex-col">
      <h3 className="text-zinc-400 text-xs tracking-widest font-medium mb-6 uppercase">Daily Timeline</h3>
      
      <div className="relative flex-1 flex flex-col">
        {/* Base vertical line perfectly centered in the 36px nodes */}
        <div className="absolute left-[15px] top-[18px] bottom-[18px] w-1.5 bg-[#18181B] rounded-full z-0"></div>
        
        <div className="flex flex-col justify-between h-full relative z-10">
          {times.map((time, i) => {
            const isBottom = i === times.length - 1; // 8 AM
            const windowKey = time.endOf as TimeWindow | null;
            const data = windowKey ? windows[windowKey] : null;
            const hasHours = data && data.hours > 0;
            
            return (
              <div 
                key={time.label} 
                className="flex items-start gap-4 relative group"
                style={{ flex: isBottom ? 'none' : '1' }}
              >
                {/* Animated Productive hours fill */}
                {/* Parent height = exactly the distance between node centers. 
                    Anchoring at -18px bottom makes it originate exactly at the next node's center.
                    100% height makes it reach exactly this node's center. */}
                {!isBottom && data && hasHours && (
                  <div 
                    className={cn(
                      "absolute left-[15px] -bottom-[18px] w-1.5 z-0 transition-all duration-1000 ease-out origin-bottom",
                      "bg-gradient-to-t from-blue-500 via-indigo-400 to-purple-500",
                      "bg-[length:auto_200%] animate-[gradient_3s_linear_infinite] rounded-full"
                    )}
                    style={{ height: `${Math.min(data.hours / 4 * 100, 100)}%` }}
                  />
                )}

                {/* Node */}
                <div 
                  className={cn(
                    "w-9 h-9 shrink-0 rounded-full flex items-center justify-center z-10 transition-all duration-300 relative",
                    "border-4 border-[#111113] shadow-md",
                    data?.mood ? "bg-[#1A1A1E]" : "bg-[#18181B]",
                    hasHours && "ring-2 ring-indigo-500/30"
                  )}
                >
                  <span className="text-sm">
                    {data?.mood ? MOOD_TO_EMOJI[data.mood] || '😐' : ''}
                  </span>
                </div>
                
                <div className="flex flex-col pt-1.5 pb-8 min-h-[70px] w-full">
                  {/* Time Label */}
                  <div className="text-xs text-zinc-500 font-medium tracking-wide">
                    {time.label}
                  </div>
                  
                  {/* Info card (shows the data that ENDS at this time) */}
                  {data && (data.hours > 0 || data.note) && (
                    <div className="mt-2 w-full transition-opacity opacity-70 group-hover:opacity-100 pr-2">
                      <div className="bg-[#18181B] border border-white/5 p-3 rounded-lg text-xs flex flex-col gap-1.5 shadow-sm max-w-[220px]">
                        <div className="flex items-center gap-3 text-white font-medium w-full overflow-hidden">
                          <span className="text-indigo-400 font-bold shrink-0">{data.hours}h</span>
                          {data.mood && (
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider truncate">
                              {data.mood}
                            </span>
                          )}
                        </div>
                        {data.note && (
                          <div className="text-zinc-400 leading-relaxed border-t border-white/5 pt-1.5 mt-0.5">
                            {data.note}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
