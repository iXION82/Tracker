'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export default function HabitForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      
      const res = await fetch('/api/habits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to save habit');
      
      toast.success('Habit saved successfully! 🎉');
      setOpen(false);
    } catch (error) {
      toast.error('Failed to save habit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-white text-black hover:bg-zinc-200">New Habit</Button>
      </DialogTrigger>
      <DialogContent className="bg-[#111113] border-white/10 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required className="bg-[#18181B] border-white/10" placeholder="e.g. Read 10 pages" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select name="type" defaultValue="boolean">
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
            <Select name="section" defaultValue="Anytime">
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
              <Input type="color" id="color" name="color" defaultValue="#3b82f6" className="bg-[#18181B] border-white/10 h-10 p-1 w-full" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon (Emoji)</Label>
              <Input id="icon" name="icon" defaultValue="🎯" className="bg-[#18181B] border-white/10 text-center" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-transparent border-white/10 hover:bg-white/5">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-white text-black hover:bg-zinc-200">
              {loading ? 'Saving...' : 'Save Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
