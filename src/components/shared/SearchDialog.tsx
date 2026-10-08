'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList,
  CommandSeparator
} from '@/components/ui/command';
import { CalendarCheck, Grid3X3, Target, ListTodo, BookOpen } from 'lucide-react';

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  
  // Future: Fetch search results from /api/search?q=term
  // const [query, setQuery] = useState('');
  // const [results, setResults] = useState([]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => router.push('/today'))}>
            <CalendarCheck className="mr-2 h-4 w-4" />
            <span>Today</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/tracker'))}>
            <Grid3X3 className="mr-2 h-4 w-4" />
            <span>Habit Tracker</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/goals'))}>
            <Target className="mr-2 h-4 w-4" />
            <span>Goals</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/tasks'))}>
            <ListTodo className="mr-2 h-4 w-4" />
            <span>Tasks</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => router.push('/journal'))}>
            <BookOpen className="mr-2 h-4 w-4" />
            <span>Journal</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        {/* Placeholder for dynamic search results */}
      </CommandList>
    </CommandDialog>
  );
}
