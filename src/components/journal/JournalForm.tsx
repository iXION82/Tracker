'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import MoodSelector from './MoodSelector';
import { toast } from 'sonner';

interface JournalFormProps {
  entry?: any;
  onSuccess: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function JournalForm({ entry, onSuccess, open, onOpenChange }: JournalFormProps) {
  const [date, setDate] = useState(entry?.date ? new Date(entry.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [mood, setMood] = useState(entry?.mood || 3);
  const [tags, setTags] = useState(entry?.tags?.join(', ') || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        date: new Date(date).toISOString(),
        title,
        content,
        mood,
        tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean),
      };

      const res = await fetch(entry ? `/api/journal/${entry._id}` : '/api/journal', {
        method: entry ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to save entry');

      toast.success(entry ? 'Entry updated successfully' : 'Entry created successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to save journal entry');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#111113] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>{entry ? 'Edit Entry' : 'New Journal Entry'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="bg-[#18181B] border-white/10"
              />
            </div>
            <div className="space-y-2">
              <Label>Mood</Label>
              <MoodSelector value={mood} onChange={setMood} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title (Optional)</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="How was your day?"
              className="bg-[#18181B] border-white/10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Entry</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your thoughts..."
              required
              className="min-h-[200px] bg-[#18181B] border-white/10 resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="work, personal, health..."
              className="bg-[#18181B] border-white/10"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
