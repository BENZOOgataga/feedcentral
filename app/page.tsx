import { ArrowRight, CheckCircle2, Rss } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="content-container px-4 pt-24 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <Rss className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Your News,{' '}
            <span className="text-primary">Centralized</span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            FeedCentral aggregates your trusted RSS sources into a clean, modern interface.
            Stay informed without the noise.
          </p>

          {/* CTA */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2 text-base">
              <Link href="/app">
                Access Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link href="/admin">Admin Panel</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="content-container px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
            Why FeedCentral?
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: 'Verified Sources',
                description: 'Only reliable, curated RSS feeds from trusted publishers.',
              },
              {
                title: 'Clean Interface',
                description: 'No ads, no distractions. Just your content, beautifully presented.',
              },
              {
                title: 'Real-time Updates',
                description: 'Automatic feed refresh keeps you up to date with the latest news.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border/50 bg-card p-6 transition-all hover:-translate-y-1 hover:border-border hover:shadow-lg"
              >
                <CheckCircle2 className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sources Section */}
      <section className="content-container px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">
            Trusted Sources
          </h2>
          <p className="mb-8 text-muted-foreground">
            Aggregating content from leading tech publications, blogs, and news outlets.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
            {['TechCrunch', 'The Verge', 'Ars Technica', 'Wired', 'MIT Technology Review'].map(
              (source) => (
                <span key={source} className="text-sm font-medium text-muted-foreground">
                  {source}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8">
        <div className="content-container px-4 text-center text-sm text-muted-foreground sm:px-6">
          <p>© {new Date().getFullYear()} FeedCentral. Built with Next.js.</p>
        </div>
      </footer>
    </div>
  );
}
