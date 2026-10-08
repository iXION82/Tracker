'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    const path = pathname.split('/')[1];
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  const quickNav = [
    { label: 'Dashboard', href: '/' },
    { label: 'Tracker', href: '/tracker' },
    { label: 'My', href: '/my' },
    { label: 'Goals', href: '/goals' },
    { label: 'Bad Habits', href: '/bad-habits' },
    { label: 'Analytics', href: '/analytics' },
  ];

  return (
    <header 
      className={cn(
        "sticky top-0 z-40 w-full flex h-16 items-center justify-between px-4 md:px-6 transition-all duration-200",
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-white/5" : "bg-transparent border-transparent"
      )}
    >
      <div className="flex items-center flex-1">
        <h1 className="text-xl font-semibold tracking-tight mr-8 hidden sm:block">{getPageTitle()}</h1>
        
        <nav className="hidden lg:flex items-center space-x-1">
          {quickNav.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-foreground h-8 px-3 text-sm">
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
