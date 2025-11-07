'use client';

import { useState } from 'react';
import { ArticleHeader } from '@/components/reader/ArticleHeader';
import { ArticleContent } from '@/components/reader/ArticleContent';
import { Button } from '@/components/ui/button';
import { Article } from '@/types';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

// Sample articles for testing
const sampleArticles: Article[] = [
  {
    id: 'dev-1',
    title: 'Understanding React Server Components: A Deep Dive',
    description: 'Explore the architecture and benefits of React Server Components in modern web applications.',
    content: `
      <h2>Introduction to Server Components</h2>
      <p>React Server Components represent a paradigm shift in how we build React applications. They allow us to render components on the server, reducing the JavaScript bundle size sent to the client.</p>
      
      <img src="https://picsum.photos/800/400?random=1" alt="Sample diagram" />
      
      <h3>Key Benefits</h3>
      <ul>
        <li><strong>Zero Bundle Size:</strong> Server Components don't add to your JavaScript bundle.</li>
        <li><strong>Full Backend Access:</strong> Direct access to databases, file systems, and other server-only resources.</li>
        <li><strong>Automatic Code Splitting:</strong> Only the necessary code is loaded.</li>
        <li><strong>Better SEO:</strong> Content is rendered on the server for better indexing.</li>
      </ul>
      
      <h3>How They Work</h3>
      <p>Server Components are rendered on the server and sent to the client as a serialized format. They can seamlessly integrate with Client Components, creating a powerful hybrid rendering model.</p>
      
      <img src="https://picsum.photos/800/450?random=2" alt="Architecture diagram" />
      
      <pre><code>// Server Component example
export default async function BlogPost({ id }) {
  const post = await db.post.findUnique({ where: { id } });
  return &lt;article&gt;{post.content}&lt;/article&gt;;
}</code></pre>
      
      <h3>Best Practices</h3>
      <ol>
        <li>Use Server Components by default</li>
        <li>Only use Client Components when you need interactivity</li>
        <li>Keep data fetching close to where it's used</li>
        <li>Leverage streaming for better UX</li>
      </ol>
      
      <blockquote>
        <p>"Server Components are not a replacement for Client Components, but rather a complementary rendering strategy that enables new patterns."</p>
      </blockquote>
    `,
    url: 'https://example.com/article-1',
    imageUrl: 'https://picsum.photos/1200/630?random=1',
    author: 'Jane Developer',
    publishedAt: new Date('2024-11-01'),
    tags: ['react', 'server-components', 'web-dev'],
    source: {
      id: 'dev-source-1',
      name: 'Tech Insights',
      url: 'https://example.com',
      feedUrl: 'https://example.com/feed',
      logoUrl: undefined,
      isActive: true,
      fetchInterval: 30,
      category: {
        id: 'dev-cat-1',
        name: 'Technology',
        slug: 'technology',
        icon: '💻',
        color: '#7C5CFF',
        order: 0,
      },
    },
    category: {
      id: 'dev-cat-1',
      name: 'Technology',
      slug: 'technology',
      icon: '💻',
      color: '#7C5CFF',
      order: 0,
    },
  },
  {
    id: 'dev-2',
    title: 'The Future of Web Performance: Core Web Vitals and Beyond',
    description: 'Learn how to optimize your website for the metrics that matter most to users and search engines.',
    content: `
      <h2>What Are Core Web Vitals?</h2>
      <p>Core Web Vitals are a set of metrics that Google uses to measure user experience on the web. They focus on three key aspects: loading performance, interactivity, and visual stability.</p>
      
      <img src="https://picsum.photos/800/400?random=3" alt="Core Web Vitals metrics" />
      
      <h3>The Three Pillars</h3>
      
      <h4>1. Largest Contentful Paint (LCP)</h4>
      <p>LCP measures loading performance. To provide a good user experience, LCP should occur within 2.5 seconds of when the page first starts loading.</p>
      
      <h4>2. First Input Delay (FID)</h4>
      <p>FID measures interactivity. Pages should have an FID of less than 100 milliseconds.</p>
      
      <img src="https://picsum.photos/800/350?random=4" alt="Performance timeline" />
      
      <h4>3. Cumulative Layout Shift (CLS)</h4>
      <p>CLS measures visual stability. Pages should maintain a CLS of less than 0.1.</p>
      
      <h3>Optimization Strategies</h3>
      <ul>
        <li>Optimize images with modern formats (WebP, AVIF)</li>
        <li>Implement lazy loading for off-screen content</li>
        <li>Minimize JavaScript execution time</li>
        <li>Use font-display: swap for custom fonts</li>
        <li>Set explicit width and height on images and videos</li>
      </ul>
      
      <pre><code>// Example: Image optimization
&lt;Image
  src="/hero.jpg"
  width={1200}
  height={630}
  priority
  alt="Hero image"
/&gt;</code></pre>
      
      <h3>Measuring Performance</h3>
      <p>Use tools like Lighthouse, PageSpeed Insights, and Web Vitals Chrome extension to measure and monitor your Core Web Vitals.</p>
      
      <img src="https://picsum.photos/800/400?random=5" alt="Performance tools" />
    `,
    url: 'https://example.com/article-2',
    imageUrl: 'https://picsum.photos/1200/630?random=2',
    author: 'John Performance',
    publishedAt: new Date('2024-10-28'),
    tags: ['performance', 'web-vitals', 'optimization'],
    source: {
      id: 'dev-source-2',
      name: 'Web Performance Weekly',
      url: 'https://example.com',
      feedUrl: 'https://example.com/feed',
      logoUrl: undefined,
      isActive: true,
      fetchInterval: 30,
      category: {
        id: 'dev-cat-1',
        name: 'Technology',
        slug: 'technology',
        icon: '💻',
        color: '#7C5CFF',
        order: 0,
      },
    },
    category: {
      id: 'dev-cat-1',
      name: 'Technology',
      slug: 'technology',
      icon: '💻',
      color: '#7C5CFF',
      order: 0,
    },
  },
  {
    id: 'dev-3',
    title: 'Building Accessible Web Applications: A Complete Guide',
    description: 'Accessibility is not optional. Learn how to build web applications that everyone can use.',
    content: `
      <h2>Why Accessibility Matters</h2>
      <p>Web accessibility ensures that websites and applications are usable by everyone, including people with disabilities. It's not just the right thing to do—it's often legally required.</p>
      
      <h3>WCAG Guidelines</h3>
      <p>The Web Content Accessibility Guidelines (WCAG) provide a framework for making web content more accessible. They're organized around four principles:</p>
      
      <ul>
        <li><strong>Perceivable:</strong> Information must be presentable to users in ways they can perceive</li>
        <li><strong>Operable:</strong> User interface components must be operable</li>
        <li><strong>Understandable:</strong> Information and operation must be understandable</li>
        <li><strong>Robust:</strong> Content must be robust enough for interpretation by assistive technologies</li>
      </ul>
      
      <img src="https://picsum.photos/800/400?random=6" alt="Accessibility guidelines" />
      
      <h3>Practical Implementation</h3>
      
      <h4>Semantic HTML</h4>
      <p>Use semantic HTML elements to provide meaning and structure:</p>
      
      <pre><code>&lt;nav&gt;&lt;/nav&gt;    - Navigation
&lt;main&gt;&lt;/main&gt;   - Main content
&lt;article&gt;&lt;/article&gt; - Independent content
&lt;aside&gt;&lt;/aside&gt;  - Sidebar content</code></pre>
      
      <h4>ARIA Attributes</h4>
      <p>When semantic HTML isn't enough, use ARIA attributes:</p>
      
      <pre><code>&lt;button aria-label="Close dialog"&gt;×&lt;/button&gt;
&lt;div role="alert" aria-live="polite"&gt;Success!&lt;/div&gt;</code></pre>
      
      <img src="https://picsum.photos/800/350?random=7" alt="Screen reader example" />
      
      <h4>Keyboard Navigation</h4>
      <p>Ensure all interactive elements are keyboard accessible:</p>
      
      <ul>
        <li>Tab through focusable elements</li>
        <li>Enter/Space to activate buttons</li>
        <li>Escape to close dialogs</li>
        <li>Arrow keys for navigation</li>
      </ul>
      
      <h3>Testing Tools</h3>
      <ol>
        <li>Lighthouse accessibility audit</li>
        <li>axe DevTools browser extension</li>
        <li>NVDA or JAWS screen readers</li>
        <li>Keyboard-only navigation testing</li>
      </ol>
      
      <blockquote>
        <p>"The power of the Web is in its universality. Access by everyone regardless of disability is an essential aspect." - Tim Berners-Lee</p>
      </blockquote>
    `,
    url: 'https://example.com/article-3',
    imageUrl: 'https://picsum.photos/1200/630?random=3',
    author: 'Sarah Accessibility',
    publishedAt: new Date('2024-11-05'),
    tags: ['accessibility', 'a11y', 'wcag', 'inclusive-design'],
    source: {
      id: 'dev-source-3',
      name: 'Inclusive Web',
      url: 'https://example.com',
      feedUrl: 'https://example.com/feed',
      logoUrl: undefined,
      isActive: true,
      fetchInterval: 30,
      category: {
        id: 'dev-cat-1',
        name: 'Technology',
        slug: 'technology',
        icon: '💻',
        color: '#7C5CFF',
        order: 0,
      },
    },
    category: {
      id: 'dev-cat-1',
      name: 'Technology',
      slug: 'technology',
      icon: '💻',
      color: '#7C5CFF',
      order: 0,
    },
  },
];

