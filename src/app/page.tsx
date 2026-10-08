import DashboardClient from "@/components/dashboard-v2/DashboardClient";
import { connection } from 'next/server';

export default async function DashboardPage() {
  // Opt into dynamic rendering
  await connection();
  
  return <DashboardClient />;
}
