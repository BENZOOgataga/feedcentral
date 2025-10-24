import { Bookmark } from 'lucide-react';

export default function BookmarksPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <Bookmark className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Bookmarks</h1>
        <p className="text-muted-foreground max-w-md">
          This feature is coming soon. You'll be able to save and organize your favorite articles here.
        </p>
      </div>
    </div>
  );
}
