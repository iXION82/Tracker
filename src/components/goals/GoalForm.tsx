'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function GoalForm({ open, onOpenChange, goal, habits, onSuccess }: any) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target: 100,
    currentValue: 0,
    unit: '%',
    deadline: '',
    category: 'personal',
    color: '#3b82f6',
    status: 'active',
    linkedHabits: [] as string[]
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (goal && open) {
      setFormData({
        title: goal.title || '',
        description: goal.description || '',
        target: goal.target || 100,
        currentValue: goal.currentValue || 0,
        unit: goal.unit || '',
        deadline: goal.deadline ? new Date(goal.deadline).toISOString().split('T')[0] : '',
        category: goal.category || 'personal',
        color: goal.color || '#3b82f6',
        status: goal.status || 'active',
        linkedHabits: goal.linkedHabits || []
      });
    } else if (open) {
      setFormData({
        title: '',
        description: '',
        target: 100,
        currentValue: 0,
        unit: '%',
        deadline: '',
        category: 'personal',
        color: '#3b82f6',
        status: 'active',
        linkedHabits: []
      });
    }
  }, [goal, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = goal ? `/api/goals/${goal._id}` : '/api/goals';
      const method = goal ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(goal ? 'Goal updated' : 'Goal created');
        onSuccess(data.data, !goal);
      } else {
        toast.error(data.error || 'Failed to save goal');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e'];
  const categories = ['health', 'work', 'learning', 'personal', 'finance', 'social'];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#111113] border-white/5 text-white sm:max-w-[500px] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">{goal ? 'Edit Goal' : 'Add New Goal'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Title *</Label>
            <Input id="title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-[#1a1a1e] border-white/5 text-white h-11 focus-visible:ring-1 focus-visible:ring-blue-500" placeholder="e.g. Read 50 books this year" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Description</Label>
            <Textarea id="description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="bg-[#1a1a1e] border-white/5 text-white resize-none focus-visible:ring-1 focus-visible:ring-blue-500" rows={2} placeholder="Why is this important to you?" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target" className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Target Value</Label>
              <Input id="target" type="number" required min={1} value={formData.target} onChange={e => setFormData({...formData, target: Number(e.target.value)})} className="bg-[#1a1a1e] border-white/5 text-white h-11 focus-visible:ring-1 focus-visible:ring-blue-500 text-lg font-semibold tabular-nums" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentValue" className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Current Value</Label>
              <Input id="currentValue" type="number" min={0} value={formData.currentValue} onChange={e => setFormData({...formData, currentValue: Number(e.target.value)})} className="bg-[#1a1a1e] border-white/5 text-white h-11 focus-visible:ring-1 focus-visible:ring-blue-500 text-lg font-semibold tabular-nums" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit" className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Unit</Label>
              <Input id="unit" placeholder="e.g. books, kg, %" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="bg-[#1a1a1e] border-white/5 text-white h-11 focus-visible:ring-1 focus-visible:ring-blue-500" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deadline" className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Deadline</Label>
              <Input id="deadline" type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className="bg-[#1a1a1e] border-white/5 text-white h-11 focus-visible:ring-1 focus-visible:ring-blue-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Category</Label>
              <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v ?? ''})}>
                <SelectTrigger className="bg-[#1a1a1e] border-white/5 text-white h-11 focus-visible:ring-1 focus-visible:ring-blue-500">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1e] border-white/10 text-white">
                  {categories.map(c => <SelectItem key={c} value={c} className="capitalize hover:bg-white/5">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Status</Label>
              <Select value={formData.status} onValueChange={v => setFormData({...formData, status: v ?? ''})}>
                <SelectTrigger className="bg-[#1a1a1e] border-white/5 text-white h-11 focus-visible:ring-1 focus-visible:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1e] border-white/10 text-white">
                  <SelectItem value="active" className="hover:bg-white/5">Active</SelectItem>
                  <SelectItem value="completed" className="hover:bg-white/5 text-emerald-400">Completed</SelectItem>
                  <SelectItem value="paused" className="hover:bg-white/5 text-yellow-400">Paused</SelectItem>
                  <SelectItem value="abandoned" className="hover:bg-white/5 text-zinc-500">Abandoned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-white/5">
            <Label className="text-xs text-zinc-400 uppercase tracking-widest font-medium">Accent Color</Label>
            <div className="flex flex-wrap gap-3">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({...formData, color})}
                  className={`w-6 h-6 rounded-full transition-transform ${formData.color === color ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#111113]' : 'hover:scale-110'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          <DialogFooter className="mt-8 pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-zinc-400 hover:text-white hover:bg-white/5">Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-white text-black hover:bg-zinc-200 px-6 font-bold">
              {loading ? 'Saving...' : 'Save Goal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
