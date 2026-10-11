'use client';

import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2, Plus, Minus, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { formatDistanceToNow, isPast } from 'date-fns';

export default function GoalCard({ goal, onEdit, onDelete, onUpdate }: { goal: any, onEdit: () => void, onDelete: () => void, onUpdate: (newVal: number) => void }) {
  const currentValue = goal.currentValue ?? 0;
  const target = goal.target ?? 1;
  const percentage = target > 0 ? Math.min(100, Math.max(0, Math.round((currentValue / target) * 100))) : 0;
  const isCompleted = percentage >= 100 || goal.status === 'completed';

  const handleQuickAdd = (amount: number) => {
    const newVal = Math.min(target, Math.max(0, currentValue + amount));
    if (newVal !== currentValue) onUpdate(newVal);
  };

  const getDeadlineStatus = () => {
    if (!goal.deadline || isCompleted) return null;
    try {
      const d = new Date(goal.deadline);
      if (isNaN(d.getTime())) return null;
      if (isPast(d)) return { text: 'Overdue', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' };
      const diffDays = Math.ceil((d.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
      if (diffDays <= 3) return { text: `${diffDays}d left`, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' };
      if (diffDays <= 7) return { text: `${diffDays}d left`, color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' };
      return { text: formatDistanceToNow(d, { addSuffix: true }), color: 'text-zinc-500', bg: 'bg-zinc-500/5 border-zinc-500/10' };
    } catch { return null; }
  };

  const deadlineStatus = getDeadlineStatus();

  // Ring progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <Card className={`bg-[#111113] border-white/[0.04] relative overflow-hidden group hover:border-white/10 transition-all duration-500 ${isCompleted ? 'hover:shadow-emerald-500/5 hover:shadow-2xl' : 'hover:shadow-xl hover:shadow-black/30'}`}>
      {/* Subtle gradient glow at top */}
      <div className="absolute top-0 left-0 right-0 h-32 opacity-[0.04] pointer-events-none" style={{ background: `radial-gradient(ellipse at center top, ${goal.color}, transparent 70%)` }} />

      {/* Menu */}
      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger className="h-7 w-7 text-zinc-600 hover:text-white hover:bg-white/10 rounded-lg transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 outline-none">
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#18181B] border-white/10 text-white min-w-[140px]">
            <DropdownMenuItem onClick={onEdit} className="hover:bg-white/5 focus:bg-white/5 cursor-pointer text-xs">
              <Edit className="h-3.5 w-3.5 mr-2" /> Edit Goal
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onDelete} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 focus:bg-red-400/10 cursor-pointer text-xs">
              <Trash2 className="h-3.5 w-3.5 mr-2" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="p-6 flex flex-col items-center text-center">

        {/* ── Circular Progress Ring ── */}
        <div className="relative mb-5">
          <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
            {/* Background track */}
            <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
            {/* Progress arc */}
            <circle
              cx="50" cy="50" r={radius} fill="none"
              stroke={isCompleted ? '#10b981' : goal.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-700 ease-out"
            />
          </svg>
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {isCompleted ? (
              <CheckCircle2 className="w-7 h-7 text-emerald-400" />
            ) : (
              <>
                <span className="text-2xl font-black text-white leading-none tabular-nums">{percentage}</span>
                <span className="text-[9px] text-zinc-500 font-semibold tracking-wider mt-0.5">%</span>
              </>
            )}
          </div>
        </div>

        {/* ── Badges ── */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-4">
          <span className="text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border bg-[#1a1a1e] border-white/[0.06] text-zinc-400">
            {goal.category}
          </span>
          {isCompleted && (
            <span className="text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
              Completed
            </span>
          )}
          {goal.status === 'paused' && (
            <span className="text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border bg-yellow-500/10 border-yellow-500/20 text-yellow-400">
              Paused
            </span>
          )}
          {deadlineStatus && (
            <span className={`text-[9px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full border ${deadlineStatus.bg} ${deadlineStatus.color}`}>
              {deadlineStatus.text}
            </span>
          )}
        </div>

        {/* ── Title & Description ── */}
        <h3 className="text-base font-bold text-white mb-1 line-clamp-2 leading-snug px-2">{goal.title}</h3>
        {goal.description && (
          <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mb-4 max-w-[90%]">{goal.description}</p>
        )}
        {!goal.description && <div className="mb-4" />}

        {/* ── Progress Numbers ── */}
        <div className="w-full px-2">
          <div className="flex items-center justify-center gap-2 mb-3">
            {/* Quick - button */}
            {!isCompleted && goal.status === 'active' && (
              <button
                onClick={() => handleQuickAdd(-1)}
                className="w-8 h-8 rounded-lg bg-[#1a1a1e] hover:bg-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tabular-nums" style={{ color: isCompleted ? '#34d399' : '#fff' }}>
                {currentValue}
              </span>
              <span className="text-xs text-zinc-600 font-medium">/</span>
              <span className="text-sm font-semibold text-zinc-500 tabular-nums">{target}</span>
              <span className="text-[10px] text-zinc-600 ml-0.5">{goal.unit}</span>
            </div>

            {/* Quick + button */}
            {!isCompleted && goal.status === 'active' && (
              <button
                onClick={() => handleQuickAdd(1)}
                className="w-8 h-8 rounded-lg bg-[#1a1a1e] hover:bg-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* ── Linear Progress Bar ── */}
          <div className="w-full h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
              style={{ width: `${percentage}%`, backgroundColor: isCompleted ? '#10b981' : goal.color }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shine" />
            </div>
          </div>
        </div>

        {/* ── Linked Habits ── */}
        {goal.linkedHabits?.length > 0 && (
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-medium mt-4 pt-3 border-t border-white/[0.04] w-full justify-center">
            <LinkIcon className="h-3 w-3" />
            <span>{goal.linkedHabits.length} linked habit{goal.linkedHabits.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </Card>
  );
}
