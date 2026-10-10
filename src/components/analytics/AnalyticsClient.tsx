'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line, AreaChart, Area
} from 'recharts';

interface AnalyticsClientProps {
  timeAllocationData: { name: string; value: number; color: string }[];
  screenTimeData: { date: string; PC: number; Phone: number; Wasted: number }[];
  completionData: { date: string; rate: number; completed: number; total: number }[];
  scoreTrendData: { date: string; score: number; habits: number; tasks: number }[];
  habitStats: { name: string; rate: number; color: string; completed: number; total: number }[];
}

const tooltipStyle = {
  backgroundColor: '#18181B',
  borderColor: 'rgba(255,255,255,0.08)',
  color: '#fff',
  borderRadius: '12px',
  fontSize: '12px',
  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
};

export default function AnalyticsClient({ timeAllocationData, screenTimeData, completionData, scoreTrendData, habitStats }: AnalyticsClientProps) {
  const totalHours = timeAllocationData.reduce((sum, d) => sum + d.value, 0);
  const displayHours = Math.round(totalHours * 10) / 10;

  return (
    <div className="space-y-6">
      {/* ── Row 1: Donut + Screen Time ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Donut */}
        <Card className="lg:col-span-2 bg-[#111113] border-white/[0.04]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base font-bold">Avg 24h Breakdown</CardTitle>
            <p className="text-xs text-zinc-500">Based on last 30 days</p>
          </CardHeader>
          <CardContent className="h-[280px]">
            {timeAllocationData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={timeAllocationData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {timeAllocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={tooltipStyle}
                    formatter={(value: any, name: any) => [`${value}h`, name]}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" formatter={(value) => <span style={{ color: '#a1a1aa', fontSize: '11px' }}>{value}</span>} />
                  <text x="50%" y="42%" textAnchor="middle" dominantBaseline="middle" fill="#fff" style={{ fontSize: '28px', fontWeight: '900' }}>
                    {displayHours}
                  </text>
                  <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" fill="#71717a" style={{ fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                    HOURS
                  </text>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-600 text-sm">No time data yet</div>
            )}
          </CardContent>
        </Card>

        {/* Screen Time */}
        <Card className="lg:col-span-3 bg-[#111113] border-white/[0.04]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base font-bold">Screen &amp; Wasted Time</CardTitle>
            <p className="text-xs text-zinc-500">Last 7 days in hours</p>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={screenTimeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#71717a" tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(val) => `${val}h`} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} formatter={(value: any, name: any) => [`${value}h`, name]} />
                <Legend iconType="circle" formatter={(value) => <span style={{ color: '#a1a1aa', fontSize: '11px' }}>{value}</span>} />
                <Bar dataKey="PC" stackId="a" fill="#06b6d4" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Phone" stackId="a" fill="#ec4899" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Wasted" stackId="a" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Row 2: 30-Day Completion Grid + Top Habits ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Completion Heatmap */}
        <Card className="lg:col-span-3 bg-[#111113] border-white/[0.04]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base font-bold">30-Day Completion</CardTitle>
            <p className="text-xs text-zinc-500">Daily habit completion rate</p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-10 gap-2">
              {completionData.map((d, i) => {
                const intensity = d.rate >= 80 ? 'bg-emerald-500' : d.rate >= 60 ? 'bg-emerald-500/70' : d.rate >= 40 ? 'bg-emerald-500/40' : d.rate > 0 ? 'bg-emerald-500/20' : 'bg-white/[0.04]';
                return (
                  <div key={i} className="flex flex-col items-center gap-1" title={`Day ${d.date}: ${d.completed}/${d.total} (${d.rate}%)`}>
                    <div className={`w-full aspect-square rounded-lg ${intensity} transition-colors hover:ring-1 hover:ring-white/20 cursor-default`} />
                    <span className="text-[9px] text-zinc-600 tabular-nums">{d.date}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-3 mt-4 justify-end">
              <span className="text-[10px] text-zinc-600">Less</span>
              {['bg-white/[0.04]', 'bg-emerald-500/20', 'bg-emerald-500/40', 'bg-emerald-500/70', 'bg-emerald-500'].map((c, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
              ))}
              <span className="text-[10px] text-zinc-600">More</span>
            </div>
          </CardContent>
        </Card>

        {/* Top Habits */}
        <Card className="lg:col-span-2 bg-[#111113] border-white/[0.04]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base font-bold">Top Habits</CardTitle>
            <p className="text-xs text-zinc-500">By 30-day completion rate</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {habitStats.length > 0 ? habitStats.map((h, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-300 font-medium truncate max-w-[70%]">{h.name}</span>
                  <span className="text-xs text-zinc-500 tabular-nums font-semibold">{h.rate}%</span>
                </div>
                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${h.rate}%`, backgroundColor: h.color }}
                  />
                </div>
              </div>
            )) : (
              <div className="text-zinc-600 text-sm text-center py-8">No data yet</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Row 3: Life Score Trend ── */}
      <Card className="bg-[#111113] border-white/[0.04]">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base font-bold">Life Score Trend</CardTitle>
          <p className="text-xs text-zinc-500">Daily score with habits and tasks completed</p>
        </CardHeader>
        <CardContent className="h-[320px]">
          {scoreTrendData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scoreTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" tick={{ fill: '#52525b', fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                <YAxis stroke="#71717a" tick={{ fill: '#52525b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" formatter={(value) => <span style={{ color: '#a1a1aa', fontSize: '11px' }}>{value}</span>} />
                <Area type="monotone" dataKey="score" name="Life Score" stroke="#10b981" strokeWidth={2.5} fill="url(#scoreGrad)" dot={false} activeDot={{ r: 5, fill: '#10b981', strokeWidth: 0 }} />
                <Line type="monotone" dataKey="habits" name="Habits" stroke="#3b82f6" strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} />
                <Line type="monotone" dataKey="tasks" name="Tasks" stroke="#8b5cf6" strokeWidth={1.5} dot={false} activeDot={{ r: 4 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-600 text-sm">No data available for the last 30 days</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
