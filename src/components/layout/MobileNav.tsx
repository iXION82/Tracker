'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarCheck, Grid3X3, BarChart3, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Dash', icon: LayoutDashboard },
  { href: '/today', label: 'Today', icon: CalendarCheck },
  { href: '/tracker', label: 'Tracker', icon: Grid3X3 },
  { href: '/analytics', label: 'Stats', icon: BarChart3 },
  { href: '/settings', label: 'More', icon: MoreHorizontal },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 h-16 bg-[#0E0E10]/90 backdrop-blur-lg border-t border-white/5 px-2">
      <nav className="flex h-full items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname?.startsWith(`${item.href}/`) && item.href !== '/');
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 relative group"
            >
              <div className={cn(
                "p-1.5 rounded-full transition-colors duration-200", 
                isActive ? "bg-primary/20 text-primary" : "text-zinc-500 group-hover:text-zinc-300"
              )}>
                <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-current")} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-zinc-500"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
