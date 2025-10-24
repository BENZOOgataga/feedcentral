'use client';

import { Home, Bookmark, Settings, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Feed', href: '/app', icon: Home },
  { name: 'Bookmarks', href: '/app/bookmarks', icon: Bookmark },
  { name: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Settings', href: '/app/settings', icon: Settings },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-16 bottom-0 z-40 hidden md:flex w-16 lg:w-20 flex-col items-center border-r border-border/40 bg-background/95 backdrop-blur py-6 gap-2">
      <TooltipProvider delayDuration={0}>
        {navItems.map((item, index) => {
          // Special handling for /app to avoid matching /app/bookmarks, /app/settings, etc.
          const isActive = item.href === '/app' 
            ? (pathname === '/app' || pathname?.startsWith('/app/') && !pathname?.match(/\/(bookmarks|dashboard|settings)/))
            : pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    'relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-200',
                    'hover:bg-muted active:scale-95',
                    isActive
                      ? 'bg-muted text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="absolute -left-[17px] h-8 w-1 rounded-r-full bg-primary"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <Icon className="h-5 w-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="text-xs">
                {item.name}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </TooltipProvider>
    </nav>
  );
}
