'use client';

import { LayoutDashboard, Rss, Activity, Users, Settings, ChevronLeft } from 'lucide-react';
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

const adminNavItems: NavItem[] = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Sources', href: '/admin/sources', icon: Rss },
  { name: 'Feed Jobs', href: '/admin/jobs', icon: Activity },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSideNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-16 bottom-0 z-40 flex w-64 flex-col border-r border-border/40 bg-background/95 backdrop-blur">
      {/* Header */}
      <div className="border-b border-border/40 px-6 py-4">
        <Link
          href="/app"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Feed
        </Link>
        <h2 className="mt-4 text-lg font-semibold text-foreground">
          Admin Panel
        </h2>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your FeedCentral
        </p>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 overflow-y-auto py-4">
        <TooltipProvider delayDuration={0}>
          <div className="space-y-1 px-3">
            {adminNavItems.map((item) => {
              const isActive = item.href === '/admin' 
                ? pathname === '/admin'
                : pathname?.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                        'hover:bg-muted active:scale-[0.98]',
                        isActive
                          ? 'bg-muted text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="admin-sidebar-indicator"
                          className="absolute -left-3 h-8 w-1 rounded-r-full bg-primary"
                          transition={{
                            type: 'spring',
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                      <Icon className="h-5 w-5 shrink-0" />
                      <span className="flex-1">{item.name}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </div>

      {/* Footer */}
      <div className="border-t border-border/40 px-6 py-4">
        <p className="text-xs text-muted-foreground">
          FeedCentral Admin v1.0
        </p>
      </div>
    </nav>
  );
}
