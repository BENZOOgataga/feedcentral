import { Settings, Rss, Users, Activity } from 'lucide-react';
import Link from 'next/link';

export default function AdminPanel() {
  const adminSections = [
    {
      title: 'RSS Sources',
      description: 'Manage your feed sources and subscriptions',
      icon: Rss,
      href: '/admin/sources',
    },
    {
      title: 'Feed Jobs',
      description: 'Monitor RSS fetch jobs and logs',
      icon: Activity,
      href: '/admin/jobs',
    },
    {
      title: 'Users',
      description: 'Manage user accounts and permissions',
      icon: Users,
      href: '/admin/users',
    },
    {
      title: 'Settings',
      description: 'Configure global application settings',
      icon: Settings,
      href: '/admin/settings',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="content-container px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Admin Panel
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage FeedCentral sources, jobs, and settings
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.href}
                href={section.href}
                className="group block rounded-xl border border-border/50 bg-card p-6 transition-all hover:-translate-y-1 hover:border-border hover:shadow-lg"
              >
                <Icon className="mb-4 h-8 w-8 text-primary transition-transform group-hover:scale-110" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {section.title}
                </h3>
                <p className="text-sm text-muted-foreground">{section.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