export default function ArticleReaderDevPage() {
  const [currentArticleIndex, setCurrentArticleIndex] = useState(0);
  const currentArticle = sampleArticles[currentArticleIndex];

  const nextArticle = () => {
    setCurrentArticleIndex((prev) => (prev + 1) % sampleArticles.length);
  };

  const prevArticle = () => {
    setCurrentArticleIndex((prev) => (prev - 1 + sampleArticles.length) % sampleArticles.length);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Dev Header */}
      <div className="border-b border-yellow-500/50 bg-yellow-500/10">
        <div className="content-container px-4 py-3 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/app">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to App
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <span className="rounded bg-yellow-500/20 px-2 py-1 text-xs font-medium text-yellow-300">
                  DEV MODE
                </span>
                <span className="text-sm text-muted-foreground">
                  Article Reader Test Page
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentArticleIndex + 1} / {sampleArticles.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Article Controls */}
      <div className="border-b border-border bg-card">
        <div className="content-container px-4 py-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex gap-2">
              <Button onClick={prevArticle} variant="outline" size="sm">
                ← Previous
              </Button>
              <Button onClick={nextArticle} variant="outline" size="sm">
                Next →
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentArticleIndex(0)}
                variant="ghost"
                size="sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to First
              </Button>
            </div>
          </div>
          
          {/* Article Selector */}
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            {sampleArticles.map((article, index) => (
              <button
                key={article.id}
                onClick={() => setCurrentArticleIndex(index)}
                className={`rounded-lg border p-3 text-left transition-all hover:border-primary ${
                  index === currentArticleIndex
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-card'
                }`}
              >
                <div className="text-xs font-medium text-muted-foreground">
                  Sample {index + 1}
                </div>
                <div className="mt-1 text-sm font-semibold line-clamp-2">
                  {article.title}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="content-container px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <ArticleHeader article={currentArticle} />
          
          {currentArticle.content && (
            <div className="mt-8 border-t border-border pt-8">
              <ArticleContent content={currentArticle.content} />
            </div>
          )}
        </div>
      </div>

      {/* Dev Footer */}
      <div className="border-t border-border bg-muted/30">
        <div className="content-container px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-3 text-sm font-semibold">Testing Notes:</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Images should be constrained to container width</li>
              <li>• Content should be properly formatted with prose styling</li>
              <li>• Code blocks should have syntax highlighting background</li>
              <li>• Lists and headings should have proper spacing</li>
              <li>• Bookmark functionality requires authentication</li>
              <li>• External links open in new tab</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
