'use client';

import { useState, useEffect } from 'react';
import { useRequireAdmin } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AddSourceDialog } from '@/components/admin/AddSourceDialog';
import { toast } from '@/lib/hooks/useToast';
import { Plus, Search, Globe, Power, PowerOff } from 'lucide-react';

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
    <div className="min-h-screen bg-background px-6 py-8 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <AddSourceDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSuccess={fetchSources}
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">RSS Sources</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Manage RSS feed sources and monitoring
            </p>
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Source
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search sources..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Sources List */}
        <div className="space-y-3">
          {filteredSources.map((source) => (
            <div
              key={source.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-5 hover:shadow-md transition-all"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="font-semibold text-foreground">{source.name}</h3>
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
                    className="text-xs border"
                  >
                    {source.category.name}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" />
                    <span className="truncate max-w-md">{source.url}</span>
                  </span>
                  <span className="font-medium">{source._count.articles} articles</span>
                  {source.lastFetchedAt && (
                    <span>
                      Last fetched: {new Date(source.lastFetchedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSource(source.id, source.isActive)}
                  className="gap-2"
                >
                  {source.isActive ? (
                    <>
                      <PowerOff className="w-4 h-4" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <Power className="w-4 h-4" />
                      Activate
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))}

          {filteredSources.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-lg">No sources found</p>
              <p className="text-sm mt-1">
                {search ? 'Try adjusting your search' : 'Add your first RSS source to get started'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
