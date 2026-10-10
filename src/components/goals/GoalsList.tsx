'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Target, CheckCircle2, TrendingUp, Clock } from 'lucide-react';
import GoalCard from './GoalCard';
import GoalForm from './GoalForm';
import { toast } from 'sonner';

export default function GoalsList({ initialGoals, habits }: { initialGoals: any[], habits: any[] }) {
  const [goals, setGoals] = useState(initialGoals);
  const [filter, setFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<any | null>(null);

  const filteredGoals = goals.filter(g => {
    if (filter === 'all') return g.status !== 'abandoned';
    return g.status === filter;
  });

  // Derived stats
  const activeCount = goals.filter(g => g.status === 'active').length;
  const completedCount = goals.filter(g => g.status === 'completed').length;
  const overallProgress = goals.length > 0 
    ? Math.round(goals.reduce((acc, g) => acc + (g.target > 0 ? Math.min(1, g.currentValue / g.target) : 0), 0) / goals.length * 100)
    : 0;

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    try {
      const res = await fetch(`/api/goals/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setGoals(goals.filter(g => g._id !== id));
        toast.success('Goal deleted');
      } else {
        toast.error('Failed to delete goal');
      }
    } catch (e) {
      toast.error('Error deleting goal');
    }
  };

  const handleUpdateValue = async (goalId: string, newValue: number) => {
    const goal = goals.find(g => g._id === goalId);
    if (!goal) return;

    // Auto-complete when target is reached
    const reachedTarget = newValue >= goal.target;
    const updatedFields: any = { currentValue: newValue };
    if (reachedTarget && goal.status === 'active') {
      updatedFields.status = 'completed';
    }

    // Optimistic update
    const previousGoals = [...goals];
    setGoals(goals.map(g => g._id === goalId ? { ...g, ...updatedFields } : g));

    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFields)
      });
      if (!res.ok) throw new Error('Failed to update');
      const data = await res.json();
      if (data.success && data.data) {
        // Sync server response back
        setGoals(prev => prev.map(g => g._id === goalId ? { ...g, ...JSON.parse(JSON.stringify(data.data)) } : g));
      }
      if (reachedTarget && goal.status === 'active') {
        toast.success('🎉 Goal completed!');
      }
    } catch (e) {
      setGoals(previousGoals);
      toast.error('Failed to update progress');
    }
  };

  const handleSuccess = (updatedGoal: any, isNew: boolean) => {
    if (isNew) {
      setGoals([updatedGoal, ...goals]);
    } else {
      setGoals(goals.map(g => g._id === updatedGoal._id ? updatedGoal : g));
    }
    setIsFormOpen(false);
    setEditingGoal(null);
  };

  return (
    <div className="space-y-8">
      {/* ── Summary Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#111113] border-white/[0.04] p-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-blue-500/20 transition-all duration-500">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-blue-500/[0.03] to-transparent pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-black text-white leading-none tabular-nums mb-1">{activeCount}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">Active Goals</p>
        </Card>
        
        <Card className="bg-[#111113] border-white/[0.04] p-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-emerald-500/20 transition-all duration-500">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-emerald-500/[0.03] to-transparent pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-white leading-none tabular-nums mb-1">{completedCount}</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">Completed</p>
        </Card>

        <Card className="bg-[#111113] border-white/[0.04] p-6 flex flex-col items-center text-center relative overflow-hidden group hover:border-purple-500/20 transition-all duration-500">
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-purple-500/[0.03] to-transparent pointer-events-none" />
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-black text-white leading-none tabular-nums mb-1">{overallProgress}%</p>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-semibold">Overall Progress</p>
        </Card>

        <Card className="bg-[#111113] border-white/[0.04] border-dashed p-6 flex flex-col items-center text-center justify-center cursor-pointer group hover:border-white/15 transition-all duration-500" onClick={() => { setEditingGoal(null); setIsFormOpen(true); }}>
          <div className="w-12 h-12 rounded-2xl bg-[#1a1a1e] group-hover:bg-blue-600 flex items-center justify-center mb-3 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/20">
            <Plus className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          <p className="text-sm font-bold text-white mb-0.5">Create New</p>
          <p className="text-[10px] text-zinc-600">Set a new objective</p>
        </Card>
      </div>

      {/* ── Filters ── */}
      <div>
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {['all', 'active', 'completed', 'paused', 'abandoned'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                filter === f 
                  ? 'bg-white text-black shadow-lg shadow-white/10' 
                  : 'bg-[#1a1a1e] text-zinc-500 hover:text-white hover:bg-white/10'
              }`}
            >
              {f === 'all' ? 'All Goals' : f}
              {f === 'active' && activeCount > 0 ? ` (${activeCount})` : ''}
              {f === 'completed' && completedCount > 0 ? ` (${completedCount})` : ''}
            </button>
          ))}
        </div>

        {filteredGoals.length === 0 ? (
          <div className="text-center py-24 bg-[#111113] border border-white/[0.04] border-dashed rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mx-auto mb-5">
              <Target className="w-8 h-8 text-zinc-700" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No goals found</h3>
            <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">You don&apos;t have any {filter !== 'all' ? filter : ''} goals right now. Set a target and start working towards it.</p>
            <Button onClick={() => { setEditingGoal(null); setIsFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
              Create Goal
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredGoals.map(goal => (
              <GoalCard 
                key={goal._id} 
                goal={goal} 
                onEdit={() => { setEditingGoal(goal); setIsFormOpen(true); }} 
                onDelete={() => handleDelete(goal._id)}
                onUpdate={(newVal) => handleUpdateValue(goal._id, newVal)}
              />
            ))}
          </div>
        )}
      </div>

      <GoalForm
        open={isFormOpen}
        onOpenChange={(open: boolean) => { setIsFormOpen(open); if (!open) setEditingGoal(null); }}
        goal={editingGoal}
        habits={habits}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
