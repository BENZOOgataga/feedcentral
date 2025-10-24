import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4" style={{ width: '100%' }}>
      <div className="text-center space-y-4" style={{ width: '100%', maxWidth: '42rem' }}>
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <LayoutDashboard className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground" style={{ maxWidth: '32rem', margin: '0 auto' }}>
          This feature is coming soon. You'll see analytics and insights about your reading habits here.
        </p>
      </div>
    </div>
  );
}
