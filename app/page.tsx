'use client';

import { 
  ArrowRight, 
  CheckCircle2, 
  Rss, 
  Heart, 
  FileText, 
  Shield, 
  Zap, 
  BookmarkCheck, 
  Search, 
  Palette,
  Globe,
  Lock,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ChangelogToast, useHasNewChangelog, markChangelogAsSeen } from '@/components/changelog/ChangelogNotification';

// Decorative separator with dots
function DotSeparator() {
  return (
    <div className="flex items-center justify-center gap-2 py-8">
      <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
      <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
      <div className="h-1.5 w-1.5 rounded-full bg-primary/60" />
      <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
    </div>
  );
}

// Gradient separator component
function GradientSeparator() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
  );
}

export default function LandingPage() {
  const hasNewChangelog = useHasNewChangelog();

  return (
    <div className="min-h-screen bg-background">
      <ChangelogToast />
      
      {/* Hero Section */}
      <section className="content-container px-4 pt-24 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                <path d="M4 11a9 9 0 0 1 9 9"></path>
                <path d="M4 4a16 16 0 0 1 16 16"></path>
                <circle cx="5" cy="19" r="1"></circle>
              </svg>
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
                Start Browsing
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant={hasNewChangelog ? "default" : "outline"}
              size="lg" 
              className={`gap-2 text-base relative ${hasNewChangelog ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0 shadow-lg shadow-yellow-500/50' : ''}`}
            >
              <Link href="/changelog">
                <FileText className="h-4 w-4" />
                Changelog
                {hasNewChangelog && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                  </span>
                )}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 text-base">
              <a 
                href="https://www.patreon.com/BENZOOgataga" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Heart className="h-4 w-4" />
                Support Us
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission Section with Gradient Transitions */}
      <section className="relative w-full">
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
        
        {/* Content with background */}
        <div className="bg-muted/30 py-16">
          <div className="content-container px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Our Mission
              </div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Take Back Control of Your News Feed
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                In a world of algorithmic feeds and endless scrolling, FeedCentral brings you back to the basics: 
                <span className="font-semibold text-foreground"> curated, chronological content from sources you trust</span>. 
                No engagement manipulation, no hidden agendas, just the information you choose to follow.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                We believe that staying informed shouldn't come at the cost of your privacy, attention, or sanity. 
                FeedCentral is built with transparency, simplicity, and user respect at its core.
              </p>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      </section>
      {/* Core Features Section */}
      <section className="content-container px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
            Everything You Need, Nothing You Don't
          </h2>
          <p className="mb-12 text-center text-muted-foreground max-w-2xl mx-auto">
            FeedCentral combines powerful features with a clean, distraction-free experience
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Shield,
                title: 'Verified Sources',
                description: 'Only reliable, curated RSS feeds from trusted publishers and established media outlets.',
              },
              {
                icon: Zap,
                title: 'Real-time Updates',
                description: 'Automatic feed refresh keeps you up to date with breaking news and latest publications.',
              },
              {
                icon: BookmarkCheck,
                title: 'Smart Bookmarks',
                description: 'Save articles permanently with one click. Bookmarked content never expires.',
              },
              {
                icon: Search,
                title: 'Powerful Search',
                description: 'Full-text search across all articles with advanced filtering by source and category.',
              },
              {
                icon: Palette,
                title: 'Beautiful Design',
                description: 'Clean, modern interface with dark mode support and responsive design for all devices.',
              },
              {
                icon: Globe,
                title: 'Open Source',
                description: 'Fully transparent codebase. Fork it, self-host it, or contribute to make it better.',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border/50 bg-card p-6 transition-all hover:-translate-y-1 hover:border-border hover:shadow-lg"
              >
                <feature.icon className="mb-4 h-8 w-8 text-primary" />
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy & Trust Section with Gradient Transitions */}
      <section className="relative w-full">
        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
        
        {/* Content with background */}
        <div className="bg-muted/30 py-16">
          <div className="content-container px-4 sm:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Lock className="h-4 w-4" />
                  Privacy First
                </div>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
                  Your Data Stays Yours
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  We take privacy seriously. Here's our commitment to you.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {[
                  {
                    title: 'No Tracking',
                    description: 'We don\'t use analytics, cookies, or any tracking tools. Your browsing habits are yours alone.',
                  },
                  {
                    title: 'No Ads',
                    description: 'Zero advertising. Our mission is to serve you, not advertisers. Support us directly if you want.',
                  },
                  {
                    title: 'GDPR Compliant',
                    description: 'Operated from France with full GDPR compliance. Your data rights are protected by law.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-border/50 bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                  >
                    <CheckCircle2 className="mb-3 h-6 w-6 text-primary" />
                    <h3 className="mb-2 text-base font-semibold text-foreground">
                      {item.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
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
      <footer className="border-t border-border/40 py-12">
        <div className="content-container px-4 sm:px-6 mb-8">
          <div className="mx-auto max-w-4xl">
            {/* Footer Links Grid */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Project */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Project</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/changelog" className="text-muted-foreground transition-colors hover:text-foreground">
                      Changelog
                    </Link>
                  </li>
                  <li>
                    <Link href="/roadmap" className="text-muted-foreground transition-colors hover:text-foreground">
                      Roadmap
                    </Link>
                  </li>
                  <li>
                    <Link href="/sources" className="text-muted-foreground transition-colors hover:text-foreground">
                      RSS Sources
                    </Link>
                  </li>
                  <li>
                    <Link href="/contributors" className="text-muted-foreground transition-colors hover:text-foreground">
                      Contributors
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="https://github.com/BENZOOgataga/feedcentral" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="text-muted-foreground transition-colors hover:text-foreground">
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Resources</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a 
                      href="https://github.com/BENZOOgataga/feedcentral#readme" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Documentation
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://github.com/BENZOOgataga/feedcentral/issues" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Report Issues
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://github.com/BENZOOgataga/feedcentral/discussions" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Discussions
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">Contact</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a 
                      href="mailto:contact@benzoogataga.com" 
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Email Support
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://feed.benzoogataga.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Official Instance
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.patreon.com/BENZOOgataga" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Support Us
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Info */}
        <div className="w-full pt-6">
          <div className="content-container px-4 sm:px-6 text-center">
            <p className="mb-2 text-sm text-muted-foreground">
              © {new Date().getFullYear()} FeedCentral. Open source RSS aggregator built with Next.js.
            </p>
            <p className="text-xs text-muted-foreground">
              Operated from France • GDPR Compliant • No tracking, no ads, no BS
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
