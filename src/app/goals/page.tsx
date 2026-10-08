import connectDB from '@/lib/db';
import Goal from '@/models/Goal';
import Habit from '@/models/Habit';
import GoalsList from '@/components/goals/GoalsList';
import { IGoal } from '@/types';

import { connection } from 'next/server';

export default async function GoalsPage() {
  await connection();
  await connectDB();
  
  // Fetch goals and habits
  const goals = await Goal.find({}).sort({ createdAt: -1 }).lean();
  const habits = await Habit.find({}).sort({ title: 1 }).lean();
  
  // Serialize for client
  const serializedGoals = JSON.parse(JSON.stringify(goals));
  const serializedHabits = JSON.parse(JSON.stringify(habits));

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Goals</h1>
          <p className="text-zinc-400 mt-2">Track your long-term objectives and progress</p>
        </div>
      </div>
      
      <GoalsList initialGoals={serializedGoals} habits={serializedHabits} />
    </div>
  );
}
