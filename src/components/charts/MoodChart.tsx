'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function MoodChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis 
          dataKey="date" 
          stroke="#71717a" 
          tick={{ fill: '#71717a', fontSize: 12 }} 
          axisLine={false}
          tickLine={false}
        />
        <YAxis 
          stroke="#71717a"
          tick={{ fill: '#71717a', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#18181B', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
        />
        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
        <Line type="monotone" dataKey="score" name="Life Score" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
        <Line type="monotone" dataKey="habits" name="Habits Done" stroke="#3b82f6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="tasks" name="Tasks Done" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
