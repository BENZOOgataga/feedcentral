'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Tab {
  label: string;
  href: string;
  value: string;
}

interface AppTabsProps {
  tabs: Tab[];
}

export function AppTabs({ tabs }: AppTabsProps) {
  const pathname = usePathname();

  const getCurrentTab = () => {
    // First try exact match
    const exactMatch = tabs.find((tab) => pathname === tab.href);
    if (exactMatch) return exactMatch.value;

    // Then try prefix match (for nested routes), but ensure it's a real path segment
    const prefixMatch = tabs.find((tab) => {
      if (tab.href === '/app') return false; // Don't match /app for /app/category
      return pathname?.startsWith(`${tab.href}/`) || pathname?.startsWith(`${tab.href}?`);
    });
    
    return prefixMatch?.value || tabs[0]?.value;
  };

  const activeTab = getCurrentTab();

  return (
    <div className="border-b border-border/40 bg-background/50">
      <div className="content-container px-4 sm:px-6">
        <nav className="flex gap-6 overflow-x-auto scrollbar-hide" aria-label="Category navigation">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.value;

            return (
              <Link
                key={tab.value}
                href={tab.href}
                className={cn(
                  'relative flex h-12 items-center whitespace-nowrap text-sm font-medium transition-colors',
                  'hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="app-tabs-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 40,
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
