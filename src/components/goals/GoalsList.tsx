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
    ? Math.round(goals.reduce((acc, g) => acc + Math.min(1, g.currentValue / g.target), 0) / goals.length * 100)
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
    // Optimistic update
    const previousGoals = [...goals];
    setGoals(goals.map(g => g._id === goalId ? { ...g, currentValue: newValue } : g));

    try {
      const res = await fetch(`/api/goals/${goalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentValue: newValue })
      });
      if (!res.ok) throw new Error('Failed to update');
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
        <Card className="bg-[#111113] border-white/5 p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white leading-tight">{activeCount}</p>
            <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">Active Goals</p>
          </div>
        </Card>
        
        <Card className="bg-[#111113] border-white/5 p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white leading-tight">{completedCount}</p>
            <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">Completed</p>
          </div>
        </Card>

        <Card className="bg-[#111113] border-white/5 p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white leading-tight">{overallProgress}%</p>
            <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-medium">Overall Progress</p>
          </div>
        </Card>

        <Card className="bg-[#111113] border-white/5 p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors border-dashed border-white/10 group" onClick={() => { setEditingGoal(null); setIsFormOpen(true); }}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#1a1a1e] group-hover:bg-blue-600 flex items-center justify-center transition-colors">
              <Plus className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Create New</p>
              <p className="text-[11px] text-zinc-500">Set a new objective</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Filters & Grid ── */}
      <div>
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {['all', 'active', 'completed', 'paused', 'abandoned'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                filter === f 
                  ? 'bg-white text-black shadow-lg' 
                  : 'bg-[#1a1a1e] text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {f === 'all' ? 'All Goals' : f}
            </button>
          ))}
        </div>

        {filteredGoals.length === 0 ? (
          <div className="text-center py-24 bg-[#111113] border border-white/5 border-dashed rounded-xl">
            <Target className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No goals found</h3>
            <p className="text-sm text-zinc-500 mb-6 max-w-sm mx-auto">You don't have any {filter !== 'all' ? filter : ''} goals right now. Set a target and start working towards it.</p>
            <Button onClick={() => { setEditingGoal(null); setIsFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
              Create Goal
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
