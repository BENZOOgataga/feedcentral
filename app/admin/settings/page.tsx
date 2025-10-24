'use client';

import { useState, useEffect } from 'react';
import { useRequireAdmin } from '@/lib/hooks/useAuth';
import { Settings as SettingsIcon, Save, RefreshCw, Database, Key, Globe, Bell, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';

export default function SettingsPage() {
  const { user, isLoading: authLoading } = useRequireAdmin();
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState({
    siteName: 'FeedCentral',
    siteUrl: 'http://localhost:3000',
    defaultFetchInterval: 30,
    maxArticlesPerFeed: 100,
    enableNotifications: true,
    autoRefreshFeeds: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  async function handleSave() {
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Simulate API call - implement actual save logic later
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSaveMessage('Settings saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="content-container px-4 py-8 sm:px-6">
        {/* Back to Admin */}
        <div className="mb-6">
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Panel
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure your FeedCentral instance
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border border-border bg-card">
              <div className="p-4">
                <h3 className="text-sm font-medium text-muted-foreground">Settings</h3>
              </div>
              <nav className="space-y-1">
                {[
                  { icon: Globe, label: 'General', id: 'general', available: true },
                  { icon: Database, label: 'Feed Configuration', id: 'feed', available: false },
                  { icon: Bell, label: 'Notifications', id: 'notifications', available: false },
                  { icon: Key, label: 'API Keys', id: 'api', available: false },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      disabled={!item.available}
                      className={`flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors ${
                        activeSection === item.id
                          ? 'bg-muted text-foreground'
                          : item.available
                          ? 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                          : 'text-muted-foreground/50 cursor-not-allowed'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="flex-1 text-left">{item.label}</span>
                      {!item.available && (
                        <span className="text-xs rounded-full bg-muted px-2 py-0.5">Soon</span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeSection === 'general' ? (
              <div className="space-y-6">
                {/* General Settings */}
                <div className="rounded-lg border border-border bg-card p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-primary" />
                    <h2 className="text-lg font-semibold text-foreground">General Settings</h2>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Site Name
                      </label>
                      <Input
                        type="text"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        placeholder="FeedCentral"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        The name of your feed aggregator instance
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-foreground">
                        Site URL
                      </label>
                      <Input
                        type="url"
                        value={settings.siteUrl}
                        onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                        placeholder="https://feedcentral.example.com"
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        The public URL where your instance is hosted
                      </p>
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex items-center gap-4">
                  <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                    {isSaving ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save Settings
                      </>
                    )}
                  </Button>
                  {saveMessage && (
                    <span
                      className={`text-sm ${
                        saveMessage.includes('success') ? 'text-green-500' : 'text-red-500'
                      }`}
                    >
                      {saveMessage}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              /* Coming Soon Placeholder */
              <div className="rounded-lg border border-border bg-card p-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-muted p-6 mb-4">
                    {activeSection === 'feed' && <Database className="h-12 w-12 text-muted-foreground" />}
                    {activeSection === 'notifications' && <Bell className="h-12 w-12 text-muted-foreground" />}
                    {activeSection === 'api' && <Key className="h-12 w-12 text-muted-foreground" />}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    Coming Soon
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    This settings section is currently under development and will be available in a future update.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
