'use client';

import { Link } from '@/i18n-navigation';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Eye, Database, Globe, Github, Mail, AlertTriangle, Scale, Cookie, FileText } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { ContentLanguageDisclaimer } from '@/components/ContentLanguageDisclaimer';

export default function PrivacyPage() {
  const t = useTranslations();
  const locale = useLocale();
  
  // Format date based on locale
  const lastUpdated = new Date('2025-11-06').toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="content-container px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t('privacy.title')}
            </h1>
            
            <p className="mb-2 text-lg text-muted-foreground">
              {t('privacy.subtitle')}
            </p>

            <div className="mb-8 flex flex-col items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {t('privacy.lastUpdated', { date: lastUpdated })}
              </p>
              <p className="text-xs text-muted-foreground/70">
                {t('privacy.version', { version: '1.0', id: 'PP-20251106-v1' })}
              </p>
            </div>

            <ContentLanguageDisclaimer />

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <p className="text-sm text-foreground flex items-center justify-center gap-2">
                <Scale className="h-4 w-4 shrink-0" />
                <span>
                  <strong>{t('privacy.applicableTo')}</strong> {t('privacy.applicableDescription', { 
                    url: 'feed.benzoogataga.com' 
                  }).split('feed.benzoogataga.com')[0]}
                  <a 
                    href="https://feed.benzoogataga.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-semibold"
                  >
                    feed.benzoogataga.com
                  </a>
                  {t('privacy.applicableDescription', { 
                    url: 'feed.benzoogataga.com' 
                  }).split('feed.benzoogataga.com')[1]}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-12">

          {/* Open Source Notice */}
          <section className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
            <div className="flex items-start gap-4">
              <Github className="h-6 w-6 shrink-0 text-blue-500" />
              <div>
                <h2 className="mb-2 text-xl font-bold text-foreground">Open Source Transparency</h2>
                <p className="mb-3 text-sm text-muted-foreground">
                  FeedCentral is an <strong>open-source project</strong>. You can review our entire codebase, 
                  including how we handle your data, at{' '}
                  <a 
                    href="https://github.com/BENZOOgataga/feedcentral" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline font-medium"
                  >
                    github.com/BENZOOgataga/feedcentral
                  </a>
                </p>
                <p className="mb-3 text-sm text-muted-foreground">
                  This means complete transparency: you can verify exactly what data we collect, 
                  how it's stored, and how it's used. No hidden tracking, no secret data collection.
                </p>
                
                <div className="mt-4 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                  <h3 className="mb-2 text-sm font-semibold text-foreground">What IS Open Source:</h3>
                  <ul className="mb-3 ml-4 space-y-1 text-xs text-muted-foreground list-disc">
                    <li>All application code and logic</li>
                    <li>Database schema and structure</li>
                    <li>Data handling and processing methods</li>
                    <li>Security implementations and encryption methods</li>
                  </ul>
                  
                  <h3 className="mb-2 text-sm font-semibold text-foreground">What is NOT Open Source:</h3>
                  <ul className="ml-4 space-y-1 text-xs text-muted-foreground list-disc">
                    <li><strong className="text-foreground">Database content:</strong> Your personal data, articles, user accounts, and all database records are private and secured</li>
                    <li><strong className="text-foreground">Credentials:</strong> Passwords are always hashed (never stored in plain text) and cannot be viewed by anyone, including developers</li>
                    <li><strong className="text-foreground">Production data:</strong> Developers work with test data in development environments and never access production user data</li>
                    <li><strong className="text-foreground">Environment secrets:</strong> API keys, database connection strings, and other sensitive configuration</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Mentions (Mentions Légales) */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Legal Mentions (Mentions Légales)</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p className="text-foreground font-semibold">
                In accordance with French law (Loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique):
              </p>
              
              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">Service Operator</h3>
                <p className="mb-3">
                  This service is operated by an individual residing in France.
                </p>
                <p className="text-xs italic">
                  In accordance with Article 6 III-2 of French law (LCEN), the operator's full postal address 
                  is kept confidential and may be disclosed only upon legitimate legal request to the hosting provider.
                </p>
                <p className="mt-3">
                  <strong className="text-foreground">Contact:</strong>{' '}
                  <a href="mailto:contact@benzoogataga.com" className="text-primary hover:underline">
                    contact@benzoogataga.com
                  </a>
                  {' '}(emails handled from France)
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">Hosting Provider</h3>
                <p>
                  <strong className="text-foreground">Company:</strong> Vercel Inc.<br />
                  <strong className="text-foreground">Address:</strong> 440 N Barranca Ave #4133, Covina, CA 91723, United States<br />
                  <strong className="text-foreground">Technical Infrastructure:</strong> Vercel Inc. (deployment) and Neon.tech (database)
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">Publication Director</h3>
                <p className="text-xs italic">
                  Individual operator residing in France (identity available upon legitimate legal request to hosting provider)
                </p>
              </div>
            </div>
          </section>

          {/* Introduction */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">1. Introduction</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                This Privacy Policy explains how FeedCentral ("we", "us", or "our") collects, uses, 
                and protects your personal information when you use our RSS feed aggregation service 
                at{' '}
                <a 
                  href="https://feed.benzoogataga.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  feed.benzoogataga.com
                </a>
                .
              </p>
              
              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <h3 className="mb-2 text-sm font-semibold text-foreground flex items-center gap-2">
                  <Scale className="h-4 w-4 shrink-0" />
                  Legal Framework
                </h3>
                <p className="text-xs">
                  This Privacy Policy complies with:
                </p>
                <ul className="ml-4 mt-2 space-y-1 text-xs list-disc">
                  <li>
                    <strong className="text-foreground">GDPR:</strong> Regulation (EU) 2016/679 of the 
                    European Parliament and of the Council (General Data Protection Regulation)
                  </li>
                  <li>
                    <strong className="text-foreground">French Data Protection Law:</strong> Loi n° 78-17 
                    du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés (modified)
                  </li>
                  <li>
                    <strong className="text-foreground">ePrivacy Directive:</strong> Directive 2002/58/EC 
                    as amended by Directive 2009/136/EC
                  </li>
                </ul>
              </div>

              <p>
                <strong className="text-foreground">Responsible Party:</strong> This service is operated 
                by an individual residing in France. Contact email (contact@benzoogataga.com) is handled by 
                the operator from France. Full identity and postal address available upon legitimate legal 
                request to the hosting provider (Vercel Inc.).
              </p>
              
              <p>
                <strong className="text-foreground">Your Rights:</strong> Under GDPR and French law, you have 
                extensive rights regarding your personal data. We are committed to respecting and facilitating 
                these rights.
              </p>
            </div>
          </section>

          {/* Data We Collect */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
              <Database className="h-6 w-6 text-primary" />
              2. Data We Collect & Legal Bases
            </h2>
            
            <div className="space-y-6">
              <div className="rounded-lg border border-green-500/20 bg-green-500/5 p-4 mb-4">
                <h3 className="mb-2 text-sm font-semibold text-foreground">📋 Legal Bases for Processing (GDPR Art. 6)</h3>
                <p className="text-xs text-muted-foreground">
                  We process your data based on the following legal grounds:
                </p>
                <ul className="ml-4 mt-2 space-y-1 text-xs list-disc text-muted-foreground">
                  <li><strong className="text-foreground">Contract Performance (Art. 6(1)(b)):</strong> Account data, authentication, service functionality</li>
                  <li><strong className="text-foreground">Legitimate Interest (Art. 6(1)(f)):</strong> Security, fraud prevention, service improvement</li>
                  <li><strong className="text-foreground">Legal Obligation (Art. 6(1)(c)):</strong> Data retention for legal compliance when required</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">2.1 Account Information</h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  When you create an account, we collect:
                </p>
                <ul className="ml-6 space-y-1 text-sm text-muted-foreground list-disc">
                  <li><strong className="text-foreground">Email address</strong> - Used for authentication and account recovery</li>
                  <li><strong className="text-foreground">Username</strong> - Your chosen display name</li>
                  <li><strong className="text-foreground">Password</strong> - Stored as a secure hash (we cannot see your actual password)</li>
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  <strong className="text-foreground">Legal basis:</strong> Contract performance (GDPR Art. 6(1)(b)) - 
                  necessary to provide the service you've requested.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">2.2 Usage Data</h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  We collect data about how you use FeedCentral:
                </p>
                <ul className="ml-6 space-y-1 text-sm text-muted-foreground list-disc">
                  <li>Articles you read and bookmark</li>
                  <li>Your feed preferences and subscriptions</li>
                  <li>UI preferences (theme, layout)</li>
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  <strong className="text-foreground">Legal basis:</strong> Contract performance (GDPR Art. 6(1)(b)) - 
                  necessary to deliver personalized content and save your preferences.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">2.3 Technical Data</h3>
                <p className="mb-2 text-sm text-muted-foreground">
                  Automatically collected for security and functionality:
                </p>
                <ul className="ml-6 space-y-1 text-sm text-muted-foreground list-disc">
                  <li><strong className="text-foreground">IP address</strong> - For security and fraud prevention</li>
                  <li><strong className="text-foreground">Browser type and version</strong> - For compatibility</li>
                  <li><strong className="text-foreground">Device information</strong> - For responsive design</li>
                  <li><strong className="text-foreground">Access times</strong> - For security monitoring</li>
                </ul>
                <p className="mt-2 text-xs text-muted-foreground">
                  <strong className="text-foreground">Legal basis:</strong> Legitimate interest (GDPR Art. 6(1)(f)) - 
                  ensuring security, preventing fraud, and maintaining service quality.
                </p>
              </div>
            </div>
          </section>

          {/* How We Use Data */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
              <Eye className="h-6 w-6 text-primary" />
              3. How We Use Your Data
            </h2>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                We use your personal data <strong className="text-foreground">only</strong> for the following purposes:
              </p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p>
                    <strong className="text-foreground">Service Provision:</strong> To provide you with access 
                    to FeedCentral's RSS aggregation features, personalized feed recommendations, and article bookmarking
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p>
                    <strong className="text-foreground">Authentication:</strong> To verify your identity 
                    and maintain your session securely
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p>
                    <strong className="text-foreground">Security:</strong> To protect against unauthorized 
                    access, abuse, and spam
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p>
                    <strong className="text-foreground">Service Improvement:</strong> To understand usage 
                    patterns and improve our features (anonymized analytics only)
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                  <p>
                    <strong className="text-foreground">Legal Compliance:</strong> To comply with applicable 
                    laws and respond to lawful requests from authorities
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                <p className="text-sm text-foreground">
                  <strong>What we DON'T do:</strong> We do not sell, rent, or share your personal data with 
                  third parties for marketing purposes. We do not track you across other websites. We do not 
                  use your data for advertising.
                </p>
              </div>
            </div>
          </section>

          {/* Data Storage */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">4. Data Storage & Security</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">4.1 Where We Store Data</h3>
                <p>
                  Your data is stored in a secure database hosted by Neon Database (Neon.tech). 
                  The database region is configured based on deployment settings (typically EU for GDPR compliance). 
                  Application hosting is provided by Vercel, Inc., with edge functions distributed globally 
                  for performance.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">4.2 Security Measures</h3>
                <ul className="ml-6 space-y-1 list-disc">
                  <li>Passwords are hashed using industry-standard algorithms (never stored in plain text)</li>
                  <li>All connections use HTTPS encryption</li>
                  <li>Database access is restricted and monitored</li>
                  <li>Regular security updates and patches</li>
                  <li>Automatic backups to prevent data loss</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">4.3 Data Retention</h3>
                <p>
                  We retain your personal data only as long as necessary:
                </p>
                <ul className="ml-6 mt-2 space-y-1 list-disc">
                  <li><strong className="text-foreground">Active accounts:</strong> Data retained while your account is active</li>
                  <li><strong className="text-foreground">Deleted accounts:</strong> Personal data permanently deleted within 30 days</li>
                  <li><strong className="text-foreground">Articles:</strong> Soft-deleted after 7 days (unless bookmarked), hard-deleted after 14 days</li>
                  <li><strong className="text-foreground">Logs:</strong> Security logs retained for 90 days maximum</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Your Rights (GDPR) */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
              <Lock className="h-6 w-6 text-primary" />
              5. Your Rights Under GDPR
            </h2>
            
            <p className="mb-4 text-sm text-muted-foreground">
              As a user in the European Union (or anywhere GDPR applies), you have the following rights:
            </p>

            <div className="space-y-3 text-sm">
              <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                <h3 className="mb-1 font-semibold text-foreground">Right to Access</h3>
                <p className="text-muted-foreground">
                  You can request a copy of all personal data we hold about you
                </p>
              </div>

              <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                <h3 className="mb-1 font-semibold text-foreground">Right to Rectification</h3>
                <p className="text-muted-foreground">
                  You can correct inaccurate or incomplete data through your settings page
                </p>
              </div>

              <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                <h3 className="mb-1 font-semibold text-foreground">Right to Erasure ("Right to be Forgotten")</h3>
                <p className="text-muted-foreground">
                  You can delete your account and all associated data at any time
                </p>
              </div>

              <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                <h3 className="mb-1 font-semibold text-foreground">Right to Data Portability</h3>
                <p className="text-muted-foreground">
                  You can export your data in a machine-readable format (JSON/CSV)
                </p>
              </div>

              <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                <h3 className="mb-1 font-semibold text-foreground">Right to Object</h3>
                <p className="text-muted-foreground">
                  You can object to certain types of data processing
                </p>
              </div>

              <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                <h3 className="mb-1 font-semibold text-foreground">Right to Withdraw Consent</h3>
                <p className="text-muted-foreground">
                  You can withdraw consent for data processing at any time
                </p>
              </div>

              <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                <h3 className="mb-1 font-semibold text-foreground">Right to Lodge a Complaint</h3>
                <p className="text-muted-foreground">
                  You can file a complaint with your local data protection authority (CNIL in France:{' '}
                  <a 
                    href="https://www.cnil.fr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    www.cnil.fr
                  </a>
                  )
                </p>
              </div>

              <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                <h3 className="mb-1 font-semibold text-foreground">Post-Mortem Data Directives (GDPR Art. 85 & French Law)</h3>
                <p className="text-muted-foreground">
                  Under French law (Loi Informatique et Libertés, Art. 40-1), you have the right to define 
                  instructions regarding the retention, deletion, and communication of your personal data after 
                  your death. You can:
                </p>
                <ul className="ml-4 mt-2 space-y-1 list-disc text-muted-foreground">
                  <li>Designate a trusted third party to execute your wishes</li>
                  <li>Specify whether your data should be deleted or preserved</li>
                  <li>Authorize data transmission to specific individuals</li>
                </ul>
                <p className="mt-2 text-muted-foreground">
                  To set your post-mortem directives, contact us at{' '}
                  <a href="mailto:contact@benzoogataga.com" className="text-primary hover:underline">
                    contact@benzoogataga.com
                  </a>
                  {' '}(handled from France).
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
              <p className="text-sm text-foreground">
                <strong>To exercise your rights:</strong> Visit your{' '}
                <Link href="/app/settings" className="text-primary hover:underline">
                  account settings
                </Link>
                {' '}or contact us at{' '}
                <a href="mailto:contact@benzoogataga.com" className="text-primary hover:underline">
                  contact@benzoogataga.com
                </a>
              </p>
            </div>
          </section>

          {/* Cookies */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">6. Cookies & Tracking</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                We use minimal cookies strictly necessary for the service to function:
              </p>
              <ul className="ml-6 space-y-2 list-disc">
                <li>
                  <strong className="text-foreground">Authentication cookie (<code className="text-xs">auth_token</code>):</strong> Keeps you logged in 
                  securely using an HTTP-only, secure cookie containing a JWT token (7-day expiry)
                </li>
                <li>
                  <strong className="text-foreground">Preference storage:</strong> Your theme and 
                  display settings are stored locally in your browser using localStorage (not cookies)
                </li>
              </ul>
              <p>
                <strong className="text-foreground">We do NOT use:</strong> Third-party tracking cookies, 
                advertising cookies, or social media tracking pixels. Vercel Analytics and Speed Insights 
                operate without cookies.
              </p>
              <p>
                For more details, see our{' '}
                <Link href="/cookies" className="text-primary hover:underline">
                  Cookie Policy
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Third-Party Services */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">7. Third-Party Services</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                We use the following third-party services that may process your data:
              </p>
              <div className="space-y-3">
                <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                  <h3 className="mb-1 font-semibold text-foreground">Neon Database (Neon.tech)</h3>
                  <p className="text-sm">
                    <strong>Purpose:</strong> Database hosting<br />
                    <strong>Data processed:</strong> All user data (accounts, bookmarks, preferences)<br />
                    <strong>Location:</strong> European Union (exact region depends on database configuration)<br />
                    <strong>Privacy policy:</strong>{' '}
                    <a 
                      href="https://neon.tech/privacy-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      neon.tech/privacy-policy
                    </a>
                  </p>
                </div>

                <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                  <h3 className="mb-1 font-semibold text-foreground">Vercel, Inc.</h3>
                  <p className="text-sm">
                    <strong>Purpose:</strong> Application hosting and deployment<br />
                    <strong>Data processed:</strong> Technical data, request logs, IP addresses<br />
                    <strong>Location:</strong> United States (GDPR-compliant)<br />
                    <strong>Privacy policy:</strong>{' '}
                    <a 
                      href="https://vercel.com/legal/privacy-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      vercel.com/legal/privacy-policy
                    </a>
                  </p>
                </div>

                <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                  <h3 className="mb-1 font-semibold text-foreground">Vercel Analytics</h3>
                  <p className="text-sm">
                    <strong>Purpose:</strong> Anonymous website analytics and performance monitoring<br />
                    <strong>Data collected:</strong> Page views, navigation patterns, device type, country (anonymized)<br />
                    <strong>Tracking:</strong> Does NOT use cookies, does NOT track across websites, does NOT collect personal identifiers<br />
                    <strong>Privacy-first:</strong> Designed to be GDPR-compliant without cookie consent banners<br />
                    <strong>Privacy policy:</strong>{' '}
                    <a 
                      href="https://vercel.com/docs/analytics/privacy-policy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      vercel.com/docs/analytics
                    </a>
                  </p>
                </div>

                <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                  <h3 className="mb-1 font-semibold text-foreground">Vercel Speed Insights</h3>
                  <p className="text-sm">
                    <strong>Purpose:</strong> Real User Monitoring (RUM) for performance metrics<br />
                    <strong>Data collected:</strong> Core Web Vitals (LCP, FID, CLS), page load times, device performance data<br />
                    <strong>Tracking:</strong> Does NOT use cookies, anonymized performance metrics only<br />
                    <strong>Privacy-first:</strong> No personal data collected<br />
                    <strong>Privacy policy:</strong>{' '}
                    <a 
                      href="https://vercel.com/docs/speed-insights#privacy" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      vercel.com/docs/speed-insights
                    </a>
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-lg border border-green-500/20 bg-green-500/5 p-4">
                <p className="text-sm text-foreground">
                  <strong>Important:</strong> Vercel Analytics and Speed Insights are privacy-first tools that 
                  do NOT require cookie consent banners under GDPR because they don't use cookies or track 
                  personal data. They collect only anonymous, aggregated metrics to improve performance.
                </p>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">8. Children's Privacy</h2>
            <p className="text-sm text-muted-foreground">
              FeedCentral is not intended for users under 16 years of age. We do not knowingly collect 
              personal information from children under 16. If you are a parent or guardian and believe 
              your child has provided us with personal information, please contact us immediately, and 
              we will delete such information.
            </p>
          </section>

          {/* International Transfers */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">9. International Data Transfers</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                While our primary database is hosted in the EU region, some technical services may involve 
                data transfers to countries outside the European Economic Area (EEA).
              </p>

              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                <h3 className="mb-2 text-sm font-semibold text-foreground flex items-center gap-2">
                  <Lock className="h-4 w-4 shrink-0" />
                  Transfer Safeguards
                </h3>
                <p className="text-xs">
                  When your data is transferred outside the EEA, we ensure adequate protection through:
                </p>
                <ul className="ml-4 mt-2 space-y-1 text-xs list-disc">
                  <li>
                    <strong className="text-foreground">Standard Contractual Clauses (SCCs):</strong> European 
                    Commission-approved contract templates that ensure GDPR-level protection (Decision 2021/914)
                  </li>
                  <li>
                    <strong className="text-foreground">EU-U.S. Data Privacy Framework:</strong> Vercel Inc. 
                    participates in the Data Privacy Framework, providing an adequacy mechanism for data transfers 
                    to the United States
                  </li>
                  <li>
                    <strong className="text-foreground">Contractual Commitments:</strong> All third-party 
                    service providers are contractually obligated to maintain GDPR-compliant data protection
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Third-Party Service Locations</h3>
                <ul className="ml-4 space-y-1 text-xs list-disc">
                  <li>
                    <strong className="text-foreground">Vercel Inc. (Hosting):</strong> United States 
                    (Data Privacy Framework participant, uses edge functions for EU data locality where possible)
                  </li>
                  <li>
                    <strong className="text-foreground">Neon (Database):</strong> Configurable region, 
                    typically EU (Frankfurt/Ireland) for European users
                  </li>
                  <li>
                    <strong className="text-foreground">Vercel Analytics/Speed Insights:</strong> Privacy-first, 
                    cookieless analytics with EU data processing options
                  </li>
                </ul>
              </div>

              <p className="text-xs">
                For more information about transfer mechanisms, contact{' '}
                <a href="mailto:contact@benzoogataga.com" className="text-primary hover:underline">
                  contact@benzoogataga.com
                </a>
                {' '}(handled from France).
              </p>
            </div>
          </section>

          {/* Changes to Policy */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">10. Changes to This Policy</h2>
            <p className="text-sm text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new policy on this page and updating the "Last updated" date. 
              For significant changes, we will provide more prominent notice (such as an email notification).
            </p>
          </section>

          {/* Contact */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
              <Mail className="h-6 w-6 text-primary" />
              11. Contact Us
            </h2>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                If you have any questions about this Privacy Policy or how we handle your data, please contact us:
              </p>
              
              <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                <p className="font-semibold text-foreground">FeedCentral Data Protection</p>
                <p className="mt-2">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:contact@benzoogataga.com" className="text-primary hover:underline">
                    contact@benzoogataga.com
                  </a>
                </p>
                <p>
                  <strong>GitHub Issues:</strong>{' '}
                  <a 
                    href="https://github.com/BENZOOgataga/feedcentral/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    github.com/BENZOOgataga/feedcentral/issues
                  </a>
                </p>
                <p className="mt-2 text-xs">
                  Based in France - Subject to French law and GDPR
                </p>
              </div>

              <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/5 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-500" />
                  <div>
                    <p className="font-semibold text-foreground">French Data Protection Authority (CNIL)</p>
                    <p className="mt-1 text-xs">
                      If we cannot resolve your concern, you have the right to lodge a complaint with 
                      the Commission Nationale de l'Informatique et des Libertés (CNIL):{' '}
                      <a 
                        href="https://www.cnil.fr/en/home" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        www.cnil.fr
                      </a>
                    </p>
                  </div>
                </div>
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
                This Privacy Policy applies ONLY to the official FeedCentral project and its official deployments.
              </p>
              <p>
                FeedCentral is open-source software available on GitHub. While we encourage forking and 
                derivative works, we are <strong className="text-foreground">NOT responsible</strong> for:
              </p>
              <ul className="ml-6 space-y-2 list-disc">
                <li>
                  <strong className="text-foreground">Third-party deployments:</strong> Instances of FeedCentral 
                  hosted by other individuals or organizations
                </li>
                <li>
                  <strong className="text-foreground">Modified versions:</strong> Forks that have altered the 
                  codebase, added features, or changed data handling practices
                </li>
                <li>
                  <strong className="text-foreground">Data breaches on forks:</strong> Security incidents, data 
                  leaks, or unauthorized access on third-party instances
                </li>
                <li>
                  <strong className="text-foreground">Non-compliant features:</strong> Illegal or non-GDPR-compliant 
                  modifications made by fork maintainers
                </li>
                <li>
                  <strong className="text-foreground">Malicious code:</strong> Backdoors, tracking, or other 
                  harmful additions made to forked versions
                </li>
              </ul>
              <div className="mt-4 rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                <p className="text-sm text-foreground flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Always verify:</strong> If you're using a FeedCentral instance, make sure you know 
                    who operates it and review their privacy policy. The <strong>official FeedCentral instance</strong> is 
                    hosted at{' '}
                    <a 
                      href="https://feed.benzoogataga.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-semibold"
                    >
                      feed.benzoogataga.com
                    </a>
                    . Third-party instances may have different privacy practices, data handling, and security measures.
                  </span>
                </p>
              </div>
              <p>
                <strong className="text-foreground">Official FeedCentral:</strong>
              </p>
              <ul className="ml-6 space-y-1 list-disc">
                <li>
                  <strong className="text-foreground">Official Domain:</strong>{' '}
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
                  GitHub Repository:{' '}
                  <a 
                    href="https://github.com/BENZOOgataga/feedcentral" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    github.com/BENZOOgataga/feedcentral
                  </a>
                </li>
                <li>Managed by the FeedCentral maintainers</li>
              </ul>
            </div>
          </section>

          {/* Footer Navigation */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline">
              <Link href="/terms">View Terms of Service</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/cookies">View Cookie Policy</Link>
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
