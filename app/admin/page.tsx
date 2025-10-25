'use client';

import { Settings, Rss, Users, Activity, TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRequireAdmin } from '@/lib/hooks/useAuth';
import { useEffect, useState } from 'react';

export default function AdminPanel() {
  const { user, isLoading } = useRequireAdmin();
  const [stats, setStats] = useState({
    totalSources: 0,
    activeSources: 0,
    totalArticles: 0,
    recentJobs: 0,
  });

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  async function fetchStats() {
    try {
      const startTime = Date.now();
      const response = await fetch('/api/stats');
      const data = await response.json();
      if (data.success) {
        setStats({
          totalSources: data.data.activeSources || 0,
          activeSources: data.data.activeSources || 0,
          totalArticles: data.data.totalArticles || 0,
          recentJobs: data.data.recentJobs?.length || 0,
        });
      }

      // Ensure minimum loading time of 800ms for smoother UX
      const elapsed = Date.now() - startTime;
      const minLoadTime = 800;
      if (elapsed < minLoadTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsed));
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const statCards = [
    {
      title: 'Total Sources',
      value: stats.totalSources,
      icon: Rss,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Active Sources',
      value: stats.activeSources,
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Total Articles',
      value: stats.totalArticles,
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Recent Jobs',
      value: stats.recentJobs,
      icon: Clock,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
    },
  ];

  const adminSections = [
    {
      title: 'RSS Sources',
      description: 'Manage feed sources and subscriptions',
      icon: Rss,
      href: '/admin/sources',
      color: 'text-blue-500',
    },
    {
      title: 'Feed Jobs',
      description: 'Monitor RSS fetch jobs and logs',
      icon: Activity,
      href: '/admin/jobs',
      color: 'text-green-500',
    },
    {
      title: 'Users',
      description: 'Manage accounts and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'text-purple-500',
    },
    {
      title: 'Settings',
      description: 'Configure application settings',
      icon: Settings,
      href: '/admin/settings',
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="content-container px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Dashboard Overview
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back, {user.name}. Here's what's happening with your feed aggregator.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="rounded-lg border border-border bg-card p-6 transition-all hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="mt-2 text-3xl font-bold text-foreground">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`rounded-full p-3 ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your FeedCentral instance
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 transition-all hover:border-border/80 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Icon className={`mb-3 h-6 w-6 ${section.color}`} />
                    <h3 className="mb-1 font-semibold text-foreground">
                      {section.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                  <div className="text-muted-foreground/50 transition-transform group-hover:translate-x-1">
                    →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
