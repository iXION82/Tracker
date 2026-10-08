import connectDB from '@/lib/db';
import CalendarView from '@/components/calendar/CalendarView';
import HabitLog from '@/models/HabitLog';
import Task from '@/models/Task';
import JournalEntry from '@/models/JournalEntry';
import MoodEntry from '@/models/MoodEntry';
import SleepEntry from '@/models/SleepEntry';
import TimeEntry from '@/models/TimeEntry';
import Habit from '@/models/Habit';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  await connectDB();

  // For this page, we fetch all relevant data and let the client component filter it by month/day
  // In a real app we might want to fetch only the data for the requested month, but since it's a personal app,
  // we can fetch a reasonable window or all recent data. For now, let's fetch everything or 3 months window.
  
  const today = new Date();
  const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  const dateFilter = {
    $gte: threeMonthsAgo,
    $lte: nextMonth
  };

  const habits = await Habit.find({}).lean();
  const habitLogs = await HabitLog.find({ date: dateFilter }).lean();
  const tasks = await Task.find({ dueDate: dateFilter }).lean();
  const journalEntries = await JournalEntry.find({ date: dateFilter }).lean();
  const moodEntries = await MoodEntry.find({ date: dateFilter }).lean();
  const sleepEntries = await SleepEntry.find({ date: dateFilter }).lean();
  
  const timeEntries = await TimeEntry.find({ 
    startTime: { $gte: threeMonthsAgo, $lte: nextMonth } 
  }).lean();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Calendar</h1>
        <p className="text-zinc-400 mt-2">Your life at a glance</p>
      </div>

      <CalendarView 
        habits={JSON.parse(JSON.stringify(habits))}
        habitLogs={JSON.parse(JSON.stringify(habitLogs))}
        tasks={JSON.parse(JSON.stringify(tasks))}
        journalEntries={JSON.parse(JSON.stringify(journalEntries))}
        moodEntries={JSON.parse(JSON.stringify(moodEntries))}
        sleepEntries={JSON.parse(JSON.stringify(sleepEntries))}
        timeEntries={JSON.parse(JSON.stringify(timeEntries))}
      />
    </div>
  );
}
