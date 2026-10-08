'use client';

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPercentage } from '@/lib/utils';

interface CompletionChartProps {
  data: Array<{ date: string; rate: number }>;
}

export default function CompletionChart({ data }: CompletionChartProps) {
  return (
    <Card className="w-full bg-[#111113] border-white/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-400">Completion Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(val) => {
                  const d = new Date(val);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                tick={{ fill: '#71717a', fontSize: 12 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(val) => `${val}%`}
                tick={{ fill: '#71717a', fontSize: 12 }} 
                domain={[0, 100]}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#18181B] border border-white/10 p-2 rounded-md shadow-xl">
                        <p className="text-white text-sm">{new Date(label ?? '').toLocaleDateString()}</p>
                        <p className="text-emerald-400 font-bold mt-1">
                          {Math.round(payload[0].value as number)}%
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area 
                type="monotone" 
                dataKey="rate" 
                stroke="#10b981" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#rateGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
