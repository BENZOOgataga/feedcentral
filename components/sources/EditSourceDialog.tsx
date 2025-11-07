'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface EditSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  source: {
    id: string;
    customName: string | null;
    feedTitle: string | null;
    feedUrl: string;
    categoryId: string | null;
    isEnabled: boolean;
  } | null;
  categories?: Array<{ id: string; name: string }>;
}

export function EditSourceDialog({
  open,
  onOpenChange,
  onSuccess,
  source,
  categories = [],
}: EditSourceDialogProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [customName, setCustomName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);

  // Update form when source changes
  useEffect(() => {
    if (source) {
      setCustomName(source.customName || '');
      setCategoryId(source.categoryId || '');
      setIsEnabled(source.isEnabled);
    }
  }, [source]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!source) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/user/sources/${source.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customName: customName.trim() || null,
          categoryId: categoryId || null,
          isEnabled,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: data.message || 'Source updated successfully',
        });
        onOpenChange(false);
        onSuccess();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to update source',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Network error, please try again',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!source) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('sources.mySources.editDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('sources.mySources.editDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Feed URL (read-only) */}
          <div>
            <label htmlFor="feedUrl" className="block text-sm font-medium mb-2">
              {t('sources.mySources.addDialog.feedUrl.label')}
            </label>
            <Input
              id="feedUrl"
              type="url"
              value={source.feedUrl}
              disabled
              className="w-full bg-muted"
            />
          </div>

          {/* Custom Name */}
          <div>
            <label htmlFor="customName" className="block text-sm font-medium mb-2">
              {t('sources.mySources.addDialog.customName.label')}
            </label>
            <Input
              id="customName"
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder={source.feedTitle || t('sources.mySources.addDialog.customName.placeholder')}
              className="w-full"
              disabled={loading}
            />
          </div>

          {/* Category */}
          {categories.length > 0 && (
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                {t('sources.mySources.addDialog.category.label')}
              </label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                disabled={loading}
              >
                <option value="">
                  {t('sources.mySources.addDialog.category.none')}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Enable/Disable */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isEnabled"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="h-4 w-4 rounded border-input"
              disabled={loading}
            />
            <label htmlFor="isEnabled" className="text-sm font-medium">
              {t('sources.mySources.sourceCard.enabled')}
            </label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('sources.mySources.editDialog.buttons.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                t('sources.mySources.editDialog.buttons.save')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
