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
import { Link } from '@/i18n-navigation';
import { getTranslations } from 'next-intl/server';
import { setRequestLocale } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { ChangelogToast } from '@/components/changelog/ChangelogNotification';
import { ChangelogButton } from './ChangelogButton';

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

function GradientSeparator() {
  return (
    <div className="w-full h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
  );
}

export default async function LandingPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = await getTranslations('landing');

  const features = [
    {
      icon: Shield,
      title: t('features.verifiedSources.title'),
      description: t('features.verifiedSources.description'),
    },
    {
      icon: Zap,
      title: t('features.realtimeUpdates.title'),
      description: t('features.realtimeUpdates.description'),
    },
    {
      icon: BookmarkCheck,
      title: t('features.smartBookmarks.title'),
      description: t('features.smartBookmarks.description'),
    },
    {
      icon: Search,
      title: t('features.powerfulSearch.title'),
      description: t('features.powerfulSearch.description'),
    },
    {
      icon: Palette,
      title: t('features.beautifulDesign.title'),
      description: t('features.beautifulDesign.description'),
    },
    {
      icon: Globe,
      title: t('features.openSource.title'),
      description: t('features.openSource.description'),
    },
  ];

  const privacyItems = [
    {
      title: t('privacy.noTracking.title'),
      description: t('privacy.noTracking.description'),
    },
    {
      title: t('privacy.noAds.title'),
      description: t('privacy.noAds.description'),
    },
    {
      title: t('privacy.gdpr.title'),
      description: t('privacy.gdpr.description'),
    },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <ChangelogToast />
      
      {/* Hero Section */}
      <section className="content-container px-4 pt-24 pb-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary-foreground">
                <path d="M4 11a9 9 0 0 1 9 9"></path>
                <path d="M4 4a16 16 0 0 1 16 16"></path>
                <circle cx="5" cy="19" r="1"></circle>
              </svg>
            </div>
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            {t('hero.title')}{' '}
            <span className="text-primary">{t('hero.titleHighlight')}</span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col items-center gap-4">
            {/* Primary CTA - Start Browsing */}
            <Button asChild size="lg" className="gap-2 text-lg font-semibold px-12 py-6 shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto sm:min-w-[342px]">
              <Link href="/app">
                {t('hero.ctaBrowse')}
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            {/* Secondary CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:w-auto w-full">
              <ChangelogButton label={t('hero.ctaChangelog')} />
              <Button asChild variant="outline" size="lg" className="gap-2 text-base min-w-[165px]">
                <a 
                  href="https://www.patreon.com/BENZOOgataga" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Heart className="h-4 w-4" />
                  {t('hero.ctaSupport')}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="relative w-full overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
        
        <div className="bg-muted/30 py-16">
          <div className="content-container px-4 sm:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                {t('mission.badge')}
              </div>
              <h2 className="mb-6 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t('mission.title')}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {t('mission.description1')}{' '}
                <span className="font-semibold text-foreground">{t('mission.description1Highlight')}</span>. 
              </p>
              <p className="text-base text-muted-foreground leading-relaxed">
                {t('mission.description2')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      </section>

      {/* Core Features Section */}
      <section className="content-container px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground">
            {t('features.title')}
          </h2>
          <p className="mb-12 text-center text-muted-foreground max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
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

      {/* Privacy & Trust Section */}
      <section className="relative w-full">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none z-10" />
        
        <div className="bg-muted/30 py-16">
          <div className="content-container px-4 sm:px-6">
            <div className="mx-auto max-w-4xl">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Lock className="h-4 w-4" />
                  {t('privacy.badge')}
                </div>
                <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground">
                  {t('privacy.title')}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {t('privacy.subtitle')}
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                {privacyItems.map((item) => (
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
        
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
      </section>

      {/* Sources Section */}
      <section className="content-container px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight text-foreground">
            {t('sources.title')}
          </h2>
          <p className="mb-8 text-muted-foreground">
            {t('sources.subtitle')}
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
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Project */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">{t('footer.project')}</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/about" className="text-muted-foreground transition-colors hover:text-foreground">
                      {t('footer.about')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/changelog" className="text-muted-foreground transition-colors hover:text-foreground">
                      {t('footer.changelog')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/roadmap" className="text-muted-foreground transition-colors hover:text-foreground">
                      {t('footer.roadmap')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/sources" className="text-muted-foreground transition-colors hover:text-foreground">
                      {t('footer.rssSources')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/contributors" className="text-muted-foreground transition-colors hover:text-foreground">
                      {t('footer.contributors')}
                    </Link>
                  </li>
                  <li>
                    <a 
                      href="https://github.com/BENZOOgataga/feedcentral" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t('footer.github')}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">{t('footer.legal')}</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/privacy" className="text-muted-foreground transition-colors hover:text-foreground">
                      {t('footer.privacy')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-muted-foreground transition-colors hover:text-foreground">
                      {t('footer.terms')}
                    </Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="text-muted-foreground transition-colors hover:text-foreground">
                      {t('footer.cookies')}
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">{t('footer.resources')}</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a 
                      href="https://github.com/BENZOOgataga/feedcentral#readme" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t('footer.documentation')}
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://github.com/BENZOOgataga/feedcentral/issues" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t('footer.reportIssues')}
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://github.com/BENZOOgataga/feedcentral/discussions" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t('footer.discussions')}
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-foreground">{t('footer.contact')}</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a 
                      href="mailto:contact@benzoogataga.com" 
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t('footer.emailSupport')}
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://feed.benzoogataga.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t('footer.officialInstance')}
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.patreon.com/BENZOOgataga" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {t('footer.supportUs')}
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
              © {new Date().getFullYear()} {t('footer.copyright')}
            </p>
            <p className="text-xs text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
