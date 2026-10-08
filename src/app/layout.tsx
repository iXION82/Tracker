import type { Metadata } from 'next';
import React, { Suspense } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import { Header } from '@/components/layout/Header';
import { SearchDialog } from '@/components/shared/SearchDialog';
import { KeyboardShortcuts } from '@/components/shared/KeyboardShortcuts';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LifeOS',
  description: 'Track everything in your life',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground flex min-h-screen antialiased`}>
        <TooltipProvider>
          <Sidebar />
          <main className="flex-1 overflow-auto flex flex-col min-h-screen relative">
            <Header />
            <div className="flex-1 pb-16 md:pb-0">
              <Suspense fallback={<div className="flex h-full items-center justify-center text-zinc-500">Loading LifeOS...</div>}>
                {children}
              </Suspense>
            </div>
            <MobileNav />
          </main>
          <SearchDialog />
          <KeyboardShortcuts />
          <Toaster theme="dark" />
        </TooltipProvider>
      </body>
    </html>
  );
}
