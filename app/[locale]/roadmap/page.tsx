'use client';

import { Link } from '@/i18n-navigation';
import { Button } from '@/components/ui/button';
import { Map, ArrowLeft, Lightbulb, Coffee, Heart, Sparkles, Zap, Target, Rocket, Star, Check, Smile } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ContentLanguageDisclaimer } from '@/components/ContentLanguageDisclaimer';

export default function RoadmapPage() {
  const t = useTranslations();
  const phases = [
    {
      title: 'Current State',
      icon: Check,
      color: 'text-green-500',
      borderColor: 'border-green-500/30',
      bgColor: 'bg-green-500/5',
      status: 'done',
      items: [
        'RSS feed aggregation',
        'Article bookmarking',
        'User accounts & auth',
        'Search functionality',
        'Mobile-friendly design',
      ],
    },
    {
      title: 'Maybe Soon™',
      icon: Sparkles,
      color: 'text-blue-500',
      borderColor: 'border-blue-500/30',
      bgColor: 'bg-blue-500/5',
      status: 'thinking',
      items: [
        'French translation (confirmed - in progress)',
        'Landing page overhaul (confirmed - in progress)',
        'Better mobile experience & PWA',
        'Article filtering by keywords',
        'Improve dark/light themes',
      ],
    },
    {
      title: 'If I Feel Like It',
      icon: Zap,
      color: 'text-purple-500',
      borderColor: 'border-purple-500/30',
      bgColor: 'bg-purple-500/5',
      status: 'someday',
      items: [
        'Reading statistics dashboard',
        'Full-text search improvements',
        'Custom notification settings',
      ],
    },
    {
      title: 'Ambitious Ideas',
      icon: Rocket,
      color: 'text-orange-500',
      borderColor: 'border-orange-500/30',
      bgColor: 'bg-orange-500/5',
      status: 'ambitious',
      items: [
        'Let users add their own RSS feeds',
        'AI-powered article summaries (maybe?)',
        'Social features (or not, idk)',
      ],
    },
    {
      title: 'Pipe Dreams',
      icon: Star,
      color: 'text-pink-500',
      borderColor: 'border-pink-500/30',
      bgColor: 'bg-pink-500/5',
      status: 'dream',
      items: [
        'Mobile apps (iOS/Android)',
        'Browser extensions',
        'World domination',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="content-container px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('navigation.backToHome')}
              </Button>
            </Link>
            
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Map className="h-12 w-12 text-primary" />
                </div>
              </div>
              
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                {t('roadmap.title')}
              </h1>
              
              <p className="mb-8 text-lg text-muted-foreground">
                {t('roadmap.subtitle')}
              </p>

              <ContentLanguageDisclaimer />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-6xl space-y-12">

          {/* Hobby Project Notice */}
          <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6">
            <div className="flex items-start gap-4">
              <Coffee className="h-6 w-6 shrink-0 text-amber-500 mt-1" />
              <div>
                <h2 className="mb-2 text-xl font-bold text-foreground">This is a Hobby Project</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>
                    FeedCentral was built for fun because I wanted a single place to read my news without 
                    the bullshit from social media or TV fake news. I work on this when I have time and 
                    feel like it.
                  </p>
                  <p>
                    <strong className="text-foreground">Important:</strong> The features listed below are 
                    just <span className="italic">ideas</span> I've had. They may or may not be implemented. 
                    There's no timeline, no commitments, and no guarantees. I'll add stuff when (and if) I 
                    want to.
                  </p>
                  <p className="flex items-start gap-2">
                    <span>
                      If you want something specific, fork the project and build it yourself! It's open source 
                      for a reason.
                    </span>
                    <Smile className="h-4 w-4 shrink-0 mt-0.5" />
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <section>
            <h2 className="mb-8 text-center text-2xl font-bold text-foreground">
              The "Timeline" (Not Really)
            </h2>
            
            <div className="relative">
              {/* Vertical line - hidden on mobile */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-linear-to-b from-green-500/50 via-purple-500/50 to-pink-500/50 hidden md:block" />
              
              <div className="space-y-12">
                {phases.map((phase, index) => {
                  const Icon = phase.icon;
                  const isLeft = index % 2 === 0;
                  
                  return (
                    <div key={index} className="relative">
                      {/* Timeline dot */}
                      <div className={`absolute left-8 top-6 hidden md:block transform -translate-x-1/2 z-10`}>
                        {/* Background circle to hide the line */}
                        <div className="absolute inset-0 rounded-full bg-background" />
                        <div className={`relative w-16 h-16 rounded-full border-4 ${phase.borderColor} ${phase.bgColor} flex items-center justify-center`}>
                          <Icon className={`h-8 w-8 ${phase.color}`} />
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className={`md:ml-24 ${isLeft ? 'md:mr-0' : 'md:ml-24'}`}>
                        <div className={`rounded-xl border ${phase.borderColor} ${phase.bgColor} p-6 transition-all hover:shadow-lg`}>
                          <div className="flex items-start gap-4">
                            {/* Mobile icon */}
                            <div className={`md:hidden w-12 h-12 rounded-full border-2 ${phase.borderColor} ${phase.bgColor} flex items-center justify-center shrink-0`}>
                              <Icon className={`h-6 w-6 ${phase.color}`} />
                            </div>
                            
                            <div className="flex-1">
                              <h3 className={`mb-4 text-xl font-bold ${phase.color}`}>
                                {phase.title}
                              </h3>
                              
                              <ul className="space-y-2">
                                {phase.items.map((item, itemIndex) => (
                                  <li key={itemIndex} className="flex items-start gap-2 text-sm">
                                    <div className={`mt-1 h-1.5 w-1.5 rounded-full ${phase.color} shrink-0`} />
                                    <span className="text-muted-foreground">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-2">
                <Lightbulb className="h-3.5 w-3.5 shrink-0" />
                <span>
                  <strong className="text-foreground">Got an idea?</strong> Feel free to open an issue 
                  on{' '}
                  <a 
                    href="https://github.com/BENZOOgataga/feedcentral/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    GitHub
                  </a>
                  , but remember: this is a hobby project. I might love your idea, or I might not have time 
                  to work on it. If you really want it, submit a PR!
                </span>
              </p>
            </div>
          </section>

          {/* Support Section */}
          <section className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-6">
            <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-foreground">
              <Heart className="h-5 w-5 text-pink-500" />
              Want to Support This Project?
            </h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                The best way to support FeedCentral is to:
              </p>
              <ul className="ml-6 space-y-2 list-disc">
                <li>Use it and share it with others who hate fake news</li>
                <li>Star the repo on GitHub if you find it useful</li>
                <li>Report bugs when you find them</li>
                <li>Contribute code if you're a developer</li>
                <li>Tell me what RSS sources you'd like to see added</li>
              </ul>
              <p className="mt-4">
                If you really want to throw money at this hobby project, I have a{' '}
                <a 
                  href="https://www.patreon.com/BENZOOgataga" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-pink-500 hover:underline font-semibold"
                >
                  Patreon
                </a>
                . But honestly, just using FeedCentral and sharing feedback is more than enough!
              </p>
            </div>
          </section>

          {/* Official Instance Note */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-lg font-bold text-foreground">About This Roadmap</h2>
            <p className="text-sm text-muted-foreground">
              This roadmap applies to the <strong className="text-foreground">official FeedCentral 
              instance</strong> at{' '}
              <a 
                href="https://feed.benzoogataga.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                feed.benzoogataga.com
              </a>
              . If you're using a fork, their roadmap might be completely different (or non-existent).
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
