'use client';

import { Search, User } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface TopNavProps {
  onSearchClick?: () => void;
}

export function TopNav({ onSearchClick }: TopNavProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
    >
      <div className="content-container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">FC</span>
          </div>
          <span className="text-lg font-semibold tracking-tight">FeedCentral</span>
        </Link>

        {/* Center - Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full group">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-hover:text-foreground" />
            <Input
              type="text"
              placeholder="Search articles... (Cmd+K)"
              onClick={onSearchClick}
              readOnly
              className="w-full pl-10 pr-20 h-9 bg-muted/50 border-border-glass cursor-pointer transition-all duration-200 hover:bg-muted focus:ring-2 focus:ring-primary/20"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right - Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={onSearchClick}
            aria-label="Search"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme toggle */}
          <ThemeToggle />

          {/* User profile */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 transition-all duration-200 hover:bg-muted hover:scale-105 active:scale-95"
            aria-label="User profile"
          >
            <User className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.header>
  );
}
