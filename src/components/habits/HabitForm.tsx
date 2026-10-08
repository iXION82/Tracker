'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Edit2, Plus } from 'lucide-react';
import { IHabit } from '@/types';

interface HabitFormProps {
  habit?: IHabit;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export default function HabitForm({ habit, onSuccess, trigger }: HabitFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isEditing = !!habit;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      
      const url = isEditing ? `/api/habits/${habit._id}` : '/api/habits';
      const method = isEditing ? 'PATCH' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to save habit');
      
      toast.success(`Habit ${isEditing ? 'updated' : 'created'} successfully!`);
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Failed to save habit.');
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = isEditing ? (
    <button className="text-zinc-500 hover:text-white transition-colors p-1">
      <Edit2 className="w-3.5 h-3.5" />
    </button>
  ) : (
    <Button variant="outline" size="sm" className="bg-[#18181B] border-white/10 hover:bg-white/10 text-white h-9">
      <Plus className="w-4 h-4 mr-2" />
      New Habit
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="border-0 bg-transparent p-0">
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="bg-[#111113] border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Habit' : 'Create New Habit'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required defaultValue={habit?.name} className="bg-[#18181B] border-white/10" placeholder="e.g. Read 10 pages" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select name="type" defaultValue={habit?.type || "boolean"}>
              <SelectTrigger className="bg-[#18181B] border-white/10">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent className="bg-[#18181B] border-white/10 text-white">
                <SelectItem value="boolean">Yes/No (Boolean)</SelectItem>
                <SelectItem value="numeric">Numeric Target</SelectItem>
                <SelectItem value="count">Counter</SelectItem>
                <SelectItem value="timer">Timer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="section">Time of Day</Label>
            <Select name="section" defaultValue={habit?.section || "Anytime"}>
              <SelectTrigger className="bg-[#18181B] border-white/10">
                <SelectValue placeholder="Select time of day" />
              </SelectTrigger>
              <SelectContent className="bg-[#18181B] border-white/10 text-white">
                <SelectItem value="Morning">Morning</SelectItem>
                <SelectItem value="Work">Work/Study</SelectItem>
                <SelectItem value="Evening">Evening</SelectItem>
                <SelectItem value="Night">Night</SelectItem>
                <SelectItem value="Anytime">Anytime</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input type="color" id="color" name="color" defaultValue={habit?.color || "#3b82f6"} className="bg-[#18181B] border-white/10 h-10 p-1 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input id="icon" name="icon" defaultValue={habit?.icon || "🎯"} className="bg-[#18181B] border-white/10 text-center" />
            </div>
          </div>

          <div className="pt-4 flex justify-between gap-2">
            <div>
              {isEditing && (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={async () => {
                    if (confirm('Are you sure you want to delete this habit?')) {
                      setLoading(true);
                      try {
                        const res = await fetch(`/api/habits/${habit._id}`, { method: 'DELETE' });
                        if (!res.ok) throw new Error('Failed to delete');
                        toast.success('Habit deleted');
                        setOpen(false);
                        if (onSuccess) onSuccess();
                      } catch {
                        toast.error('Failed to delete habit');
                      } finally {
                        setLoading(false);
                      }
                    }
                  }} 
                  className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                >
                  Delete
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-transparent border-white/10 hover:bg-white/5">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="bg-white text-black hover:bg-zinc-200">
                {loading ? 'Saving...' : 'Save Habit'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
