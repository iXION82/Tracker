import connectDB from '@/lib/db';
import UserSettings from '@/models/UserSettings';
import SettingsForm from '@/components/settings/SettingsForm';

import { connection } from 'next/server';

export default async function SettingsPage() {
  await connection();
  await connectDB();

  let settings = await UserSettings.findOne({}).lean();

  if (!settings) {
    // Create default settings
    const created = await UserSettings.create({
      name: 'User',
      theme: 'dark',
      accentColor: '#3B82F6',
      dashboardWidgets: [
        'dailyCompletion',
        'currentStreak',
        'habitsCompleted',
        'tasksCompleted',
        'productivity',
      ],
      lifeScoreWeights: {
        health: 30,
        learning: 25,
        productivity: 25,
        habits: 20,
      },
    });
    settings = created.toObject();
  }

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-zinc-400 mt-2">Manage your preferences and account</p>
      </div>

      <SettingsForm initialSettings={JSON.parse(JSON.stringify(settings))} />
    </div>
  );
}
