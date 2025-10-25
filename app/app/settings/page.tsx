'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Moon, Sun, AlertTriangle, User, Mail, Edit2, Check, X, Lock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/lib/hooks/useToast';

export default function SettingsPage() {
  const { user, isLoading: authLoading, refreshUser } = useAuth();
  const router = useRouter();
  const { setTheme, theme, systemTheme } = useTheme();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [savingName, setSavingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [savingEmail, setSavingEmail] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      setNewName(user.name);
      setNewEmail(user.email);
    }
  }, [user, authLoading]);

  if (authLoading || !mounted) {
    return (
      <div className="w-full min-h-screen bg-background">
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="bg-linear-to-r from-primary/20 to-primary/5 rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-neutral-800 rounded-full animate-pulse" />
              <div className="flex-1">
                <div className="h-8 w-48 bg-neutral-800 rounded animate-pulse mb-3" />
                <div className="h-4 w-64 bg-neutral-800 rounded animate-pulse" />
              </div>
            </div>
          </div>
          {/* Content Skeleton */}
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-48 bg-neutral-800 rounded-xl animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSaveName = async () => {
    if (!newName.trim() || newName === user.name) {
      setEditingName(false);
      return;
    }

    setSavingName(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to update name');
        setSavingName(false);
        return;
      }

      // Refresh user context to get updated data
      await refreshUser();
      setEditingName(false);
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Failed to update name. Please try again.');
    } finally {
      setSavingName(false);
    }
  };

  const handleCancelEdit = () => {
    setNewName(user.name);
    setEditingName(false);
  };

  const handleSaveEmail = async () => {
    if (!newEmail.trim() || newEmail === user.email) {
      setEditingEmail(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    setSavingEmail(true);
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to update email');
        setSavingEmail(false);
        return;
      }

      // Refresh user context to get updated data
      await refreshUser();
      setEditingEmail(false);
    } catch (error) {
      console.error('Error updating email:', error);
      alert('Failed to update email. Please try again.');
    } finally {
      setSavingEmail(false);
    }
  };

  const handleCancelEmailEdit = () => {
    setNewEmail(user.email);
    setEditingEmail(false);
  };

  const handlePasswordChangeClick = () => {
    toast({
      title: "Coming Soon",
      description: "Password change feature is coming in a later update.",
      variant: "destructive",
    });
  };

  return (
    <div>
      <div className="w-full min-h-screen bg-background">
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
        
        {/* Profile Header */}
        <div className="bg-linear-to-r from-primary/20 to-primary/5 rounded-2xl p-8 mb-8 border border-primary/10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-primary to-primary/60 flex items-center justify-center text-3xl font-bold text-primary-foreground shadow-lg">
                {getInitials(editingName ? newName : user.name)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-green-500 border-4 border-background" 
                title="Active" 
              />
            </div>

            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {user.name}
              </h1>
              <p className="text-muted-foreground mb-4 flex items-center gap-2 justify-center sm:justify-start">
                <Mail className="w-4 h-4" />
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          
          {/* Appearance Section */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                Appearance
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Customize how FeedCentral looks
              </p>
            </div>

            <div className="p-6">
              <label className="text-sm font-medium text-foreground mb-3 block">
                Theme Preference
              </label>
              
              {/* Theme Selector */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Light Theme Card */}
                <button
                  onClick={() => setTheme('light')}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    !isDark
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      !isDark ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Sun className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Light</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Clean and bright</div>
                    </div>
                  </div>
                  {!isDark && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>

                {/* Dark Theme Card */}
                <button
                  onClick={() => setTheme('dark')}
                  className={`relative p-4 rounded-xl border-2 transition-all ${
                    isDark
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      isDark ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      <Moon className="w-6 h-6" />
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">Dark</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Easy on the eyes</div>
                    </div>
                  </div>
                  {isDark && (
                    <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>

              {/* Warning */}
              <div className="flex items-start gap-3 rounded-lg bg-amber-500/10 border border-amber-500/20 p-4">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-600 dark:text-amber-400 mb-1">
                    Theme refinements in progress
                  </p>
                  <p className="text-xs text-amber-600/80 dark:text-amber-400/80">
                    Some UI elements may appear inconsistent while we improve theme support. We're actively working on this.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="bg-muted/30 px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <User className="w-5 h-5" />
                Account Information
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your personal information
              </p>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* Editable Name Field */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Full Name
                  </label>
                  {editingName ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="flex-1"
                        placeholder="Enter your name"
                        disabled={savingName}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveName();
                          if (e.key === 'Escape') handleCancelEdit();
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveName}
                        disabled={savingName || !newName.trim()}
                        className="gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={savingName}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                      <span className="text-base font-medium text-foreground">
                        {user.name}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingName(true)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>

                {/* Editable Email Field */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Email Address
                  </label>
                  {editingEmail ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="email"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="flex-1"
                        placeholder="Enter your email"
                        disabled={savingEmail}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEmail();
                          if (e.key === 'Escape') handleCancelEmailEdit();
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={handleSaveEmail}
                        disabled={savingEmail || !newEmail.trim()}
                        className="gap-1"
                      >
                        <Check className="w-4 h-4" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancelEmailEdit}
                        disabled={savingEmail}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                      <span className="text-base font-medium text-foreground">
                        {user.email}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingEmail(true)}
                        className="gap-2"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>

                {/* Password Change Section */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Password
                  </label>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                    <span className="text-base font-medium text-foreground">
                      ••••••••
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handlePasswordChangeClick}
                      className="gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      Change Password
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      </div>
    </div>
  );
}
