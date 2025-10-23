"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 glass-strong border-b border-white/[0.06]">
      <div className="flex h-[72px] items-center gap-6 px-8">
        {/* Page title */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="text-[13px] text-white/50 mt-0.5 font-medium">{description}</p>
          )}
        </div>

        {/* Search - Apple style */}
        <div className="relative w-[320px]">
          <Search className="absolute left-4 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-white/40" />
          <input
            type="search"
            placeholder="Search articles..."
            className="w-full h-[38px] pl-11 pr-4 bg-white/[0.05] border border-white/[0.08] rounded-lg text-[13px] text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all duration-200"
          />
        </div>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
