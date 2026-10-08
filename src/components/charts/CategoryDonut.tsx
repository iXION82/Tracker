'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function CategoryDonut({ data }: { data: any[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="45%"
          innerRadius={80}
          outerRadius={100}
          paddingAngle={5}
          dataKey="value"
          stroke="none"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{ backgroundColor: '#18181B', borderColor: 'rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
          itemStyle={{ color: '#fff' }}
          formatter={(value: any) => [`${value}%`, 'Share']}
        />
        <Legend verticalAlign="bottom" height={36} iconType="circle" />
        <text x="50%" y="45%" textAnchor="middle" dominantBaseline="middle" fill="#fff" style={{ fontSize: '24px', fontWeight: 'bold' }}>
          {total}%
        </text>
        <text x="50%" y="55%" textAnchor="middle" dominantBaseline="middle" fill="#a1a1aa" style={{ fontSize: '12px' }}>
          Total
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}
