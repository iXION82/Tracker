'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { MOOD_EMOJIS } from '@/types';
import JournalForm from './JournalForm';
import { toast } from 'sonner';

interface JournalListProps {
  initialEntries: any[];
}

export default function JournalList({ initialEntries }: JournalListProps) {
  const [entries, setEntries] = useState(initialEntries);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/journal');
      if (res.ok) {
        const data = await res.json();
        setEntries(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch entries', error);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const res = await fetch(`/api/journal/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Entry deleted');
        fetchEntries();
      } else {
        toast.error('Failed to delete entry');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleEdit = (entry: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Your Entries</h2>
        <Button onClick={() => { setEditingEntry(null); setIsFormOpen(true); }} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" /> New Entry
        </Button>
      </div>

      {entries.length === 0 ? (
        <Card className="bg-[#111113] border-white/5 py-12 flex flex-col items-center justify-center text-zinc-500">
          <Calendar className="w-12 h-12 mb-4 opacity-50" />
          <p>No journal entries yet.</p>
          <p className="text-sm">Write down your thoughts for the day!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <Card 
              key={entry._id} 
              className="bg-[#111113] border-white/5 hover:border-white/10 transition-colors cursor-pointer"
              onClick={() => toggleExpand(entry._id)}
            >
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{MOOD_EMOJIS[entry.mood as keyof typeof MOOD_EMOJIS]?.emoji || '😐'}</div>
                  <div>
                    <CardTitle className="text-base text-white">{entry.title || 'Untitled Entry'}</CardTitle>
                    <p className="text-xs text-zinc-400">
                      {format(new Date(entry.date), 'MMMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={(e) => handleEdit(entry, e)} className="h-8 w-8 text-zinc-400 hover:text-white">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={(e) => handleDelete(entry._id, e)} className="h-8 w-8 text-zinc-400 hover:text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-sm text-zinc-300 whitespace-pre-wrap ${expandedId === entry._id ? '' : 'line-clamp-2'}`}>
                  {entry.content}
                </div>
                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {entry.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary" className="bg-[#18181B] text-zinc-300 hover:bg-[#27272A]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isFormOpen && (
        <JournalForm 
          entry={editingEntry}
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSuccess={fetchEntries}
        />
      )}
    </div>
  );
}
