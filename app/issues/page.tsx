'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertCircle, Bug, CheckCircle2, Copy, ExternalLink, FileText, Github, Info, Lightbulb } from 'lucide-react';
import { useState } from 'react';

export default function IssuesPage() {
  const [copied, setCopied] = useState(false);

  const issueTemplate = `## Bug Description
A clear and concise description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
A clear description of what you expected to happen.

## Actual Behavior
What actually happened instead.

## Screenshots
If applicable, add screenshots to help explain your problem.

## Environment
- Browser: [e.g., Chrome, Firefox, Safari]
- OS: [e.g., Windows, macOS, Linux]
- Version: [e.g., v1.1.0]

## Additional Context
Add any other context about the problem here.`;

  const copyTemplate = () => {
    navigator.clipboard.writeText(issueTemplate);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="content-container px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Bug className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Report an Issue
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground">
              Help us improve FeedCentral by reporting bugs, suggesting features, or asking questions
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild size="lg" className="gap-2">
                <a 
                  href="https://github.com/BENZOOgataga/feedcentral/issues/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github className="h-5 w-5" />
                  Report on GitHub
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2">
                <Link href="/changelog">
                  View Changelog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl space-y-12">
          
          {/* What to Report */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
              <Info className="h-6 w-6 text-blue-500" />
              What to Report
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Bug className="mt-1 h-5 w-5 shrink-0 text-red-500" />
                <div>
                  <h3 className="font-semibold text-foreground">Bugs & Errors</h3>
                  <p className="text-sm text-muted-foreground">
                    Something broken? App crashing? Features not working as expected? Let us know!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Lightbulb className="mt-1 h-5 w-5 shrink-0 text-yellow-500" />
                <div>
                  <h3 className="font-semibold text-foreground">Feature Requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Have an idea for a new feature or improvement? We'd love to hear your suggestions!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-orange-500" />
                <div>
                  <h3 className="font-semibold text-foreground">Security Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    Found a security vulnerability? Please report it responsibly through GitHub's security advisory.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FileText className="mt-1 h-5 w-5 shrink-0 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-foreground">Documentation Issues</h3>
                  <p className="text-sm text-muted-foreground">
                    Found unclear or missing documentation? Help us improve our guides and instructions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* When to Report */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              When to Report
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Before reporting:</strong> Check if the issue already exists in our{' '}
                  <a 
                    href="https://github.com/BENZOOgataga/feedcentral/issues" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    issue tracker
                  </a>
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Try to reproduce:</strong> Make sure the issue happens consistently and isn't a one-time glitch
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Clear your cache:</strong> Sometimes browser cache can cause issues. Try clearing it first
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">Check the changelog:</strong> The issue might already be fixed in the latest version
                </p>
              </div>
            </div>
          </section>

          {/* How to Report */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
              <Github className="h-6 w-6" />
              How to Report
            </h2>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Follow these steps to create a helpful bug report:
              </p>

              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    1
                  </span>
                  <div className="flex-1">
                    <p>
                      <strong className="text-foreground">Go to our GitHub Issues page:</strong>{' '}
                      <a 
                        href="https://github.com/BENZOOgataga/feedcentral/issues" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        github.com/BENZOOgataga/feedcentral/issues
                      </a>
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    2
                  </span>
                  <p className="flex-1">
                    <strong className="text-foreground">Search existing issues</strong> to avoid duplicates
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    3
                  </span>
                  <p className="flex-1">
                    <strong className="text-foreground">Click "New Issue"</strong> to create a new report
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    4
                  </span>
                  <p className="flex-1">
                    <strong className="text-foreground">Use our template below</strong> to structure your report
                  </p>
                </li>

                <li className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    5
                  </span>
                  <p className="flex-1">
                    <strong className="text-foreground">Add relevant labels</strong> like "bug", "enhancement", or "question"
                  </p>
                </li>
              </ol>
            </div>
          </section>

          {/* Issue Template */}
          <section className="rounded-xl border border-border/50 bg-card p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground">
                <FileText className="h-6 w-6 text-primary" />
                Issue Template
              </h2>
              <Button
                size="sm"
                variant="outline"
                onClick={copyTemplate}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Template
                  </>
                )}
              </Button>
            </div>

            <p className="mb-4 text-sm text-muted-foreground">
              Copy this template and fill it out when creating your issue:
            </p>

            <div className="relative rounded-lg border border-border bg-muted/30 p-4">
              <pre className="overflow-x-auto text-xs text-foreground/90">
                <code>{issueTemplate}</code>
              </pre>
            </div>
          </section>

          {/* Tips */}
          <section className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-6">
            <h2 className="mb-4 flex items-center gap-3 text-xl font-bold text-foreground">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              Pro Tips
            </h2>
            
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Include screenshots or screen recordings when possible</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Provide specific steps to reproduce the issue</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Mention your browser version and operating system</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Check the browser console for any error messages</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1">•</span>
                <span>Be respectful and constructive in your feedback</span>
              </li>
            </ul>
          </section>

          {/* Footer */}
          <div className="text-center">
            <p className="mb-4 text-sm text-muted-foreground">
              Thank you for helping us improve FeedCentral!
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button asChild className="gap-2">
                <a 
                  href="https://github.com/BENZOOgataga/feedcentral/issues/new" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Github className="h-4 w-4" />
                  Create an Issue
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/app">
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
