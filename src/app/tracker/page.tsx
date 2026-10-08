import { connection } from 'next/server';
import TrackerClient from '@/components/tracker/TrackerClient';

export const metadata = { title: 'Monthly Tracker | LifeOS' };

export default async function TrackerPage() {
  await connection();
  return <TrackerClient />;
}
