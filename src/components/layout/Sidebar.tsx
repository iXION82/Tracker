'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Grid3X3, 
  Calendar, 
  Target, 
  ListTodo, 
  BarChart3, 
  BookOpen, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/today', label: 'Today', icon: CalendarCheck },
  { href: '/tracker', label: 'Tracker', icon: Grid3X3 },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/tasks', label: 'Tasks', icon: ListTodo },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/journal', label: 'Journal', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('lifeos:sidebar-collapsed');
    if (stored) {
      setIsCollapsed(stored === 'true');
    }
    setMounted(true);
  }, []);

  if (!mounted) return null; // Avoid hydration mismatch

  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('lifeos:sidebar-collapsed', String(newState));
  };

  return (
    <aside 
      className={cn(
        "hidden md:flex flex-col h-screen bg-[#0E0E10] border-r border-border transition-all duration-300 ease-in-out relative z-10",
        isCollapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <div className={cn("flex items-center overflow-hidden transition-all duration-300", isCollapsed ? "w-0 opacity-0" : "w-auto opacity-100")}>
          <Activity className="h-6 w-6 text-primary mr-2 flex-shrink-0" />
          <span className="font-semibold text-lg tracking-tight truncate">LifeOS</span>
        </div>
        {isCollapsed && (
          <Activity className="h-6 w-6 text-primary mx-auto flex-shrink-0" />
        )}
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleCollapse}
          className={cn("h-8 w-8 text-muted-foreground hover:text-foreground hidden md:flex", isCollapsed && "absolute -right-4 bg-background border border-border rounded-full z-20 top-4")}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`) && item.href !== '/';
          const Icon = item.icon;

          const NavLink = () => (
            <Link 
              href={item.href}
              className={cn(
                "flex items-center rounded-lg px-3 py-2.5 transition-colors group",
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-zinc-400 hover:text-foreground hover:bg-white/5",
                isCollapsed && "justify-center px-0"
              )}
            >
              <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary" : "text-zinc-400 group-hover:text-foreground")} />
              {!isCollapsed && <span className="ml-3 truncate">{item.label}</span>}
            </Link>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.href} delayDuration={0}>
                <TooltipTrigger asChild>
                  <div><NavLink /></div>
                </TooltipTrigger>
                <TooltipContent side="right" className="ml-2 bg-popover border-border">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <NavLink key={item.href} />;
        })}
      </div>

      <div className="p-3 mt-auto">
        {isCollapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Link href="/settings" className="flex items-center justify-center rounded-lg p-2.5 text-zinc-400 hover:text-foreground hover:bg-white/5 transition-colors">
                <Settings className="h-5 w-5 flex-shrink-0" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="ml-2 bg-popover border-border">Settings</TooltipContent>
          </Tooltip>
        ) : (
          <Link href="/settings" className={cn(
            "flex items-center rounded-lg px-3 py-2.5 text-zinc-400 hover:text-foreground hover:bg-white/5 transition-colors",
            pathname === '/settings' && "bg-primary/10 text-primary"
          )}>
            <Settings className="h-5 w-5 flex-shrink-0" />
            <span className="ml-3 truncate">Settings</span>
          </Link>
        )}
      </div>

      <div className={cn("px-4 py-3 border-t border-white/5", isCollapsed ? "flex justify-center" : "flex items-center")}>
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] flex-shrink-0"></div>
          {!isCollapsed && <span className="ml-2 text-xs text-zinc-500 font-medium truncate">Connected</span>}
        </div>
      </div>
    </aside>
  );
}
