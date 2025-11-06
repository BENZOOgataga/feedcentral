'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileText, Scale, AlertCircle, Shield, Ban, UserX, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="content-container px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Scale className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Terms of Service
            </h1>
            
            <p className="mb-2 text-lg text-muted-foreground">
              Legal terms and conditions for using FeedCentral
            </p>

            <p className="mb-4 text-sm text-muted-foreground">
              Version 1.0 | Document ID: TOS-20251106-v1
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
                  {' '}only. Third-party forks must provide their own terms of service.
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

          {/* Introduction */}
          <section className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
            <h2 className="mb-4 text-xl font-bold text-foreground">Agreement to Terms</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                By accessing or using FeedCentral ("the Service"), you agree to be bound by these 
                Terms of Service ("Terms"). If you disagree with any part of these terms, you may not 
                access the Service.
              </p>
              <p>
                <strong className="text-foreground">Governing Law:</strong> These Terms are governed by 
                the laws of France. The Service is operated and maintained from France by an individual 
                operator. Full identity and postal address available upon legitimate legal request to the 
                hosting provider (Vercel Inc.).
              </p>

              <div className="rounded-lg border border-blue-600/20 bg-blue-600/5 p-3 mt-3">
                <h3 className="mb-2 text-xs font-semibold text-foreground flex items-center gap-2">
                  <Scale className="h-3 w-3 shrink-0" />
                  Applicable Legal Framework
                </h3>
                <ul className="ml-4 space-y-1 text-xs list-disc">
                  <li>
                    <strong className="text-foreground">GDPR:</strong> Regulation (EU) 2016/679 (data protection)
                  </li>
                  <li>
                    <strong className="text-foreground">French Data Protection Law:</strong> Loi n° 78-17 
                    du 6 janvier 1978 relative à l'informatique, aux fichiers et aux libertés
                  </li>
                  <li>
                    <strong className="text-foreground">French Consumer Code:</strong> Code de la consommation 
                    (consumer rights, mediation)
                  </li>
                  <li>
                    <strong className="text-foreground">Digital Economy Law:</strong> Loi n° 2004-575 du 21 juin 2004 
                    pour la confiance dans l'économie numérique (LCEN)
                  </li>
                </ul>
              </div>

              <p>
                <strong className="text-foreground">Open Source:</strong> FeedCentral is an open-source 
                project available at{' '}
                <a 
                  href="https://github.com/BENZOOgataga/feedcentral" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  github.com/BENZOOgataga/feedcentral
                </a>
                . The source code is licensed separately under an open-source license.
              </p>
            </div>
          </section>

          {/* Service Description */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">1. Service Description</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                FeedCentral is a free, open-source RSS feed aggregation service that allows users to:
              </p>
              <ul className="ml-6 space-y-1 list-disc">
                <li>Subscribe to and organize RSS feeds</li>
                <li>Read and bookmark articles from various sources</li>
                <li>Customize their reading experience</li>
                <li>Access personalized content recommendations</li>
              </ul>
              <p>
                The Service is provided "as is" and "as available" without warranties of any kind, 
                either express or implied.
              </p>
            </div>
          </section>

          {/* User Accounts */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
              <Shield className="h-6 w-6 text-primary" />
              2. User Accounts
            </h2>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">2.1 Account Creation</h3>
                <p>
                  To use certain features, you must create an account. You must:
                </p>
                <ul className="ml-6 mt-2 space-y-1 list-disc">
                  <li>Be at least 16 years old</li>
                  <li>Provide accurate and complete information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">2.2 Account Responsibilities</h3>
                <p>
                  You are responsible for:
                </p>
                <ul className="ml-6 mt-2 space-y-1 list-disc">
                  <li>All activities that occur under your account</li>
                  <li>Maintaining the security of your account credentials</li>
                  <li>Complying with these Terms while using the Service</li>
                </ul>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">2.3 Account Termination</h3>
                <p>
                  You may delete your account at any time through your settings. We may suspend or 
                  terminate your account if you violate these Terms. Upon termination, your personal 
                  data will be deleted in accordance with our Privacy Policy.
                </p>
              </div>
            </div>
          </section>

          {/* Acceptable Use */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
              <Ban className="h-6 w-6 text-red-500" />
              3. Acceptable Use Policy
            </h2>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                You agree <strong className="text-foreground">NOT</strong> to use the Service to:
              </p>
              
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <p>Violate any applicable laws or regulations</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <p>Infringe upon the intellectual property rights of others</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <p>Transmit malicious code, viruses, or harmful content</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <p>Attempt to gain unauthorized access to the Service or other users' accounts</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <p>Scrape, spider, or crawl the Service using automated means without permission</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <p>Overload or interfere with the Service's infrastructure</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <p>Impersonate others or provide false information</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  <p>Harass, abuse, or harm other users</p>
                </div>
              </div>
            </div>
          </section>

          {/* Content & Copyright */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">4. Content & Intellectual Property</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">4.1 RSS Feed Content</h3>
                <p>
                  FeedCentral aggregates content from publicly available RSS feeds. We do not claim 
                  ownership of this content. All rights remain with the original content creators and publishers.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">4.2 Service Content</h3>
                <p>
                  The FeedCentral platform, including its design, code, and features, is open source. 
                  The source code is available under the license specified in the GitHub repository. 
                  However, the FeedCentral name and branding remain our property.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">4.3 Copyright Complaints</h3>
                <p>
                  If you believe content on FeedCentral infringes your copyright, please contact us at{' '}
                  <a href="mailto:contact@benzoogataga.com" className="text-primary hover:underline">
                    contact@benzoogataga.com
                  </a>
                  {' '}with details of the alleged infringement.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">5. Privacy & Data Protection</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                Your use of the Service is also governed by our Privacy Policy, which complies with 
                GDPR and French data protection laws. By using the Service, you consent to the 
                collection and use of your information as described in our{' '}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <p>
                <strong className="text-foreground">Key points:</strong>
              </p>
              <ul className="ml-6 space-y-1 list-disc">
                <li>We collect minimal data necessary to provide the Service</li>
                <li>We do not sell or share your personal data with third parties for marketing</li>
                <li>You have full control over your data and can delete it at any time</li>
                <li>All data handling is transparent (viewable in our open-source code)</li>
              </ul>
            </div>
          </section>

          {/* Liability */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
              <AlertCircle className="h-6 w-6 text-orange-500" />
              6. Limitation of Liability
            </h2>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Service Availability:</strong> We strive to maintain 
                high availability, but we do not guarantee that the Service will be uninterrupted, 
                timely, secure, or error-free.
              </p>
              
              <p>
                <strong className="text-foreground">No Warranty:</strong> The Service is provided "as is" 
                without warranties of any kind. We do not warrant that:
              </p>
              <ul className="ml-6 space-y-1 list-disc">
                <li>The Service will meet your specific requirements</li>
                <li>The Service will be completely secure or free from bugs</li>
                <li>Content from RSS feeds will be accurate or reliable</li>
              </ul>

              <p>
                <strong className="text-foreground">Limitation:</strong> To the maximum extent permitted 
                by law, FeedCentral and its maintainers shall not be liable for any indirect, incidental, 
                special, consequential, or punitive damages arising from your use of the Service.
              </p>

              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <p className="text-sm text-foreground">
                  <strong>French Law Exception:</strong> Nothing in these Terms excludes or limits our 
                  liability for death or personal injury caused by negligence, fraud, or any other 
                  liability that cannot be excluded under French law.
                </p>
              </div>
            </div>
          </section>

          {/* Modifications */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">7. Modifications to Service & Terms</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">7.1 Service Changes</h3>
                <p>
                  We reserve the right to modify, suspend, or discontinue any part of the Service at 
                  any time, with or without notice. We will not be liable to you or any third party 
                  for any modification, suspension, or discontinuance.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">7.2 Terms Changes</h3>
                <p>
                  We may update these Terms from time to time. We will notify you of material changes 
                  by posting the new Terms on this page and updating the "Last updated" date. Your 
                  continued use of the Service after changes constitutes acceptance of the new Terms.
                </p>
              </div>
            </div>
          </section>

          {/* Termination */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">8. Termination</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                We may terminate or suspend your access to the Service immediately, without prior notice 
                or liability, for any reason, including if you breach these Terms.
              </p>
              <p>
                Upon termination:
              </p>
              <ul className="ml-6 space-y-1 list-disc">
                <li>Your right to use the Service will immediately cease</li>
                <li>Your personal data will be deleted in accordance with our Privacy Policy</li>
                <li>Provisions that should survive termination (such as liability limitations) will remain in effect</li>
              </ul>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">9. Dispute Resolution</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                <strong className="text-foreground">Governing Law:</strong> These Terms are governed by 
                and construed in accordance with the laws of France, without regard to its conflict of law provisions.
              </p>
              <p>
                <strong className="text-foreground">Jurisdiction:</strong> Any disputes arising from these 
                Terms or your use of the Service shall be subject to the exclusive jurisdiction of the 
                courts of France.
              </p>
              <p>
                <strong className="text-foreground">Informal Resolution:</strong> Before filing any formal 
                claim, we encourage you to contact us at{' '}
                <a href="mailto:contact@benzoogataga.com" className="text-primary hover:underline">
                  contact@benzoogataga.com
                </a>
                {' '}to attempt to resolve the dispute informally.
              </p>
            </div>
          </section>

          {/* Miscellaneous */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">10. Miscellaneous</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">10.1 Entire Agreement</h3>
                <p>
                  These Terms, together with our Privacy Policy and Cookie Policy, constitute the entire 
                  agreement between you and FeedCentral regarding the Service.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">10.2 Severability</h3>
                <p>
                  If any provision of these Terms is found to be unenforceable, the remaining provisions 
                  will continue in full force and effect.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">10.3 Waiver</h3>
                <p>
                  Our failure to enforce any right or provision of these Terms will not be considered a 
                  waiver of those rights.
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-base font-semibold text-foreground">10.4 Assignment</h3>
                <p>
                  You may not assign or transfer these Terms without our prior written consent. We may 
                  assign our rights and obligations under these Terms without restriction.
                </p>
              </div>
            </div>
          </section>

          {/* Consumer Mediation (French Law) */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">11. Consumer Mediation (Médiation de la consommation)</h2>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                In accordance with Articles L.616-1 and R.616-1 of the French Consumer Code (Code de la consommation), 
                consumers have the right to free mediation to resolve disputes with the service provider.
              </p>

              <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-4">
                <h3 className="mb-2 text-sm font-semibold text-foreground">European Commission Online Dispute Resolution</h3>
                <p className="text-xs">
                  EU consumers can use the European Commission's Online Dispute Resolution (ODR) platform:
                </p>
                <p className="mt-2">
                  <a 
                    href="https://ec.europa.eu/consumers/odr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-xs"
                  >
                    https://ec.europa.eu/consumers/odr
                  </a>
                </p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">Mediation Process</h3>
                <ol className="ml-4 space-y-1 list-decimal text-xs">
                  <li>
                    Before initiating mediation, you must first attempt to resolve the dispute directly 
                    with FeedCentral by contacting{' '}
                    <a href="mailto:contact@benzoogataga.com" className="text-primary hover:underline">
                      contact@benzoogataga.com
                    </a>
                  </li>
                  <li>
                    If direct resolution fails, you may contact a qualified consumer mediator registered 
                    with the French mediation commission (Commission d'évaluation et de contrôle de la 
                    médiation de la consommation)
                  </li>
                  <li>
                    Mediation is free for consumers and confidential
                  </li>
                </ol>
              </div>

              <p className="text-xs">
                <strong className="text-foreground">Note:</strong> FeedCentral is a free, open-source 
                service. Consumer mediation applies primarily to commercial transactions. Since this 
                service is provided free of charge, mediation rights may be limited. Contact us for 
                specific guidance.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
              <FileText className="h-6 w-6 text-primary" />
              12. Contact Information & Legal Mentions
            </h2>
            
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              
              <div className="rounded-lg border border-border/30 bg-muted/20 p-4">
                <p className="font-semibold text-foreground">FeedCentral Legal</p>
                <p className="text-xs text-muted-foreground mb-2 italic">
                  Service Operator: Individual residing in France<br />
                  Full identity and postal address available upon legitimate legal request to hosting provider
                </p>
                <p className="mt-3">
                  <strong>Hosting Provider:</strong><br />
                  Vercel Inc.<br />
                  440 N Barranca Ave #4133<br />
                  Covina, CA 91723<br />
                  United States
                </p>
                <p className="mt-3">
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
                <p className="mt-2 text-xs">
                  Operated from France - Subject to French law
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
                These Terms of Service apply ONLY to the official FeedCentral project and its official deployments.
              </p>
              <p>
                FeedCentral is open-source software. While the code is freely available for forking, we are 
                <strong className="text-foreground"> NOT responsible</strong> for third-party instances or modified versions:
              </p>
              <ul className="ml-6 space-y-2 list-disc">
                <li>
                  <strong className="text-foreground">Third-party deployments:</strong> We do not control, monitor, 
                  or assume liability for instances hosted by other parties
                </li>
                <li>
                  <strong className="text-foreground">Modified versions:</strong> Forks may have different terms, 
                  features, or legal compliance standards
                </li>
                <li>
                  <strong className="text-foreground">User conduct on forks:</strong> We are not responsible for 
                  violations of acceptable use policies on third-party instances
                </li>
                <li>
                  <strong className="text-foreground">Legal disputes:</strong> Claims arising from forked or 
                  modified versions should be directed to their respective operators
                </li>
              </ul>
              <div className="mt-4 rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                <p className="text-sm text-foreground flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>
                    <strong>Verify your instance:</strong> If you're using a FeedCentral deployment, confirm 
                    it's operated by the official FeedCentral team at{' '}
                    <a 
                      href="https://feed.benzoogataga.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline font-semibold"
                    >
                      feed.benzoogataga.com
                    </a>
                    . Third-party instances may have different terms of service, privacy practices, and content policies.
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
                  GitHub:{' '}
                  <a 
                    href="https://github.com/BENZOOgataga/feedcentral" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    github.com/BENZOOgataga/feedcentral
                  </a>
                </li>
                <li>Operated under French law</li>
              </ul>
            </div>
          </section>

          {/* Footer Navigation */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild variant="outline">
              <Link href="/privacy">View Privacy Policy</Link>
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
