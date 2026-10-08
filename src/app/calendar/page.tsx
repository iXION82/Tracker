import connectDB from '@/lib/db';
import CalendarView from '@/components/calendar/CalendarView';
import HabitLog from '@/models/HabitLog';
import Task from '@/models/Task';
import JournalEntry from '@/models/JournalEntry';
import MoodEntry from '@/models/MoodEntry';
import SleepEntry from '@/models/SleepEntry';
import TimeEntry from '@/models/TimeEntry';
import Habit from '@/models/Habit';
import { toDateString } from '@/lib/date-utils';

import { connection } from 'next/server';

export default async function CalendarPage() {
  await connection();
  await connectDB();

  const today = new Date();
  const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1);
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);

  const startStr = toDateString(threeMonthsAgo);
  const endStr = toDateString(nextMonth);

  const habits = await Habit.find({}).lean();
  const habitLogs = await HabitLog.find({
    date: { $gte: startStr, $lte: endStr },
  }).lean();
  const tasks = await Task.find({}).lean();
  const journalEntries = await JournalEntry.find({
    date: { $gte: startStr, $lte: endStr },
  }).lean();
  const moodEntries = await MoodEntry.find({
    date: { $gte: startStr, $lte: endStr },
  }).lean();
  const sleepEntries = await SleepEntry.find({
    date: { $gte: startStr, $lte: endStr },
  }).lean();
  const timeEntries = await TimeEntry.find({
    date: { $gte: startStr, $lte: endStr },
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
