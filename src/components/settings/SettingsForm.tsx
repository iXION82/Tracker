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
    theme: 'dark',
    dashboardWidgets: {
      habits: true,
      tasks: true,
      mood: true,
      time: true
    },
    lifeScoreWeights: {
      health: 20,
      productivity: 30,
      mindfulness: 20,
      learning: 30
    }
  });

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
    setSettings({
      ...settings,
      dashboardWidgets: {
        ...settings.dashboardWidgets,
        [widget]: checked
      }
    });
  };

  const totalWeight = Object.values(settings.lifeScoreWeights).reduce((a: any, b: any) => a + b, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
      {/* Sidebar navigation could go here, for now it's a single long scrollable view */}
      
      <div className="md:col-span-4 space-y-6">
        <div className="flex justify-between items-center bg-[#111113] p-4 rounded-xl border border-white/5 sticky top-4 z-10">
          <div>
            <h2 className="text-lg font-medium text-white">Save Changes</h2>
            <p className="text-sm text-zinc-400">Apply your settings modifications</p>
          </div>
          <Button onClick={handleSave} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>

        <Card className="bg-[#111113] border-white/5 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-500" /> Profile
            </CardTitle>
            <CardDescription className="text-zinc-400">Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2 max-w-md">
              <Label>Display Name</Label>
              <Input defaultValue="User" className="bg-[#18181B] border-white/10" />
            </div>
            <div className="space-y-2">
              <Label>Avatar</Label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#18181B] border border-white/10 flex items-center justify-center text-xl text-zinc-500">
                  U
                </div>
                <Button variant="outline" className="border-white/10">Upload Image</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111113] border-white/5 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-500" /> Appearance
            </CardTitle>
            <CardDescription className="text-zinc-400">Customize how LifeOS looks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Theme</Label>
              <div className="flex gap-4">
                <div className="w-32 h-24 rounded-lg bg-[#0A0A0B] border-2 border-blue-500 flex items-center justify-center cursor-pointer">
                  <span className="text-sm font-medium">Dark Mode</span>
                </div>
                <div className="w-32 h-24 rounded-lg bg-zinc-100 border border-transparent flex items-center justify-center opacity-50 cursor-not-allowed">
                  <span className="text-sm font-medium text-zinc-900">Light (Soon)</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111113] border-white/5 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-green-500" /> Dashboard Layout
            </CardTitle>
            <CardDescription className="text-zinc-400">Show or hide widgets on your home screen</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 max-w-md">
            {Object.entries(settings.dashboardWidgets).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <Label className="capitalize">{key} Widget</Label>
                <Switch 
                  checked={value as boolean} 
                  onCheckedChange={(c) => handleWidgetToggle(key, c)}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-[#111113] border-white/5 text-white">
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
                  className="py-2"
                />
              </div>
            ))}
            {totalWeight !== 100 && (
              <div className="text-red-400 text-sm mt-2">
                Weights must total exactly 100%. Please adjust the sliders.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-[#111113] border-white/5 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="w-5 h-5 text-zinc-400" /> Keyboard Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 max-w-lg">
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-300">New Task</span>
                <kbd className="px-2 py-1 bg-[#18181B] rounded text-xs text-zinc-400">T</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-300">New Journal</span>
                <kbd className="px-2 py-1 bg-[#18181B] rounded text-xs text-zinc-400">J</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-300">Start Timer</span>
                <kbd className="px-2 py-1 bg-[#18181B] rounded text-xs text-zinc-400">S</kbd>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/5">
                <span className="text-zinc-300">Go to Dashboard</span>
                <kbd className="px-2 py-1 bg-[#18181B] rounded text-xs text-zinc-400">G D</kbd>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#111113] border-white/5 text-white border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
            <CardDescription className="text-zinc-400">Manage your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#18181B] rounded-lg border border-white/5">
              <div>
                <h4 className="font-medium text-white">Export Data</h4>
                <p className="text-sm text-zinc-400">Download all your data as JSON</p>
              </div>
              <Button variant="outline" className="border-white/10">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-[#18181B] rounded-lg border border-red-500/10">
              <div>
                <h4 className="font-medium text-red-400">Reset Account</h4>
                <p className="text-sm text-zinc-400">Permanently delete all your data</p>
              </div>
              <Button variant="destructive" className="bg-red-900/50 hover:bg-red-900 text-red-200">
                <RotateCcw className="w-4 h-4 mr-2" /> Reset Data
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
