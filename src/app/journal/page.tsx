import connectDB from '@/lib/db';
import JournalEntry from '@/models/JournalEntry';
import MoodEntry from '@/models/MoodEntry';
import JournalList from '@/components/journal/JournalList';
import MoodOverview from '@/components/journal/MoodOverview';
import { startOfMonth, endOfMonth } from 'date-fns';

export const dynamic = 'force-dynamic';

export default async function JournalPage() {
  await connectDB();
  
  // Fetch journal entries
  const entries = await JournalEntry.find({}).sort({ date: -1 }).lean();
  
  // Fetch mood entries for current month
  const today = new Date();
  const start = startOfMonth(today);
  const end = endOfMonth(today);
  
  const moodEntries = await MoodEntry.find({
    date: {
      $gte: start,
      $lte: end
    }
  }).lean();

  const journalEntries = JSON.parse(JSON.stringify(entries));
  const parsedMoodEntries = JSON.parse(JSON.stringify(moodEntries));

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Journal</h1>
        <p className="text-zinc-400 mt-2">Document your thoughts and track your mood</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <JournalList initialEntries={journalEntries} />
        </div>
        <div className="lg:col-span-1">
          <MoodOverview moodEntries={parsedMoodEntries} />
        </div>
      </div>
    </div>
  );
}
