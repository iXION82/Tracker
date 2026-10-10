'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Save, User, Palette, LayoutDashboard, Target, Download, RotateCcw, Keyboard } from 'lucide-react';

interface SettingsFormProps {
  initialSettings: any;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [settings, setSettings] = useState(initialSettings || {
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
      habits: 20
    },
    integrations: {
      githubUsername: '',
      leetcodeUsername: '',
      codeforcesUsername: ''
    }
  });

  // Ensure integrations exists
  if (!settings.integrations) {
    settings.integrations = { githubUsername: '', leetcodeUsername: '', codeforcesUsername: '' };
  }

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (res.ok) {
        toast.success('Settings saved successfully');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleWeightChange = (category: string, value: number[]) => {
    setSettings({
      ...settings,
      lifeScoreWeights: {
        ...settings.lifeScoreWeights,
        [category]: value[0]
      }
    });
  };

  const handleWidgetToggle = (widget: string, checked: boolean) => {
    const widgets = [...settings.dashboardWidgets];
    if (checked && !widgets.includes(widget)) {
      widgets.push(widget);
    } else if (!checked && widgets.includes(widget)) {
      const index = widgets.indexOf(widget);
      if (index > -1) widgets.splice(index, 1);
    }
    setSettings({ ...settings, dashboardWidgets: widgets });
  };

  const handleIntegrationChange = (platform: string, value: string) => {
    setSettings({
      ...settings,
      integrations: {
        ...settings.integrations,
        [platform]: value
      }
    });
  };

  const totalWeight = Object.values(settings.lifeScoreWeights).reduce((a: any, b: any) => a + b, 0);

  const availableWidgets = [
    { id: 'dailyCompletion', label: 'Daily Completion' },
    { id: 'currentStreak', label: 'Current Streak' },
    { id: 'habitsCompleted', label: 'Habits Completed' },
    { id: 'tasksCompleted', label: 'Tasks Completed' },
    { id: 'productivity', label: 'Productivity' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="md:col-span-4 space-y-6">
        <div className="flex justify-between items-center bg-[#111113] p-4 rounded-xl border border-white/[0.04] sticky top-4 z-10 shadow-xl">
          <div>
            <h2 className="text-lg font-medium text-white">Save Changes</h2>
            <p className="text-sm text-zinc-400">Apply your settings modifications</p>
          </div>
          <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg shadow-blue-500/20">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

        <Card className="bg-[#111113] border-white/[0.04] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" /> Profile
            </CardTitle>
            <CardDescription className="text-zinc-400">Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-w-md">
              <Label>Display Name</Label>
              <Input 
                value={settings.name} 
                onChange={(e) => setSettings({...settings, name: e.target.value})}
                className="bg-[#18181B] border-white/10 h-11 focus-visible:ring-1 focus-visible:ring-blue-500" 
              />
            </div>
            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#18181B] border border-white/10 flex items-center justify-center text-xl text-zinc-500">
                  {settings.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <Button variant="outline" className="border-white/10 hover:bg-white/5">Upload Image</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── Integrations ── */}
        <Card className="bg-[#111113] border-white/[0.04] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" /> Developer Integrations
            </CardTitle>
            <CardDescription className="text-zinc-400">Connect your accounts for Analytics tracking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label>GitHub Username</Label>
              <Input 
                value={settings.integrations.githubUsername} 
                onChange={(e) => handleIntegrationChange('githubUsername', e.target.value)}
                placeholder="e.g. torvalds"
                className="bg-[#18181B] border-white/10 h-11 focus-visible:ring-1 focus-visible:ring-purple-500" 
              />
            </div>
            <div className="space-y-2">
              <Label>LeetCode Username</Label>
              <Input 
                value={settings.integrations.leetcodeUsername} 
                onChange={(e) => handleIntegrationChange('leetcodeUsername', e.target.value)}
                placeholder="e.g. neetcode"
                className="bg-[#18181B] border-white/10 h-11 focus-visible:ring-1 focus-visible:ring-yellow-500" 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111113] border-white/[0.04] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-green-500" /> Dashboard Layout
            </CardTitle>
            <CardDescription className="text-zinc-400">Show or hide widgets on your home screen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-w-md">
            {availableWidgets.map((widget) => (
              <div key={widget.id} className="flex items-center justify-between py-2">
                <Label>{widget.label}</Label>
                <Switch 
                  checked={settings.dashboardWidgets.includes(widget.id)} 
                  onCheckedChange={(c) => handleWidgetToggle(widget.id, c)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-[#111113] border-white/[0.04] text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" /> Life Score Weights
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Adjust how different categories impact your overall Life Score. 
              Total must equal 100%. (Current: {totalWeight as number}%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 max-w-2xl">
            {Object.entries(settings.lifeScoreWeights).map(([key, value]) => (
              <div key={key} className="space-y-3">
                <div className="flex justify-between">
                  <Label className="capitalize text-zinc-300">{key}</Label>
                  <span className="text-sm text-zinc-500">{value as number}%</span>
                </div>
                <Slider
                  value={[value as number]}
                  max={100}
                  step={5}
                  onValueChange={(v) => { const val = Array.isArray(v) ? v : [v]; handleWeightChange(key, val as number[]); }}
                  className="py-2 cursor-pointer"
                />
              </div>
            ))}
            {totalWeight !== 100 && (
              <div className="text-red-400 text-sm mt-2 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                Weights must total exactly 100%. Please adjust the sliders.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
