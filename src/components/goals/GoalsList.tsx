'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="bg-zinc-900 border border-white/5">
            <TabsTrigger value="all">Active & Paused</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="abandoned">Abandoned</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => { setEditingGoal(null); setIsFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {filteredGoals.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 border border-white/5 rounded-xl">
          <p className="text-zinc-400">No goals found for this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGoals.map(goal => (
            <GoalCard 
              key={goal._id} 
              goal={goal} 
              onEdit={() => { setEditingGoal(goal); setIsFormOpen(true); }} 
              onDelete={() => handleDelete(goal._id)} 
            />
          ))}
        </div>
      )}

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
