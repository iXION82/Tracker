'use client';

import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Calendar, Target, Link as LinkIcon, Edit, Trash2, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow, isPast } from 'date-fns';

export default function GoalCard({ goal, onEdit, onDelete, onUpdate }: { goal: any, onEdit: () => void, onDelete: () => void, onUpdate: (newVal: number) => void }) {
  const percentage = goal.target > 0 ? Math.min(100, Math.round((goal.currentValue / goal.target) * 100)) : 0;
  const isCompleted = percentage >= 100 || goal.status === 'completed';
  
  const handleQuickAdd = (amount: number) => {
    const newVal = Math.min(goal.target, Math.max(0, goal.currentValue + amount));
    if (newVal !== goal.currentValue) {
      onUpdate(newVal);
    }
  };

  const getDeadlineStatus = () => {
    if (!goal.deadline || isCompleted) return null;
    const d = new Date(goal.deadline);
    if (isPast(d)) return { text: 'Overdue', color: 'text-red-400', bg: 'bg-red-400/10' };
    
    const diffDays = Math.ceil((d.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    if (diffDays <= 3) return { text: `${diffDays}d left`, color: 'text-orange-400', bg: 'bg-orange-400/10' };
    if (diffDays <= 7) return { text: `${diffDays}d left`, color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    return { text: formatDistanceToNow(d, { addSuffix: true }), color: 'text-zinc-500', bg: 'bg-[#1a1a1e]' };
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <Card className={`bg-[#111113] border-white/5 relative overflow-hidden flex flex-col group hover:border-white/10 transition-all duration-300 ${isCompleted ? 'opacity-70 hover:opacity-100' : ''}`}>
      {/* Top accent border */}
      <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: goal.color }} />

      <div className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#1a1a1e] text-zinc-400">
              {goal.category}
            </span>
            {isCompleted && (
              <span className="text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Done
              </span>
            )}
            {goal.status === 'paused' && (
              <span className="text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400">
                Paused
              </span>
            )}
            {deadlineStatus && (
              <span className={`text-[10px] font-medium uppercase tracking-widest px-2 py-0.5 rounded-full ${deadlineStatus.bg} ${deadlineStatus.color}`}>
                {deadlineStatus.text}
              </span>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger className="h-6 w-6 text-zinc-500 hover:text-white hover:bg-white/10 rounded transition-colors flex items-center justify-center -mr-1 -mt-1 outline-none">
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

        {/* Title & Desc */}
        <h3 className="text-lg font-bold text-white mb-1.5 line-clamp-2 leading-tight">{goal.title}</h3>
        {goal.description ? (
          <p className="text-xs text-zinc-500 line-clamp-2 mb-6 flex-1 leading-relaxed">{goal.description}</p>
        ) : (
          <div className="flex-1 mb-6" />
        )}

        {/* Progress Section */}
        <div className="mt-auto space-y-4">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-3xl font-black tracking-tight" style={{ color: isCompleted ? '#34d399' : '#fff' }}>
                {goal.currentValue}
              </span>
              <span className="text-sm font-medium text-zinc-500 ml-1">/ {goal.target} <span className="text-xs text-zinc-600">{goal.unit}</span></span>
            </div>
            
            {/* Quick Actions (only if not completed) */}
            {!isCompleted && goal.status === 'active' && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleQuickAdd(-1)} className="w-7 h-7 rounded-md bg-[#1a1a1e] hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleQuickAdd(1)} className="w-7 h-7 rounded-md bg-[#1a1a1e] hover:bg-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="h-2.5 bg-[#1a1a1e] rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-700 ease-out relative"
                style={{ width: `${percentage}%`, backgroundColor: isCompleted ? '#10b981' : goal.color }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-100%] animate-shine" />
              </div>
            </div>
            <span className="absolute -top-5 right-0 text-[10px] font-bold" style={{ color: isCompleted ? '#34d399' : goal.color }}>
              {percentage}%
            </span>
          </div>

          {/* Linked Habits indicator */}
          {goal.linkedHabits?.length > 0 && (
            <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-medium">
              <LinkIcon className="h-3 w-3" />
              <span>{goal.linkedHabits.length} linked habit{goal.linkedHabits.length > 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
