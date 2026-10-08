import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import UserSettings from '@/models/UserSettings';

export async function GET(request: Request) {
  try {
    await connectDB();
    
    let settings = await UserSettings.findOne();
    if (!settings) {
      settings = await UserSettings.create({
        theme: 'dark',
        accentColor: 'blue',
        weekStartsOn: 1, // Monday
        notifications: {
          dailyReminder: true,
          emailUpdates: false
        }
      });
    }
    
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    const settings = await UserSettings.findOneAndUpdate(
      {},
      body,
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}
