'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from '@/i18n-navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Plus, Rss, Loader2 } from 'lucide-react';
import { EmptyState } from '@/components/feed/EmptyState';
import { FeedSkeleton } from '@/components/feed/FeedSkeleton';
import { AddSourceDialog } from '@/components/sources/AddSourceDialog';
import { EditSourceDialog } from '@/components/sources/EditSourceDialog';
import { DeleteSourceDialog } from '@/components/sources/DeleteSourceDialog';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export default function MySourcesPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const t = useTranslations();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<'custom' | 'defaults'>('custom');
  const [customSources, setCustomSources] = useState<any[]>([]);
  const [defaultSources, setDefaultSources] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [refreshingId, setRefreshingId] = useState<string | null>(null);
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());
  const [preferences, setPreferences] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!authLoading && user) {
      fetchSources();
    } else if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading]);

  async function fetchSources() {
    try {
      setLoading(true);
      const startTime = Date.now();

      // Fetch custom sources, default sources, and user preferences in parallel
      const [customResponse, defaultResponse, preferencesResponse] = await Promise.all([
        fetch('/api/user/sources'),
        fetch('/api/sources'),
        fetch('/api/user/source-preferences'),
      ]);

      const customData = await customResponse.json();
      const defaultData = await defaultResponse.json();
      const preferencesData = await preferencesResponse.json();

      // Ensure minimum 1 second loading time for smooth UX
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, 1000 - elapsedTime);
      await new Promise(resolve => setTimeout(resolve, remainingTime));

      if (customData.sources) {
        setCustomSources(customData.sources);
        setStats(customData.stats);
      }

      if (defaultData.sources) {
        setDefaultSources(defaultData.sources);
        
        // Extract unique categories
        const uniqueCategories = defaultData.sources
          .map((s: any) => s.category)
          .filter((c: any, i: number, arr: any[]) => 
            c && arr.findIndex((cat: any) => cat?.id === c.id) === i
          );
        setCategories(uniqueCategories);
      }

      // Build preferences map (sourceId -> isEnabled)
      // Default is true if no preference exists
      if (preferencesData.preferences) {
        const prefsMap: Record<string, boolean> = {};
        preferencesData.preferences.forEach((pref: any) => {
          prefsMap[pref.sourceId] = pref.isEnabled;
        });
        setPreferences(prefsMap);
      }
    } catch (err) {
      console.error('Failed to fetch sources:', err);
    } finally {
      setLoading(false);
    }
  }

  const handleEdit = (source: any) => {
    setSelectedSource(source);
    setEditDialogOpen(true);
  };

  const handleDelete = (source: any) => {
    setSelectedSource(source);
    setDeleteDialogOpen(true);
  };

  const handleRefresh = async (source: any) => {
    try {
      setRefreshingId(source.id);

      const response = await fetch(`/api/user/sources/${source.id}/refresh`, {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: t('sources.mySources.refreshSuccess', {
            found: data.found,
            added: data.added,
          }),
        });
        fetchSources(); // Refresh the list
      } else {
        toast({
          title: 'Error',
          description: data.error || t('sources.mySources.refreshError'),
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: t('sources.mySources.refreshError'),
        variant: 'destructive',
      });
    } finally {
      setRefreshingId(null);
    }
  };

  const handleToggleDefaultSource = async (source: any, newState: boolean) => {
    try {
      // Add to toggling set for loading state
      setTogglingIds(prev => new Set(prev).add(source.id));

      // Optimistically update UI
      setPreferences(prev => ({
        ...prev,
        [source.id]: newState,
      }));

      const response = await fetch('/api/user/source-preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sourceId: source.id,
          isEnabled: newState,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Revert optimistic update on error
        setPreferences(prev => ({
          ...prev,
          [source.id]: !newState,
        }));
        
        toast({
          title: 'Error',
          description: data.error || 'Failed to update source preference',
          variant: 'destructive',
        });
      }
    } catch (error) {
      // Revert optimistic update on error
      setPreferences(prev => ({
        ...prev,
        [source.id]: !newState,
      }));
      
      toast({
        title: 'Error',
        description: 'Failed to update source preference',
        variant: 'destructive',
      });
    } finally {
      // Remove from toggling set
      setTogglingIds(prev => {
        const next = new Set(prev);
        next.delete(source.id);
        return next;
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="h-8 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-96 bg-muted rounded animate-pulse" />
          </div>
          <FeedSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Rss className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              {t('sources.mySources.title')}
            </h1>
          </div>
          <p className="text-muted-foreground">
            {t('sources.mySources.subtitle')}
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('custom')}
              className={cn(
                'pb-3 px-1 border-b-2 font-medium transition-colors',
                activeTab === 'custom'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {t('sources.mySources.tabs.custom')}
              {stats && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-muted">
                  {stats.total}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('defaults')}
              className={cn(
                'pb-3 px-1 border-b-2 font-medium transition-colors',
                activeTab === 'defaults'
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {t('sources.mySources.tabs.defaults')}
              {defaultSources.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs bg-muted">
                  {defaultSources.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'custom' ? (
          <div>
            {/* Stats Bar */}
            {stats && (
              <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-center justify-between">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        {t('sources.mySources.customSources.stats.total', { count: stats.total })}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t('sources.mySources.customSources.stats.active', { count: stats.active })}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {stats.maxSources 
                          ? t('sources.mySources.customSources.stats.limit', { 
                              current: stats.total, 
                              max: stats.maxSources 
                            })
                          : t('sources.mySources.customSources.stats.unlimited')}
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => setAddDialogOpen(true)}
                    disabled={!stats.canAddMore}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t('sources.mySources.customSources.addButton')}
                  </Button>
                </div>
              </div>
            )}

            {/* Upgrade Prompt */}
            {stats && !stats.canAddMore && (
              <div className="mb-6 p-6 rounded-lg bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20">
                <h3 className="text-lg font-semibold mb-2">
                  {t('sources.mySources.customSources.upgradePrompt.title')}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {t('sources.mySources.customSources.upgradePrompt.description')}
                </p>
                <Button variant="default">
                  {t('sources.mySources.customSources.upgradePrompt.cta')}
                </Button>
              </div>
            )}

            {/* Custom Sources List */}
            {customSources.length === 0 ? (
              <EmptyState
                title={t('sources.mySources.customSources.empty.title')}
                description={t('sources.mySources.customSources.empty.description')}
                action={{
                  label: t('sources.mySources.customSources.empty.cta'),
                  onClick: () => setAddDialogOpen(true),
                }}
              />
            ) : (
              <div className="grid gap-4">
                {customSources.map((source) => (
                  <div
                    key={source.id}
                    className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {source.customName || source.feedTitle || source.feedUrl}
                          </h3>
                          {!source.isEnabled && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-muted text-muted-foreground">
                              {t('sources.mySources.sourceCard.disabled')}
                            </span>
                          )}
                          {!source.isValid && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-destructive/10 text-destructive">
                              {t('sources.mySources.sourceCard.invalid')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {source.feedUrl}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                          <span>{t('sources.mySources.sourceCard.articles', { count: source.articleCount })}</span>

                          {typeof source.dailyImportLimit !== 'undefined' && (
                            <>
                              <span className="mx-1">•</span>
                              {source.dailyImportLimit === -1 ? (
                                <span>{t('sources.mySources.sourceCard.dailyLimit.unlimited')}</span>
                              ) : (
                                <span>
                                  {t('sources.mySources.sourceCard.dailyLimit.label')} {source.dailyImportCount} / {source.dailyImportLimit}
                                  {typeof source.dailyImportRemaining === 'number' && source.dailyImportRemaining <= 0 && (
                                    <span className="ml-2 text-destructive">({t('sources.mySources.sourceCard.dailyLimit.reached')})</span>
                                  )}
                                </span>
                              )}
                            </>
                          )}

                          {source.category && (
                            <>
                              <span className="mx-1">•</span>
                              <span>{source.category.name}</span>
                            </>
                          )}

                          <span className="mx-1">•</span>
                          <span>
                            {source.lastFetchedAt
                              ? t('sources.mySources.sourceCard.lastFetched', {
                                  date: new Date(source.lastFetchedAt).toLocaleDateString(),
                                })
                              : t('sources.mySources.sourceCard.neverFetched')}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(source)}
                        >
                          {t('sources.mySources.sourceCard.actions.edit')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRefresh(source)}
                          disabled={refreshingId === source.id}
                        >
                          {refreshingId === source.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              {t('sources.mySources.refreshing')}
                            </>
                          ) : (
                            t('sources.mySources.sourceCard.actions.refresh')
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(source)}
                        >
                          {t('sources.mySources.sourceCard.actions.delete')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            {/* Default Sources */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">
                {t('sources.mySources.defaultSources.title')}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t('sources.mySources.defaultSources.description')}
              </p>
            </div>

            {defaultSources.length === 0 ? (
              <EmptyState
                title={t('sources.mySources.defaultSources.empty')}
                description=""
              />
            ) : (
              <div>
                {/* Stats Bar */}
                <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex gap-6 text-sm">
                    <div>
                      <span className="text-muted-foreground">
                        {t('sources.mySources.defaultSources.counts.total', { 
                          count: defaultSources.length 
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        {t('sources.mySources.defaultSources.counts.enabled', { 
                          count: defaultSources.filter(s => preferences[s.id] !== false).length 
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Source List */}
                <div className="grid gap-3">
                  {defaultSources.map((source) => {
                    const isEnabled = preferences[source.id] !== false; // Default to true
                    const isToggling = togglingIds.has(source.id);

                    return (
                      <div
                        key={source.id}
                        className="p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {source.logoUrl && (
                              <img
                                src={source.logoUrl}
                                alt={source.name}
                                className="h-8 w-8 rounded object-contain"
                              />
                            )}
                            <div>
                              <h3 className="font-medium">{source.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {source.category?.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">
                              {isEnabled 
                                ? t('sources.mySources.sourceCard.statuses.enabled')
                                : t('sources.mySources.sourceCard.statuses.disabled')
                              }
                            </span>
                            <Switch
                              checked={isEnabled}
                              onCheckedChange={(checked) => handleToggleDefaultSource(source, checked)}
                              disabled={isToggling}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Source Dialog */}
      <AddSourceDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={fetchSources}
        categories={categories}
      />

      {/* Edit Source Dialog */}
      <EditSourceDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={fetchSources}
        source={selectedSource}
        categories={categories}
      />

      {/* Delete Source Dialog */}
      <DeleteSourceDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={fetchSources}
        source={selectedSource}
      />
    </div>
  );
}
