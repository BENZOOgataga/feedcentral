'use client';

import { useState } from 'react';
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

interface AddSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  categories?: Array<{ id: string; name: string }>;
}

export function AddSourceDialog({
  open,
  onOpenChange,
  onSuccess,
  categories = [],
}: AddSourceDialogProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [feedUrl, setFeedUrl] = useState('');
  const [customName, setCustomName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(false);

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedUrl.trim()) {
      toast({
        title: 'Error',
        description: t('sources.mySources.addDialog.feedUrl.required'),
        variant: 'destructive',
      });
      return;
    }

    if (!isValidUrl(feedUrl.trim())) {
      toast({
        title: 'Error',
        description: t('sources.mySources.addDialog.feedUrl.invalid'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/user/sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedUrl: feedUrl.trim(),
          customName: customName.trim() || undefined,
          categoryId: categoryId || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: t('sources.mySources.addDialog.success'),
        });
        setFeedUrl('');
        setCustomName('');
        setCategoryId('');
        onOpenChange(false);
        onSuccess();
      } else {
        // Handle specific error messages
        let errorMessage = data.message || data.error || t('sources.mySources.addDialog.errors.unknown');
        
        if (data.error?.includes('already added')) {
          errorMessage = t('sources.mySources.addDialog.errors.duplicate');
        } else if (data.error?.includes('Invalid RSS')) {
          errorMessage = t('sources.mySources.addDialog.errors.invalidFeed');
        } else if (data.upgradeRequired || data.error?.includes('limit')) {
          errorMessage = t('sources.mySources.addDialog.errors.limitReached');
        }

        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: t('sources.mySources.addDialog.errors.network'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('sources.mySources.addDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('sources.mySources.addDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Feed URL */}
          <div>
            <label htmlFor="feedUrl" className="block text-sm font-medium mb-2">
              {t('sources.mySources.addDialog.feedUrl.label')}
            </label>
            <Input
              id="feedUrl"
              type="url"
              value={feedUrl}
              onChange={(e) => setFeedUrl(e.target.value)}
              placeholder={t('sources.mySources.addDialog.feedUrl.placeholder')}
              className="w-full"
              disabled={loading}
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
              placeholder={t('sources.mySources.addDialog.customName.placeholder')}
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              {t('sources.mySources.addDialog.buttons.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('sources.mySources.addDialog.adding')}
                </>
              ) : (
                t('sources.mySources.addDialog.buttons.add')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
