'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Users, ArrowLeft, Github, Heart, Code, Lightbulb } from 'lucide-react';

interface Contributor {
  name: string;
  github: string;
  role: string;
  avatar?: string;
  contributions: string[];
}

const contributors: Contributor[] = [
  {
    name: 'BENZOOgataga',
    github: 'BENZOOgataga',
    role: 'Maintainer',
    contributions: [
      'Project creator and lead developer',
      'Architecture and infrastructure',
      'Core features implementation',
    ],
  },
  {
    name: 'shiyyuu',
    github: 'liliaceae0',
    role: 'Contributor',
    contributions: [
      'Day-one contributor with valuable ideas',
      'Continuous feedback and suggestions',
      'Testing and quality assurance',
    ],
  },
  {
    name: 'lirus',
    github: 'lavecat',
    role: 'Contributor',
    contributions: [
      'Testing and bug reporting',
      'Feature ideas and improvements',
      'User experience feedback',
    ],
  },
  {
    name: 'smechrafi',
    github: 'smechrafi',
    role: 'Early Contributor',
    contributions: [
      'Early supporter and tester',
      'Feedback and suggestions',
      'Community engagement',
    ],
  },
  {
    name: 'Seanero',
    github: 'Seanero',
    role: 'Bug Hunter',
    contributions: [
      'Found critical article reader image overflow bug',
      'Reported inline style issues with RSS images',
      'Helped improve article reading experience',
    ],
  },
];

export default function ContributorsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/40 bg-card/30">
        <div className="content-container px-4 py-16 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Users className="h-12 w-12 text-primary" />
                </div>
              </div>
              
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Contributors
              </h1>
              
              <p className="mb-8 text-lg text-muted-foreground">
                People who've helped make FeedCentral better
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-4xl space-y-8">

          {/* Thank You Message */}
          <section className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-6">
            <div className="flex items-start gap-4">
              <Heart className="h-6 w-6 shrink-0 text-blue-500 mt-1" />
              <div>
                <h2 className="mb-2 text-xl font-bold text-foreground">Thank You!</h2>
                <p className="text-sm text-muted-foreground">
                  FeedCentral is a hobby project, but it wouldn't be what it is without the people below.
                  Whether it's testing, ideas, feedback, or just moral support, every contribution matters.
                </p>
              </div>
            </div>
          </section>

          {/* Contributors List */}
          <section className="space-y-6">
            {contributors.map((contributor, index) => (
              <div 
                key={index}
                className="rounded-xl border border-border/50 bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
                  {/* Avatar */}
                  <div className="flex justify-center sm:justify-start">
                    <a
                      href={`https://github.com/${contributor.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group"
                    >
                      <img
                        src={`https://github.com/${contributor.github}.png`}
                        alt={contributor.name}
                        className="h-20 w-20 rounded-full border-2 border-border transition-all group-hover:border-primary"
                      />
                    </a>
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-center sm:text-left">
                    <div className="mb-3">
                      <h3 className="mb-1 text-xl font-bold text-foreground">
                        {contributor.name}
                      </h3>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        <span className={`inline-flex items-center gap-1.5 text-sm ${
                          contributor.role === 'Maintainer' 
                            ? 'text-primary font-semibold' 
                            : 'text-muted-foreground'
                        }`}>
                          {contributor.role === 'Maintainer' ? (
                            <Code className="h-4 w-4" />
                          ) : (
                            <Lightbulb className="h-4 w-4" />
                          )}
                          {contributor.role}
                        </span>
                        <a
                          href={`https://github.com/${contributor.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Github className="h-4 w-4" />
                          @{contributor.github}
                        </a>
                      </div>
                    </div>

                    {/* Contributions */}
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {contributor.contributions.map((contribution, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          <span>{contribution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* Want to Contribute */}
          <section className="rounded-xl border border-green-500/20 bg-green-500/5 p-6">
            <h2 className="mb-3 text-xl font-bold text-foreground">Want to Contribute?</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              FeedCentral is open source! Contributions come in many forms:
            </p>
            <ul className="mb-4 ml-6 space-y-2 text-sm text-muted-foreground list-disc">
              <li>Testing and reporting bugs</li>
              <li>Suggesting features or improvements</li>
              <li>Contributing code via pull requests</li>
              <li>Improving documentation</li>
              <li>Sharing FeedCentral with others</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" size="sm">
                <a 
                  href="https://github.com/BENZOOgataga/feedcentral/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="mr-2 h-4 w-4" />
                  Report an Issue
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a 
                  href="https://github.com/BENZOOgataga/feedcentral/discussions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Start a Discussion
                </a>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a 
                  href="https://github.com/BENZOOgataga/feedcentral"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on GitHub
                </a>
              </Button>
            </div>
          </section>

          {/* Support Section */}
          <section className="rounded-xl border border-pink-500/20 bg-pink-500/5 p-6">
            <h2 className="mb-3 text-xl font-bold text-foreground flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Support the Project
            </h2>
            <p className="mb-4 text-sm text-muted-foreground">
              If you'd like to support FeedCentral's development, you can check out my{' '}
              <a 
                href="https://www.patreon.com/BENZOOgataga" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-pink-500 hover:underline font-semibold"
              >
                Patreon
              </a>
              . But the best support is using the app, sharing feedback, and contributing to the community!
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
