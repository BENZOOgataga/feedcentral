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
import { Loader2, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface DeleteSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  source: {
    id: string;
    customName: string | null;
    feedTitle: string | null;
    feedUrl: string;
  } | null;
}

export function DeleteSourceDialog({
  open,
  onOpenChange,
  onSuccess,
  source,
}: DeleteSourceDialogProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!source) return;

    try {
      setLoading(true);

      const response = await fetch(`/api/user/sources/${source.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Success',
          description: data.message || 'Source deleted successfully',
        });
        onOpenChange(false);
        onSuccess();
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to delete source',
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
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>{t('sources.mySources.deleteDialog.title')}</DialogTitle>
          </div>
          <DialogDescription className="pt-4">
            {t('sources.mySources.deleteDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-4 rounded-lg bg-muted border border-border">
            <p className="font-medium mb-1">
              {source.customName || source.feedTitle || 'Unnamed Source'}
            </p>
            <p className="text-sm text-muted-foreground break-all">
              {source.feedUrl}
            </p>
          </div>

          <p className="mt-4 text-sm text-destructive font-medium">
            {t('sources.mySources.deleteDialog.warning')}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t('sources.mySources.deleteDialog.buttons.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('common.loading')}
              </>
            ) : (
              t('sources.mySources.deleteDialog.buttons.delete')
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
