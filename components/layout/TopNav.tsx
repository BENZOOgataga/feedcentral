'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { UserMenu } from '@/components/layout/UserMenu';
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
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
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
        <div className="hidden md:flex flex-1 max-w-xl mx-8" style={{ width: '100%', maxWidth: '36rem' }}>
          <div className="relative w-full group" style={{ width: '100%' }}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-all duration-300 ease-out group-hover:text-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              onClick={onSearchClick}
              readOnly
              className="w-full pl-10 h-9 bg-muted/50 border-border-glass cursor-pointer transition-all duration-300 ease-out hover:bg-muted hover:border-border hover:shadow-sm focus:ring-2 focus:ring-primary/20"
            />
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

          {/* User menu */}
          <UserMenu />
        </div>
      </div>
    </motion.header>
  );
}
