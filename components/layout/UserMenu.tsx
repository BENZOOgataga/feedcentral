'use client';

import { useState, useRef, useEffect } from 'react';
import { User, LogOut, Settings, Shield } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="ghost" size="sm">
          Sign In
        </Button>
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 transition-all duration-200 hover:bg-muted hover:scale-105 active:scale-95"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="User menu"
      >
        <User className="h-4 w-4" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-white/10 bg-neutral-900 shadow-lg">
          {/* User Info */}
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-neutral-400 truncate">{user.email}</p>
            {user.role === 'ADMIN' && (
              <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-400">
                <Shield className="h-3 w-3" />
                Admin
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-white/5 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="h-4 w-4" />
                Admin Dashboard
              </Link>
            )}

            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-300 hover:bg-white/5 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
