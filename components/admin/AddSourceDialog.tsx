'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/lib/hooks/useToast';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface AddSourceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddSourceDialog({ open, onOpenChange, onSuccess }: AddSourceDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    feedUrl: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Fetch categories when dialog opens
  useState(() => {
    if (open) {
      fetchCategories();
    }
  });

  async function fetchCategories() {
    setLoadingCategories(true);
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      toast({
        title: 'Error',
        description: 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setLoadingCategories(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
          title: 'Success',
          description: 'RSS source added successfully',
          variant: 'success',
        });
        
        // Reset form
        setFormData({
          name: '',
          url: '',
          feedUrl: '',
          categoryId: '',
        });
        
        onSuccess();
        onOpenChange(false);
      } else {
        throw new Error(data.error || 'Failed to add source');
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add RSS source',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add RSS Source</DialogTitle>
          <DialogDescription>
            Add a new RSS feed source to aggregate articles from.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Source Name
              </label>
              <Input
                id="name"
                placeholder="e.g., TechCrunch"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="url" className="text-sm font-medium">
                Website URL
              </label>
              <Input
                id="url"
                type="url"
                placeholder="https://techcrunch.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="feedUrl" className="text-sm font-medium">
                RSS Feed URL
              </label>
              <Input
                id="feedUrl"
                type="url"
                placeholder="https://techcrunch.com/feed/"
                value={formData.feedUrl}
                onChange={(e) => setFormData({ ...formData, feedUrl: e.target.value })}
                required
              />
              <p className="text-xs text-neutral-400">
                The direct URL to the RSS/Atom feed
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full rounded-md border border-white/10 bg-neutral-900 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={loadingCategories}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Source'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
