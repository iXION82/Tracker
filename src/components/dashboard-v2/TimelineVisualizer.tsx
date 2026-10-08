"use client";

import { TimeWindow } from "./constants";

interface TimelineVisualizerProps {
  windows: Record<TimeWindow, { hours: number, mood?: string, note?: string }>;
}

export function TimelineVisualizer({ windows }: TimelineVisualizerProps) {
  const times = [
    { label: '8 AM', key: 'morning' },
    { label: '12 PM', key: 'afternoon' },
    { label: '4 PM', key: 'evening' },
    { label: '8 PM', key: 'night' },
    { label: '12 AM', key: null }
  ];

  return (
    <div className="bg-[#111113] border border-white/5 rounded-xl p-6 mt-8">
      <h3 className="text-zinc-400 text-sm font-medium mb-6">DAILY TIMELINE</h3>
      
      <div className="relative">
        {/* Base line */}
        <div className="absolute top-3 left-0 w-full h-1 bg-white/5 rounded-full"></div>
        
        <div className="flex justify-between relative">
          {times.map((time, i) => {
            const isLast = i === times.length - 1;
            const windowKey = time.key as TimeWindow;
            const data = !isLast ? windows[windowKey] : null;
            
            // Width of the segment
            const width = "calc(100% / 4)";
            
            return (
              <div key={time.label} className="flex flex-col items-center relative" style={{ width: isLast ? 'auto' : width, alignItems: 'flex-start' }}>
                {/* Node */}
                <div className="w-7 h-7 rounded-full bg-[#18181B] border-2 border-[#111113] flex items-center justify-center z-10 shadow-[0_0_0_2px_rgba(255,255,255,0.05)] text-[10px]">
                  {data && data.mood ? data.mood.split(' ')[0] : ''}
                </div>
                
                {/* Label */}
                <div className="text-xs text-zinc-500 mt-2 font-medium">{time.label}</div>
                
                {/* Productive hours fill */}
                {!isLast && data && data.hours > 0 && (
                  <div 
                    className="absolute top-3 left-3 h-1 bg-blue-500 rounded-full z-0 transition-all"
                    style={{ width: `calc(${Math.min(data.hours / 4 * 100, 100)}% + 14px)` }}
                  ></div>
                )}
                
                {/* Tooltip info */}
                {!isLast && data && (data.hours > 0 || data.note) && (
                  <div className="mt-3 bg-white/5 p-2 rounded text-xs border border-white/5 max-w-[90%] break-words">
                    {data.hours > 0 && <div className="text-white font-medium mb-1">{data.hours}h</div>}
                    {data.note && <div className="text-zinc-400 line-clamp-2">{data.note}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
