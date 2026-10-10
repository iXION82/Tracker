"use client";

import { useState, useRef, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  Clock, Smartphone, Monitor, Target, Moon, Coffee, 
  Zap, Brain, Flame, BarChart3, CheckCircle2, Timer,
  Plus, Minus, Star
} from "lucide-react";

// ── Helpers ──
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }
function fmtDuration(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

// ── Stepper Component ──
function Stepper({ value, onChange, min = 0, max = 99, step = 1, unit, color = 'text-white', large = false }: {
  value: number; onChange: (v: number) => void; min?: number; max?: number; step?: number; unit?: string; color?: string; large?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <button onClick={() => onChange(Math.max(min, +(value - step).toFixed(1)))}
        className="w-9 h-9 rounded-lg bg-[#1a1a1e] hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all active:scale-90">
        <Minus className="w-4 h-4" />
      </button>
      <div className={`${large ? 'min-w-[80px] text-4xl' : 'min-w-[56px] text-2xl'} text-center font-bold tabular-nums ${color}`}>
        {value}{unit && <span className={`${large ? 'text-base' : 'text-sm'} text-zinc-600 ml-0.5`}>{unit}</span>}
      </div>
      <button onClick={() => onChange(Math.min(max, +(value + step).toFixed(1)))}
        className="w-9 h-9 rounded-lg bg-[#1a1a1e] hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all active:scale-90">
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Pill Selector ──
function PillSelector({ options, value, onChange, color = 'bg-blue-500' }: {
  options: (number | string)[]; value: number | string; onChange: (v: any) => void; color?: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map(opt => (
        <button key={opt} onClick={() => onChange(opt)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
            value === opt
              ? `${color} text-white shadow-lg shadow-${color}/20`
              : 'bg-[#1a1a1e] text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
          }`}>
          {opt}
        </button>
      ))}
    </div>
  );
}

// ── Star Rating ──
function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-1">
        {[1,2,3,4,5].map(i => (
          <button key={i} onClick={() => onChange(i)}
            className={`transition-all duration-200 hover:scale-110 ${i <= value ? 'text-amber-400' : 'text-zinc-700 hover:text-zinc-500'}`}>
            <Star className={`w-6 h-6 ${i <= value ? 'fill-amber-400' : ''}`} />
          </button>
        ))}
      </div>
      {value > 0 && <span className="text-xs text-zinc-500">{labels[value]}</span>}
    </div>
  );
}

// ── Slider Bar ──
function SliderBar({ value, max, color, segments }: { value: number; max: number; color: string; segments?: number }) {
  const pct = clamp((value / max) * 100, 0, 100);
  return (
    <div className="relative">
      <div className="h-2 bg-[#1a1a1e] rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500 ease-out`} style={{ width: `${pct}%` }} />
      </div>
      {segments && (
        <div className="absolute inset-0 flex">
          {Array.from({ length: segments - 1 }).map((_, i) => (
            <div key={i} className="flex-1 border-r border-[#111113]/50" />
          ))}
          <div className="flex-1" />
        </div>
      )}
    </div>
  );
}

const QUALITY_MAP: Record<number, string> = { 1: 'poor', 2: 'fair', 3: 'good', 4: 'good', 5: 'excellent' };
const QUALITY_REVERSE: Record<string, number> = { poor: 1, fair: 2, good: 3, excellent: 5, none: 0 };

export default function MyDashboardClient({ initialData }: { initialData: any }) {
  const [data, setData] = useState({
    sessionHours: Math.floor((initialData.longestSessionMinutes || 0) / 60),
    sessionMinutes: (initialData.longestSessionMinutes || 0) % 60,
    unproductiveHours: initialData.unproductiveHours || 0,
    phoneHours: Math.floor((initialData.phoneTimeMinutes || 0) / 60),
    phoneMinutes: (initialData.phoneTimeMinutes || 0) % 60,
    pcHours: Math.floor((initialData.pcTimeMinutes || 0) / 60),
    pcMinutes: (initialData.pcTimeMinutes || 0) % 60,
    productiveSessions: initialData.productiveSessions || 0,
    sleepDuration: initialData.sleep?.duration || 0,
    sleepQuality: QUALITY_REVERSE[initialData.sleep?.quality] || 0
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = (field: string, value: any) => {
    const next = { ...data, [field]: value };
    setData(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => save(next), 1200);
  };

  const save = async (d: typeof data) => {
    try {
      const [r1, r2] = await Promise.all([
        fetch('/api/my/stats', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            longestSessionMinutes: d.sessionHours * 60 + d.sessionMinutes,
            unproductiveHours: d.unproductiveHours,
            phoneTimeMinutes: d.phoneHours * 60 + d.phoneMinutes,
            pcTimeMinutes: d.pcHours * 60 + d.pcMinutes,
            productiveSessions: d.productiveSessions
          })
        }),
        fetch('/api/sleep', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: new Date().toISOString(), duration: d.sleepDuration, quality: QUALITY_MAP[d.sleepQuality] || 'none' })
        })
      ]);
      if (r1.ok && r2.ok) toast.success("Auto-saved");
    } catch { toast.error("Failed to save"); }
  };

  // ── Computed ──
  const totalProd = initialData.windows?.reduce((a: number, w: any) => a + (w.productiveHours || 0), 0) || 0;
  const habitsComp = initialData.habits?.completed || 0;
  const habitsTotal = initialData.habits?.total || 0;
  const habitPct = habitsTotal > 0 ? Math.round((habitsComp / habitsTotal) * 100) : 0;
  const longestMins = data.sessionHours * 60 + data.sessionMinutes;
  const phoneMins = data.phoneHours * 60 + data.phoneMinutes;
  const pcMins = data.pcHours * 60 + data.pcMinutes;
  const totalScreen = phoneMins + pcMins;
  const activeWindows = initialData.windows?.filter((w: any) => w.productiveHours > 0).length || 0;

  const dayScore = useMemo(() => {
    let s = 0;
    s += clamp(totalProd / 10, 0, 1) * 40;
    s += (habitPct / 100) * 25;
    const sl = data.sleepDuration >= 7 && data.sleepDuration <= 9 ? 1 : data.sleepDuration >= 5 ? 0.6 : 0.2;
    s += sl * 15;
    s += clamp(1 - data.unproductiveHours / 8, 0, 1) * 10;
    s += clamp(1 - phoneMins / 300, 0, 1) * 10;
    return Math.round(s);
  }, [totalProd, habitPct, data.sleepDuration, data.unproductiveHours, phoneMins]);

  const scoreColor = dayScore >= 80 ? 'text-emerald-400' : dayScore >= 60 ? 'text-blue-400' : dayScore >= 40 ? 'text-yellow-400' : 'text-red-400';
  const scoreRing = dayScore >= 80 ? 'stroke-emerald-500' : dayScore >= 60 ? 'stroke-blue-500' : dayScore >= 40 ? 'stroke-yellow-500' : 'stroke-red-500';

  return (
    <div className="space-y-4">

      {/* ══════ ROW 1: Score · Focus Session · Productive Sessions ══════ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* Day Score */}
        <Card className="md:col-span-3 bg-[#111113] border-white/5 p-6 hover:border-white/10 transition-all">
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1a1a1e" strokeWidth="7" />
                <circle cx="50" cy="50" r="42" fill="none" className={scoreRing} strokeWidth="7"
                  strokeDasharray={`${dayScore * 2.64} 264`} strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.8s ease' }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-black ${scoreColor}`}>{dayScore}</span>
                <span className="text-[9px] text-zinc-600 uppercase tracking-widest">Score</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-white">Day Score</h3>
            <p className="text-[11px] text-zinc-500 mt-1 leading-relaxed max-w-[160px]">
              {dayScore >= 80 ? 'Exceptional day. Keep this up.' : dayScore >= 60 ? 'Solid progress. Push harder.' : dayScore >= 40 ? 'Room to improve. Lock in.' : 'Rough start — still time left.'}
            </p>
          </div>
        </Card>

        {/* Longest Focus Session */}
        <Card className="md:col-span-5 bg-[#111113] border-white/5 p-6 hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Target className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Longest Focus Session</h3>
            </div>
            {longestMins > 0 && (
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                longestMins >= 120 ? 'bg-emerald-500/15 text-emerald-400' : longestMins >= 60 ? 'bg-blue-500/15 text-blue-400' : 'bg-zinc-800 text-zinc-400'
              }`}>
                {longestMins >= 120 ? 'DEEP WORK' : longestMins >= 60 ? 'FOCUSED' : 'SHORT'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-6 mb-5">
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">Hours</span>
              <Stepper value={data.sessionHours} onChange={v => update('sessionHours', v)} max={12} color="text-blue-400" large />
            </div>
            <span className="text-2xl font-bold text-zinc-700 mt-4">:</span>
            <div className="flex flex-col items-center">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2">Minutes</span>
              <PillSelector options={[0, 15, 30, 45]} value={data.sessionMinutes} onChange={v => update('sessionMinutes', v)} color="bg-blue-600" />
            </div>
          </div>
          <SliderBar value={longestMins} max={240} color="bg-gradient-to-r from-blue-600 to-blue-400" segments={4} />
          <div className="flex justify-between mt-1 text-[9px] text-zinc-600"><span>0</span><span>1h</span><span>2h</span><span>3h</span><span>4h</span></div>
        </Card>

        {/* Productive Sessions */}
        <Card className="md:col-span-4 bg-[#111113] border-white/5 p-6 hover:border-white/10 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Deep Work Blocks</h3>
          </div>
          <div className="flex items-center justify-between mb-5">
            <Stepper value={data.productiveSessions} onChange={v => update('productiveSessions', v)} max={12} color="text-emerald-400" large />
            <div className="flex flex-col items-end gap-1.5">
              {[
                { min: 6, label: 'Machine Mode', color: 'text-emerald-400' },
                { min: 4, label: 'Strong Day', color: 'text-blue-400' },
                { min: 2, label: 'Getting There', color: 'text-yellow-400' },
                { min: 0, label: 'Just Starting', color: 'text-zinc-500' },
              ].map(tier => (
                <span key={tier.label} className={`text-[10px] font-medium ${data.productiveSessions >= tier.min ? tier.color : 'text-zinc-800'} transition-colors`}>
                  {tier.label}
                </span>
              ))}
            </div>
          </div>
          {/* Block visualization */}
          <div className="flex gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`flex-1 h-3 rounded-sm transition-all duration-300 ${
                i < data.productiveSessions ? 'bg-emerald-500 shadow-sm shadow-emerald-500/20' : 'bg-[#1a1a1e]'
              }`} />
            ))}
          </div>
        </Card>
      </div>

      {/* ══════ ROW 2: Sleep · Wasted Time · Screen Time ══════ */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

        {/* Sleep */}
        <Card className="md:col-span-5 bg-[#111113] border-white/5 p-6 hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <Moon className="w-4 h-4 text-indigo-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Sleep</h3>
            </div>
            {data.sleepDuration > 0 && (
              <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${
                data.sleepDuration >= 7 ? 'bg-emerald-500/15 text-emerald-400' : data.sleepDuration >= 5 ? 'bg-yellow-500/15 text-yellow-400' : 'bg-red-500/15 text-red-400'
              }`}>
                {data.sleepDuration >= 7 ? 'WELL RESTED' : data.sleepDuration >= 5 ? 'MODERATE' : 'SLEEP DEBT'}
              </span>
            )}
          </div>
          <div className="flex items-start gap-8">
            <div className="flex-1">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-3 block">Duration</span>
              <PillSelector 
                options={[4, 5, 5.5, 6, 6.5, 7, 7.5, 8, 9, 10]} 
                value={data.sleepDuration} 
                onChange={v => update('sleepDuration', v)} 
                color="bg-indigo-600" 
              />
            </div>
            <div className="text-center">
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-3 block">Now</span>
              <div className="text-3xl font-bold text-indigo-400 tabular-nums">
                {data.sleepDuration}<span className="text-sm text-zinc-600 ml-0.5">h</span>
              </div>
            </div>
          </div>
          <div className="mt-5">
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest mb-2 block">Quality</span>
            <StarRating value={data.sleepQuality} onChange={v => update('sleepQuality', v)} />
          </div>
          <div className="mt-4">
            <SliderBar value={data.sleepDuration} max={10} color="bg-gradient-to-r from-indigo-600 to-violet-400" segments={5} />
            <div className="flex justify-between mt-1 text-[9px] text-zinc-600"><span>0h</span><span>5h</span><span>10h</span></div>
          </div>
        </Card>

        {/* Wasted Time */}
        <Card className="md:col-span-3 bg-[#111113] border-white/5 p-6 hover:border-white/10 transition-all">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <Coffee className="w-4 h-4 text-orange-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">Wasted Time</h3>
          </div>
          <div className="flex justify-center mb-4">
            <Stepper value={data.unproductiveHours} onChange={v => update('unproductiveHours', v)} max={16} step={0.5} unit="h" color="text-orange-400" large />
          </div>
          <PillSelector 
            options={[0, 0.5, 1, 1.5, 2, 3, 4, 5]} 
            value={data.unproductiveHours} 
            onChange={v => update('unproductiveHours', v)} 
            color="bg-orange-600" 
          />
          <div className="mt-4 p-3 rounded-lg bg-[#0e0e10] border border-white/[0.03]">
            <p className="text-[11px] text-zinc-500 italic leading-relaxed">
              {data.unproductiveHours === 0 ? '"Zero waste. Discipline wins."' 
                : data.unproductiveHours <= 1 ? '"Tight control. Keep it here."' 
                : data.unproductiveHours <= 3 ? '"Manageable — but tighten up."' 
                : '"Too much lost time. Audit your day."'}
            </p>
          </div>
        </Card>

        {/* Screen Time */}
        <Card className="md:col-span-4 bg-[#111113] border-white/5 p-6 hover:border-white/10 transition-all">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-violet-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Screen Time</h3>
            </div>
            {totalScreen > 0 && (
              <span className="text-xs font-bold text-zinc-400 tabular-nums">{fmtDuration(totalScreen)}</span>
            )}
          </div>
          {/* Phone */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Smartphone className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-xs text-zinc-400">Phone</span>
              </div>
              <span className="text-xs text-zinc-600 tabular-nums">{fmtDuration(phoneMins)}</span>
            </div>
            <div className="flex gap-2 items-center">
              <Stepper value={data.phoneHours} onChange={v => update('phoneHours', v)} max={16} unit="h" color="text-pink-400" />
              <PillSelector options={[0, 15, 30, 45]} value={data.phoneMinutes} onChange={v => update('phoneMinutes', v)} color="bg-pink-600" />
            </div>
            <div className="mt-2">
              <SliderBar value={phoneMins} max={480} color="bg-gradient-to-r from-pink-600 to-pink-400" />
            </div>
          </div>
          {/* PC */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-xs text-zinc-400">PC / Laptop</span>
              </div>
              <span className="text-xs text-zinc-600 tabular-nums">{fmtDuration(pcMins)}</span>
            </div>
            <div className="flex gap-2 items-center">
              <Stepper value={data.pcHours} onChange={v => update('pcHours', v)} max={16} unit="h" color="text-cyan-400" />
              <PillSelector options={[0, 15, 30, 45]} value={data.pcMinutes} onChange={v => update('pcMinutes', v)} color="bg-cyan-600" />
            </div>
            <div className="mt-2">
              <SliderBar value={pcMins} max={480} color="bg-gradient-to-r from-cyan-600 to-cyan-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* ══════ ROW 3: Summary Cards ══════ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Productive Hours */}
        <Card className="bg-[#111113] border-white/5 p-5 hover:border-white/10 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Productive</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{totalProd}<span className="text-sm text-zinc-500 ml-1">hrs</span></p>
          <SliderBar value={totalProd} max={10} color="bg-blue-500" />
          <p className="text-[10px] text-zinc-600 mt-1.5">of 10h goal — {Math.round(clamp(totalProd/10, 0, 1) * 100)}%</p>
        </Card>

        {/* Habits */}
        <Card className="bg-[#111113] border-white/5 p-5 hover:border-white/10 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Habits</span>
          </div>
          <p className="text-2xl font-bold text-white mb-1">{habitsComp}<span className="text-sm text-zinc-500 ml-1">/ {habitsTotal}</span></p>
          <SliderBar value={habitPct} max={100} color="bg-green-500" />
          <p className="text-[10px] text-zinc-600 mt-1.5">{habitPct}% complete</p>
        </Card>

        {/* Active Windows */}
        <Card className="bg-[#111113] border-white/5 p-5 hover:border-white/10 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <Timer className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Windows</span>
          </div>
          <p className="text-2xl font-bold text-white mb-2">{activeWindows}<span className="text-sm text-zinc-500 ml-1">/ 4</span></p>
          <div className="flex gap-1.5">
            {['Morn','Aftn','Eve','Night'].map((l, i) => (
              <div key={l} className="flex-1 flex flex-col items-center gap-1">
                <div className={`w-full h-2.5 rounded-sm transition-all duration-300 ${i < activeWindows ? 'bg-amber-500' : 'bg-[#1a1a1e]'}`} />
                <span className="text-[8px] text-zinc-600">{l}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Focus Quality */}
        <Card className="bg-[#111113] border-white/5 p-5 hover:border-white/10 transition-all">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">Focus</span>
          </div>
          <p className={`text-2xl font-bold mb-1 ${longestMins >= 90 ? 'text-emerald-400' : longestMins >= 45 ? 'text-blue-400' : 'text-zinc-500'}`}>
            {longestMins >= 90 ? 'Elite' : longestMins >= 45 ? 'Good' : longestMins > 0 ? 'Building' : '—'}
          </p>
          <p className="text-[11px] text-zinc-500 leading-relaxed">
            {longestMins >= 90 ? `${fmtDuration(longestMins)} deep session` : longestMins >= 45 ? `${fmtDuration(longestMins)} — push for 90m+` : longestMins > 0 ? `${fmtDuration(longestMins)} — aim longer` : 'No sessions logged yet'}
          </p>
        </Card>
      </div>

      {/* ══════ ROW 4: 16-Hour Breakdown ══════ */}
      <Card className="bg-[#111113] border-white/5 p-6 hover:border-white/10 transition-all">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[10px] text-zinc-500 uppercase tracking-widest font-medium">16-Hour Day Breakdown</h3>
          <span className="text-[10px] text-zinc-600">{Math.round((totalProd / 16) * 100)}% tracked productive</span>
        </div>
        <div className="flex h-10 rounded-lg overflow-hidden gap-0.5">
          {totalProd > 0 && (
            <div className="bg-blue-500/80 flex items-center justify-center transition-all duration-500" style={{ width: `${(totalProd/16)*100}%` }}>
              <span className="text-[10px] font-bold text-white/90 drop-shadow">{totalProd}h</span>
            </div>
          )}
          {data.unproductiveHours > 0 && (
            <div className="bg-orange-500/60 flex items-center justify-center transition-all duration-500" style={{ width: `${(data.unproductiveHours/16)*100}%` }}>
              <span className="text-[10px] font-bold text-white/80">{data.unproductiveHours}h</span>
            </div>
          )}
          {(16 - totalProd - data.unproductiveHours) > 0 && (
            <div className="bg-[#1a1a1e] flex items-center justify-center flex-1 transition-all duration-500">
              <span className="text-[10px] text-zinc-600">{Math.max(0, Math.round((16 - totalProd - data.unproductiveHours)*10)/10)}h untracked</span>
            </div>
          )}
        </div>
        <div className="flex gap-6 mt-3 text-[10px] text-zinc-500">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-500/80" /> Productive</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500/60" /> Wasted</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-[#1a1a1e]" /> Untracked</span>
        </div>
      </Card>
    </div>
  );
}
