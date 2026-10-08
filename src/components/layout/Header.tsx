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
    { label: 'Today', href: '/today' },
    { label: 'Tracker', href: '/tracker' },
    { label: 'Analytics', href: '/analytics' },
    { label: 'Goals', href: '/goals' },
    { label: 'Journal', href: '/journal' },
  ];

  const triggerSearch = () => {
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }));
  };

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

      <div className="flex items-center space-x-2 md:space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="hidden md:flex h-9 text-muted-foreground w-48 justify-between bg-black/20 border-white/10 hover:bg-white/5"
          onClick={triggerSearch}
        >
          <span className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Search...
          </span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">Ctrl K</span>
          </kbd>
        </Button>

        <Button variant="ghost" size="icon" className="md:hidden text-zinc-400" onClick={triggerSearch}>
          <Search className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-foreground">
          <Bell className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-8 w-8 border border-white/10 ml-2 cursor-pointer transition-transform hover:scale-105">
          <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">ME</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
