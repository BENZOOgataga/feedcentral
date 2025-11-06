'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Cookie, Info, CheckCircle2, Settings, AlertTriangle, Scale, X } from 'lucide-react';

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="content-container px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Cookie className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Cookie Policy
            </h1>
            
            <p className="mb-2 text-lg text-muted-foreground">
              How we use cookies and similar technologies
            </p>

            <p className="mb-4 text-sm text-muted-foreground">
              Version 1.0 | Document ID: CP-20251106-v1
            </p>

            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-4 py-2 inline-block">
              <p className="text-xs text-foreground flex items-center gap-2">
                <Scale className="h-3 w-3 shrink-0" />
                <span>
                  <strong>Applicable to:</strong> Official FeedCentral instance at{' '}
                  <a 
                    href="https://feed.benzoogataga.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    feed.benzoogataga.com
                  </a>
                  {' '}only. Third-party forks must provide their own cookie policies.
                </span>
              </p>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              Last updated: November 6, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-12">

          {/* Good News Banner */}
          <section className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500" />
              <div>
                <h2 className="mb-2 text-xl font-bold text-foreground">Good News: Minimal Cookie Usage</h2>
                <p className="text-sm text-muted-foreground">
                  FeedCentral uses <strong>only essential cookies</strong> required for the service to function. 
                  We do NOT use tracking cookies, advertising cookies, or third-party analytics cookies. 
                  Your browsing behavior is not tracked or sold to anyone.
                </p>
              </div>
            </div>
          </section>

          {/* Introduction */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">1. What Are Cookies?</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Cookies are small text files that are placed on your device (computer, smartphone, or tablet) 
                when you visit a website. They help websites remember information about your visit, such as 
                your preferences and login status.
              </p>
              <p>
                This Cookie Policy explains what cookies FeedCentral uses, why we use them, and how you can 
                control them. This policy should be read together with our{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>

              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 mt-4">
                <h3 className="mb-2 text-sm font-semibold text-foreground flex items-center gap-2">
                  <Scale className="h-4 w-4 shrink-0" />
                  CNIL Compliance (French Data Protection Authority)
                </h3>
                <p className="text-xs">
                  In accordance with CNIL guidelines (Délibération n° 2020-091 du 17 septembre 2020):
                </p>
                <ul className="ml-4 mt-2 space-y-1 text-xs list-disc">
                  <li>
                    <strong className="text-foreground">No Consent Required:</strong> FeedCentral uses only 
                    "strictly necessary" cookies (authentication) that are essential for the service to function. 
                    Under Article 82 of the French Data Protection Act and CNIL rules, these cookies do NOT 
                    require user consent.
                  </li>
                  <li>
                    <strong className="text-foreground">No Cookie Banner:</strong> Since we don't use 
                    non-essential cookies (tracking, advertising, analytics with cookies), no consent banner 
                    is legally required.
                  </li>
                  <li>
                    <strong className="text-foreground">Analytics Without Cookies:</strong> Vercel Analytics 
                    and Speed Insights are cookieless, privacy-first services that don't track individual users.
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookies We Use */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
              <Info className="h-6 w-6 text-primary" />
              2. Cookies We Use
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">2.1 Strictly Necessary Cookies</h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  These cookies are essential for the website to function properly. They cannot be disabled.
                </p>

                <div className="space-y-4">
                  <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <h4 className="font-semibold text-foreground">Authentication Cookie</h4>
                      <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        Essential
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong className="text-foreground">Name:</strong> <code className="rounded bg-muted px-1 py-0.5 text-xs">auth_token</code></p>
                      <p><strong className="text-foreground">Purpose:</strong> Keeps you logged in to your account securely</p>
                      <p><strong className="text-foreground">Duration:</strong> 7 days (or until you log out)</p>
                      <p><strong className="text-foreground">Type:</strong> First-party, HTTP-only, Secure (HTTPS only in production)</p>
                      <p><strong className="text-foreground">Security:</strong> Contains JWT token for authenticated sessions</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 text-lg font-semibold text-foreground">2.2 Functional Cookies</h3>
                <p className="mb-3 text-sm text-muted-foreground">
                  These cookies remember your preferences and settings. They are not strictly necessary but 
                  enhance your experience.
                </p>

                <div className="space-y-4">
                  <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <h4 className="font-semibold text-foreground">Theme Preference</h4>
                      <span className="rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500">
                        Functional
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong className="text-foreground">Storage:</strong> Local Storage (not a cookie)</p>
                      <p><strong className="text-foreground">Purpose:</strong> Remembers your theme choice (light/dark mode)</p>
                      <p><strong className="text-foreground">Duration:</strong> Persistent (until you clear browser data)</p>
                      <p><strong className="text-foreground">Data stored:</strong> "light", "dark", or "system"</p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <h4 className="font-semibold text-foreground">Display Preferences</h4>
                      <span className="rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-500">
                        Functional
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong className="text-foreground">Storage:</strong> Local Storage</p>
                      <p><strong className="text-foreground">Purpose:</strong> Remembers layout preferences, feed view settings</p>
                      <p><strong className="text-foreground">Duration:</strong> Persistent</p>
                      <p><strong className="text-foreground">Data stored:</strong> UI preferences (grid/list view, etc.)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* What We DON'T Use */}
          <section className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
            <h2 className="mb-6 text-2xl font-bold text-foreground">3. What We DON'T Use</h2>
            
            <div className="space-y-3 text-sm text-muted-foreground">
              <p className="text-foreground font-semibold">
                FeedCentral explicitly does NOT use:
              </p>

              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                  <p>
                    <strong className="text-foreground flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5 shrink-0" />
                      Advertising Cookies
                    </strong> - We don't show ads, 
                    so we don't use advertising cookies
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                  <p>
                    <strong className="text-foreground flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5 shrink-0" />
                      Analytics/Tracking Cookies
                    </strong> - We don't use 
                    Google Analytics, Facebook Pixel, or any third-party tracking
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                  <p>
                    <strong className="text-foreground flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5 shrink-0" />
                      Social Media Cookies
                    </strong> - No social media 
                    tracking pixels or buttons that track you
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                  <p>
                    <strong className="text-foreground flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5 shrink-0" />
                      Cross-Site Tracking
                    </strong> - We don't track your 
                    browsing on other websites
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                  <p>
                    <strong className="text-foreground flex items-center gap-1.5">
                      <X className="h-3.5 w-3.5 shrink-0" />
                      Personal Tracking
                    </strong> - Vercel Analytics 
                    and Speed Insights operate without cookies and collect only anonymous, aggregated metrics
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
                <p className="text-sm">
                  <strong className="text-foreground">Note on Analytics:</strong> We use Vercel Analytics and 
                  Speed Insights for anonymous performance monitoring. These tools are privacy-first and 
                  don't use cookies, don't track personal data, and don't require cookie consent under GDPR.
                </p>
              </div>
            </div>
          </section>

          {/* How to Control Cookies */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
              <Settings className="h-6 w-6 text-primary" />
              4. How to Control Cookies
            </h2>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">4.1 Browser Settings</h3>
                <p className="mb-2">
                  Most web browsers allow you to control cookies through their settings. You can:
                </p>
                <ul className="ml-6 space-y-1 list-disc">
                  <li>View what cookies are stored and delete them individually</li>
                  <li>Block third-party cookies</li>
                  <li>Block all cookies (warning: this will prevent you from logging in)</li>
                  <li>Delete all cookies when you close your browser</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">4.2 Browser-Specific Instructions</h3>
                <div className="space-y-2">
                  <p>
                    <strong className="text-foreground">Chrome:</strong>{' '}
                    <a 
                      href="https://support.google.com/chrome/answer/95647" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Cookie settings in Chrome
                    </a>
                  </p>
                  <p>
                    <strong className="text-foreground">Firefox:</strong>{' '}
                    <a 
                      href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Cookie settings in Firefox
                    </a>
                  </p>
                  <p>
                    <strong className="text-foreground">Safari:</strong>{' '}
                    <a 
                      href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Cookie settings in Safari
                    </a>
                  </p>
                  <p>
                    <strong className="text-foreground">Edge:</strong>{' '}
                    <a 
                      href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Cookie settings in Edge
                    </a>
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                <p className="text-sm text-foreground flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Important:</strong> If you block or delete essential cookies (authentication cookies), 
                    you will not be able to log in to FeedCentral or use account-specific features. Functional 
                    cookies can be blocked without breaking the service, but you'll lose personalization.
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Local Storage */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">5. Local Storage & Session Storage</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                In addition to cookies, we use browser Local Storage and Session Storage to store:
              </p>
              <ul className="ml-6 space-y-1 list-disc">
                <li><strong className="text-foreground">Theme preference:</strong> Your chosen color theme</li>
                <li><strong className="text-foreground">UI state:</strong> Sidebar collapse state, view preferences</li>
                <li><strong className="text-foreground">Temporary data:</strong> Session-specific cache to improve performance</li>
              </ul>
              <p>
                This data is stored <strong className="text-foreground">only on your device</strong> and is never 
                sent to our servers (unless you're logged in and save preferences to your account).
              </p>
              <p>
                You can clear Local Storage through your browser's developer tools or by clearing all site data.
              </p>
            </div>
          </section>

          {/* GDPR Compliance */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">6. GDPR Compliance</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Under the General Data Protection Regulation (GDPR) and the ePrivacy Directive:
              </p>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p>
                    <strong className="text-foreground">Consent:</strong> We only use essential cookies that 
                    don't require consent. For functional cookies (theme preferences), your continued use of 
                    the site implies consent.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p>
                    <strong className="text-foreground">Transparency:</strong> This policy provides clear 
                    information about all cookies we use.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p>
                    <strong className="text-foreground">Control:</strong> You have full control over cookies 
                    through your browser settings.
                  </p>
                </div>
              </div>
              <p>
                Because we don't use tracking or advertising cookies, <strong className="text-foreground">
                we don't need to show you a cookie consent banner</strong> on every visit.
              </p>
            </div>
          </section>

          {/* Updates */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">7. Updates to This Policy</h2>
            <p className="text-sm text-muted-foreground">
              We may update this Cookie Policy from time to time to reflect changes in our practices or 
              for legal reasons. We will post the updated policy on this page with a new "Last updated" date. 
              Material changes will be communicated through the Service.
            </p>
          </section>

          {/* Legal References */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">8. Legal References</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>This Cookie Policy complies with:</p>
              <ul className="ml-4 space-y-1 list-disc">
                <li>
                  <strong className="text-foreground">ePrivacy Directive:</strong> Directive 2002/58/EC 
                  (as amended by Directive 2009/136/EC) - "Cookie Law"
                </li>
                <li>
                  <strong className="text-foreground">GDPR:</strong> Regulation (EU) 2016/679 - General 
                  Data Protection Regulation
                </li>
                <li>
                  <strong className="text-foreground">French Data Protection Act:</strong> Loi n° 78-17 
                  du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés (modified)
                </li>
                <li>
                  <strong className="text-foreground">CNIL Guidelines:</strong> Délibération n° 2020-091 
                  du 17 septembre 2020 (exemption for strictly necessary cookies)
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 text-2xl font-bold text-foreground">9. Questions?</h2>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                If you have questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              
              <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                <p className="font-semibold text-foreground">FeedCentral Privacy</p>
                <p className="text-xs text-muted-foreground mb-2 italic">
                  Operated by an individual residing in France. Full postal address available upon 
                  legitimate legal request to hosting provider (Vercel Inc.).
                </p>
                <p className="mt-2">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:contact@benzoogataga.com" className="text-primary hover:underline">
                    contact@benzoogataga.com
                  </a>
                  {' '}(handled from France)
                </p>
                <p>
                  <strong>GitHub:</strong>{' '}
                  <a 
                    href="https://github.com/BENZOOgataga/feedcentral" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    github.com/BENZOOgataga/feedcentral
                  </a>
                </p>
              </div>
            </div>
          </section>

          {/* Fork & Third-Party Usage Disclaimer */}
          <section className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-6">
            <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold text-foreground">
              <AlertTriangle className="h-6 w-6 text-orange-500" />
              Important: About Forks & Third-Party Instances
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="text-foreground font-semibold">
                This Cookie Policy applies ONLY to the official FeedCentral project and its official deployments.
              </p>
              <p>
                FeedCentral is open-source. Third-party instances may use different cookies or tracking methods. 
                We are <strong className="text-foreground">NOT responsible</strong> for:
              </p>
              <ul className="ml-6 space-y-2 list-disc">
                <li>
                  <strong className="text-foreground">Cookie practices on forks:</strong> Third-party deployments 
                  may add tracking cookies, analytics, or advertising cookies not present in the official version
                </li>
                <li>
                  <strong className="text-foreground">Data collection on modified versions:</strong> Forked 
                  instances may collect additional data beyond what's described here
                </li>
                <li>
                  <strong className="text-foreground">Third-party tracking:</strong> Fork maintainers may integrate 
                  Google Analytics, Facebook Pixel, or other tracking tools
                </li>
                <li>
                  <strong className="text-foreground">GDPR compliance on forks:</strong> We cannot guarantee that 
                  third-party instances comply with GDPR or other privacy regulations
                </li>
              </ul>
              <div className="mt-4 rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                <p className="text-sm text-foreground flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Check your instance:</strong> If you're using a FeedCentral deployment operated by 
                    someone else, review their specific cookie policy. The <strong>official FeedCentral instance</strong> at{' '}
                    <a 
                      href="https://feed.benzoogataga.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-semibold"
                    >
                      feed.benzoogataga.com
                    </a>
                    {' '}follows this cookie policy exactly.
                  </span>
                </p>
              </div>
              <p>
                <strong className="text-foreground">Official instance:</strong>
              </p>
              <ul className="ml-6 space-y-1 list-disc">
                <li>
                  <strong className="text-foreground">Domain:</strong>{' '}
                  <a 
                    href="https://feed.benzoogataga.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    feed.benzoogataga.com
                  </a>
                </li>
                <li>
                  Source code:{' '}
                  <a 
                    href="https://github.com/BENZOOgataga/feedcentral" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    github.com/BENZOOgataga/feedcentral
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* Footer Navigation */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline">
              <Link href="/privacy">View Privacy Policy</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/terms">View Terms of Service</Link>
            </Button>
            <Button asChild>
              <Link href="/app">Back to Dashboard</Link>
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
