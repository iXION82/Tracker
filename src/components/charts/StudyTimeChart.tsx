'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function StudyTimeChart({ data }: { data: any[] }) {
  const categories = data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'date') : [];
  const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981', '#f59e0b'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          tickFormatter={(val) => `${val}m`}
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#18181B', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
        />
        <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
        {categories.map((cat, i) => (
          <Bar key={cat} dataKey={cat} stackId="a" fill={colors[i % colors.length]} radius={i === categories.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
