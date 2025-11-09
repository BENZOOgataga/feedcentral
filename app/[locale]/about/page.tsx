'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n-navigation';
import { Button } from '@/components/ui/button';
import { 
  Info, 
  Target, 
  Heart, 
  Code, 
  TrendingUp, 
  Users,
  Shield,
  Clock,
  Newspaper,
  Github,
  ExternalLink
} from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('about');

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-background">
        <div className="content-container px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20">
                <Info className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t('title')}
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="content-container px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-16">
          
          {/* Origin Story */}
          <section>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-500/20 mb-4">
                <Newspaper className="w-4 h-4" />
                {t('origin.badge')}
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t('origin.title')}
              </h2>
            </div>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {t('origin.paragraph1')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('origin.paragraph2')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('origin.paragraph3')}
              </p>
            </div>
          </section>

          {/* Mission */}
          <section>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-sm font-medium text-green-600 dark:text-green-400 border border-green-500/20 mb-4">
                <Target className="w-4 h-4" />
                {t('mission.badge')}
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t('mission.title')}
              </h2>
            </div>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 mb-8">
              <p className="text-muted-foreground leading-relaxed">
                {t('mission.paragraph1')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('mission.paragraph2')}
              </p>
            </div>

            {/* Core Principles */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-foreground mb-6">
                {t('mission.principles.title')}
              </h3>
              
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                      <Shield className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {t('mission.principles.transparency.title')}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t('mission.principles.transparency.description')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-green-500/10 p-2">
                      <Shield className="h-5 w-5 text-green-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {t('mission.principles.privacy.title')}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t('mission.principles.privacy.description')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-purple-500/10 p-2">
                      <Target className="h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {t('mission.principles.simplicity.title')}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t('mission.principles.simplicity.description')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-start gap-4">
                    <div className="rounded-lg bg-orange-500/10 p-2">
                      <Clock className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">
                        {t('mission.principles.chronological.title')}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {t('mission.principles.chronological.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Hobby Project */}
          <section>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-600 dark:text-purple-400 border border-purple-500/20 mb-4">
                <Heart className="w-4 h-4" />
                {t('hobbyProject.badge')}
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t('hobbyProject.title')}
              </h2>
            </div>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {t('hobbyProject.paragraph1')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('hobbyProject.paragraph2')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('hobbyProject.paragraph3')}
              </p>
            </div>
          </section>

          {/* Open Source */}
          <section>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-600 dark:text-orange-400 border border-orange-500/20 mb-4">
                <Code className="w-4 h-4" />
                {t('openSource.badge')}
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t('openSource.title')}
              </h2>
            </div>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {t('openSource.paragraph1')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('openSource.paragraph2')}
              </p>
            </div>

            <div className="mt-6">
              <Button asChild variant="outline" className="gap-2">
                <a 
                  href="https://github.com/BENZOOgataga/feedcentral" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4" />
                  {t('openSource.linkText')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
            </div>
          </section>

          {/* Future */}
          <section>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-medium text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 mb-4">
                <TrendingUp className="w-4 h-4" />
                {t('future.badge')}
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t('future.title')}
              </h2>
            </div>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4">
              <p className="text-muted-foreground leading-relaxed">
                {t('future.paragraph1')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('future.paragraph2')}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {t('future.roadmapLink')}{' '}
                <Link href="/roadmap" className="text-primary hover:underline">
                  roadmap
                </Link>
                {' '}{t('future.roadmapLinkEnd').split(' ')[0]}{' '}
                <a 
                  href="https://github.com/BENZOOgataga/feedcentral/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {t('future.githubLink')}
                </a>
                {' '}{t('future.roadmapLinkEnd').split(' ').slice(1).join(' ')}
              </p>
            </div>
          </section>

          {/* Support */}
          <section>
            <div className="mb-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-pink-500/10 px-3 py-1 text-sm font-medium text-pink-600 dark:text-pink-400 border border-pink-500/20 mb-4">
                <Users className="w-4 h-4" />
                {t('support.badge')}
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                {t('support.title')}
              </h2>
            </div>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-4 mb-8">
              <p className="text-muted-foreground leading-relaxed">
                {t('support.paragraph1')}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 mb-8">
              <div className="rounded-lg border border-border bg-card/50 p-4">
                <h4 className="font-semibold text-foreground mb-2">
                  {t('support.ways.feedback.title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('support.ways.feedback.description')}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card/50 p-4">
                <h4 className="font-semibold text-foreground mb-2">
                  {t('support.ways.contribute.title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('support.ways.contribute.description')}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card/50 p-4">
                <h4 className="font-semibold text-foreground mb-2">
                  {t('support.ways.spread.title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('support.ways.spread.description')}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card/50 p-4">
                <h4 className="font-semibold text-foreground mb-2">
                  {t('support.ways.patreon.title')}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {t('support.ways.patreon.description')}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <Button asChild className="gap-2">
                <a 
                  href="https://www.patreon.com/c/user?u=139415458" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Heart className="w-4 h-4" />
                  {t('support.patreonButton')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </Button>
              <p className="text-sm text-muted-foreground">
                {t('support.thankYou')}
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
