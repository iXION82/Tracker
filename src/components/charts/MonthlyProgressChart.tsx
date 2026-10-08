'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPercentage } from '@/lib/utils';

interface MonthlyProgressChartProps {
  data: Array<{ date: string; completed: number; total: number }>;
}

export default function MonthlyProgressChart({ data }: MonthlyProgressChartProps) {
  const totalCompleted = data.reduce((sum, day) => sum + day.completed, 0);
  const totalTarget = data.reduce((sum, day) => sum + day.total, 0);
  const percentage = totalTarget > 0 ? (totalCompleted / totalTarget) * 100 : 0;

  return (
    <Card className="w-full bg-[#111113] border-white/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">Monthly Progress</CardTitle>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{totalCompleted} <span className="text-sm text-zinc-500 font-normal">/ {totalTarget}</span></p>
          <p className="text-xs text-blue-400">{Math.round(percentage)}% completed</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(val) => {
                  const d = new Date(val);
                  return d.getDate().toString();
                }}
                tick={{ fill: '#71717a', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#71717a', fontSize: 12 }} 
              />
              <Tooltip 
                cursor={{ fill: '#ffffff05' }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#18181B] border border-white/10 p-2 rounded-md shadow-xl">
                        <p className="text-white text-sm font-medium">{new Date(label ?? '').toLocaleDateString()}</p>
                        <p className="text-zinc-400 text-xs mt-1">
                          Completed: <span className="text-blue-400 font-bold">{payload[0].payload.completed}</span> / {payload[0].payload.total}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
