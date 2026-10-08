'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ActivityHeatmapProps {
  data: Array<{ date: string; level: number }>;
}

export default function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<{ date: string; level: number; x: number; y: number } | null>(null);

  const weeks = 52;
  const days = 7;
  
  const getColor = (level: number) => {
    switch (level) {
      case 1: return '#0e4429';
      case 2: return '#006d32';
      case 3: return '#26a641';
      case 4: return '#39d353';
      default: return '#161b22';
    }
  };

  const grid = Array.from({ length: weeks }, (_, wIndex) => 
    Array.from({ length: days }, (_, dIndex) => {
      const dataPoint = data[wIndex * days + dIndex] || { date: `2024-W${wIndex}-D${dIndex}`, level: Math.floor(Math.random() * 5) };
      return dataPoint;
    })
  );

  return (
    <Card className="w-full bg-[#111113] border-white/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative overflow-x-auto pb-4">
          <svg width={weeks * 14} height={days * 14 + 20} className="min-w-max">
            <g transform="translate(0, 20)">
              {grid.map((week, w) => (
                <g key={`week-${w}`} transform={`translate(${w * 14}, 0)`}>
                  {week.map((day, d) => (
                    <rect
                      key={`day-${w}-${d}`}
                      width={10}
                      height={10}
                      y={d * 14}
                      fill={getColor(day.level)}
                      rx={2}
                      onMouseEnter={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setHoveredCell({
                          date: day.date,
                          level: day.level,
                          x: rect.x + 5,
                          y: rect.y - 10
                        });
                      }}
                      onMouseLeave={() => setHoveredCell(null)}
                      className="transition-colors duration-200 cursor-pointer"
                    />
                  ))}
                </g>
              ))}
            </g>
          </svg>
          {hoveredCell && (
            <div 
              className="fixed z-50 bg-[#18181B] text-white text-xs p-2 rounded shadow-xl border border-white/10 pointer-events-none transform -translate-x-1/2 -translate-y-full"
              style={{ left: hoveredCell.x, top: hoveredCell.y }}
            >
              {hoveredCell.date}: {hoveredCell.level} activity
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
