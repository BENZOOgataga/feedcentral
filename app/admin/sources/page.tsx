'use client';

import { useState, useEffect } from 'react';
import { useRequireAdmin } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AddSourceDialog } from '@/components/admin/AddSourceDialog';
import { toast } from '@/lib/hooks/useToast';
import { Plus, Search, Globe, Power, PowerOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Source {
  id: string;
  name: string;
  url: string;
  feedUrl: string;
  isActive: boolean;
  lastFetchedAt: string | null;
  category: {
    name: string;
    color: string;
  };
  _count: {
    articles: number;
    feedJobs: number;
  };
}

export default function AdminSourcesPage() {
  const { user, isLoading: authLoading } = useRequireAdmin();
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    if (user) {
      fetchSources();
    }
  }, [user]);

  async function fetchSources() {
    try {
      const startTime = Date.now();
      const response = await fetch('/api/admin/sources');
      const data = await response.json();
      
      if (data.success) {
        setSources(data.data);
      }

      // Ensure minimum loading time of 1 second for smoother UX
      const elapsed = Date.now() - startTime;
      const minLoadTime = 1000;
      if (elapsed < minLoadTime) {
        await new Promise(resolve => setTimeout(resolve, minLoadTime - elapsed));
      }
    } catch (error) {
      console.error('Failed to fetch sources:', error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleSource(id: string, currentStatus: boolean) {
    try {
      const response = await fetch(`/api/admin/sources/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchSources();
        toast({
          title: 'Success',
          description: `Source ${!currentStatus ? 'activated' : 'deactivated'} successfully`,
          variant: 'success',
        });
      } else {
        throw new Error('Failed to toggle source');
      }
    } catch (error) {
      console.error('Failed to toggle source:', error);
      toast({
        title: 'Error',
        description: 'Failed to update source status',
        variant: 'destructive',
      });
    }
  }

  const filteredSources = sources.filter(source =>
    source.name.toLowerCase().includes(search.toLowerCase()) ||
    source.url.toLowerCase().includes(search.toLowerCase())
  );

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-neutral-400">Loading sources...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="content-container px-4 py-6 sm:px-6">
      <div className="space-y-6">
        <AddSourceDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={fetchSources}
        />
        
        {/* Back to Admin */}
        <div>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Panel
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">RSS Sources</h1>
          <p className="text-sm text-neutral-400 mt-1">
            Manage RSS feed sources and monitoring
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Source
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          placeholder="Search sources..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2">
        {filteredSources.map((source) => (
          <div
            key={source.id}
            className="flex items-center justify-between rounded-lg border border-white/10 bg-neutral-900 p-4 hover:bg-neutral-800/50 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3">
                <h3 className="font-medium text-white">{source.name}</h3>
                <Badge
                  variant={source.isActive ? 'default' : 'secondary'}
                  className="text-xs"
                >
                  {source.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Badge
                  style={{
                    backgroundColor: source.category.color + '20',
                    color: source.category.color,
                    borderColor: source.category.color + '40',
                  }}
                  className="text-xs"
                >
                  {source.category.name}
                </Badge>
              </div>
              <div className="flex items-center gap-4 mt-1 text-sm text-neutral-400">
                <span className="flex items-center gap-1">
                  <Globe className="w-3 h-3" />
                  {source.url}
                </span>
                <span>{source._count.articles} articles</span>
                {source.lastFetchedAt && (
                  <span>
                    Last: {new Date(source.lastFetchedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleSource(source.id, source.isActive)}
              >
                {source.isActive ? (
                  <PowerOff className="w-4 h-4" />
                ) : (
                  <Power className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        ))}

        {filteredSources.length === 0 && (
          <div className="text-center py-12 text-neutral-400">
            No sources found
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
