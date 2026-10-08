import connectDB from '@/lib/db';
import UserSettings from '@/models/UserSettings';
import SettingsForm from '@/components/settings/SettingsForm';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  await connectDB();
  
  let settings = await UserSettings.findOne({}).lean();
  
  if (!settings) {
    settings = {
      theme: 'dark',
      dashboardWidgets: {
        habits: true,
        tasks: true,
        mood: true,
        time: true
      },
      lifeScoreWeights: {
        health: 25,
        productivity: 25,
        mindfulness: 25,
        learning: 25
      }
    };
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
