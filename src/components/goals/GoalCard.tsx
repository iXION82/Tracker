'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreVertical, Calendar, Target, Link as LinkIcon, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function GoalCard({ goal, onEdit, onDelete }: { goal: any, onEdit: () => void, onDelete: () => void }) {
  const percentage = goal.target > 0 ? Math.min(100, Math.round((goal.currentValue / goal.target) * 100)) : 0;
  
  const statusColors: any = {
    active: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    paused: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    abandoned: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
  };

  return (
    <Card className={cn("bg-[#111113] border-white/5 relative overflow-hidden flex flex-col group", "hover:border-white/10 transition-colors")} style={{ borderLeftColor: goal.color, borderLeftWidth: '4px' }}>
      <div className="p-5 flex-1">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="outline" className={cn("capitalize font-medium", statusColors[goal.status] || statusColors.active)}>
            {goal.status}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/5 -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#18181B] border-white/10 text-white">
              <DropdownMenuItem onClick={onEdit} className="hover:bg-white/5 cursor-pointer">
                <Edit className="h-4 w-4 mr-2" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-red-400 hover:text-red-300 hover:bg-red-400/10 cursor-pointer">
                <Trash2 className="h-4 w-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="text-lg font-semibold text-white mb-1">{goal.title}</h3>
        {goal.description && (
          <p className="text-sm text-zinc-400 line-clamp-2 mb-4">{goal.description}</p>
        )}

        <div className="mt-auto space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-300 font-medium">{goal.currentValue} / {goal.target} {goal.unit}</span>
              <span className="text-white font-bold">{percentage}%</span>
            </div>
            <Progress value={percentage} className="h-2 bg-white/5" style={{ '--progress-background': goal.color } as any} />
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-500 pt-2 border-t border-white/5">
            {goal.deadline && (
              <div className="flex items-center gap-1.5" title={new Date(goal.deadline).toLocaleDateString()}>
                <Calendar className="h-3.5 w-3.5" />
                <span>{formatDistanceToNow(new Date(goal.deadline), { addSuffix: true })}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 capitalize">
              <Target className="h-3.5 w-3.5" />
              <span>{goal.category}</span>
            </div>
            {goal.linkedHabits && goal.linkedHabits.length > 0 && (
              <div className="flex items-center gap-1.5">
                <LinkIcon className="h-3.5 w-3.5" />
                <span>{goal.linkedHabits.length}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
