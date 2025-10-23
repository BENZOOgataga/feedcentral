'use client';

import { motion } from 'framer-motion';
import { Search, Moon, Sun, Home, Bookmark, BarChart3, Settings, ExternalLink } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import Image from 'next/image';

// Mock data
const MOCK_ARTICLES = [
  {
    id: '1',
    title: 'The Future of WebAssembly in Modern Development',
    excerpt: 'Exploring how WASM is revolutionizing browser-based applications and enabling new possibilities for cross-platform development.',
    source: 'Dev.to',
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop',
    publishedAt: '2024-01-15T10:30:00Z',
    url: 'https://example.com/article/1'
  },
  {
    id: '2',
    title: 'GPT-5 Architecture: What We Know So Far',
    excerpt: 'Latest insights into the upcoming GPT-5 model, its potential capabilities, and expected performance improvements.',
    source: 'AI News',
    category: 'AI',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    publishedAt: '2024-01-14T14:20:00Z',
    url: 'https://example.com/article/2'
  },
  {
    id: '3',
    title: 'Zero-Day Vulnerability Found in Popular Linux Kernel Module',
    excerpt: 'Security researchers discover critical flaw affecting millions of systems worldwide. Patch expected within 48 hours.',
    source: 'The Hacker News',
    category: 'Cyber',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop',
    publishedAt: '2024-01-14T09:15:00Z',
    url: 'https://example.com/article/3'
  },
  {
    id: '4',
    title: 'Quantum Computing Breakthrough at MIT',
    excerpt: 'Researchers achieve stable 1000-qubit system, marking a significant milestone in quantum computation scalability.',
    source: 'Nature',
    category: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=400&fit=crop',
    publishedAt: '2024-01-13T16:45:00Z',
    url: 'https://example.com/article/4'
  },
  {
    id: '5',
    title: 'Next.js 15: Performance Optimizations and New Features',
    excerpt: 'Deep dive into the latest release, including improved server components, faster builds, and enhanced caching strategies.',
    source: 'Vercel Blog',
    category: 'Tech',
    imageUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop',
    publishedAt: '2024-01-13T11:00:00Z',
    url: 'https://example.com/article/5'
  },
  {
    id: '6',
    title: 'OpenAI Announces New Vision Model Capabilities',
    excerpt: 'Enhanced image understanding, real-time video analysis, and improved multimodal reasoning in latest update.',
    source: 'OpenAI',
    category: 'AI',
    imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=400&fit=crop',
    publishedAt: '2024-01-12T13:30:00Z',
    url: 'https://example.com/article/6'
  },
  {
    id: '7',
    title: 'CISA Releases New Cybersecurity Framework for Critical Infrastructure',
    excerpt: 'Updated guidelines aim to strengthen defense posture against nation-state actors and ransomware groups.',
    source: 'CISA',
    category: 'Cyber',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=400&fit=crop',
    publishedAt: '2024-01-12T08:00:00Z',
    url: 'https://example.com/article/7'
  },
  {
    id: '8',
    title: 'James Webb Telescope Discovers Earth-like Exoplanet',
    excerpt: 'Promising biosignatures detected in atmosphere of planet 120 light-years away, raising questions about extraterrestrial life.',
    source: 'NASA',
    category: 'Science',
    imageUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=800&h=400&fit=crop',
    publishedAt: '2024-01-11T17:20:00Z',
    url: 'https://example.com/article/8'
  }
];

const CATEGORIES = ['All', 'Tech', 'AI', 'Cyber', 'Science'];

// Utility function for date formatting
const formatDate = (isoString: string): string => {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.16, 1, 0.3, 1]
    }
  }
};

export default function DemoPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredArticles = selectedCategory === 'All' 
    ? MOCK_ARTICLES 
    : MOCK_ARTICLES.filter(article => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <div className="content-container">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#7C5CFF] flex items-center justify-center">
                <span className="text-white font-bold text-sm">FC</span>
              </div>
              <span className="font-semibold text-lg hidden sm:inline">FeedCentral</span>
            </div>

            {/* Search */}
            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  className="w-full h-9 pl-9 pr-4 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-[#7C5CFF]/50 transition-all"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="h-9 w-9 rounded-lg hover:bg-secondary transition-colors flex items-center justify-center"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
              )}
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#7C5CFF] to-[#6B4FE6] flex items-center justify-center">
                <span className="text-white text-xs font-semibold">BZ</span>
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Sidebar (Desktop) */}
      <aside className="hidden lg:fixed lg:flex lg:flex-col lg:left-0 lg:top-16 lg:h-[calc(100vh-4rem)] lg:w-16 lg:border-r lg:border-border lg:bg-background/50 lg:backdrop-blur-sm">
        <nav className="flex flex-col items-center gap-2 p-2 mt-4">
          {[
            { icon: Home, label: 'Home', active: true },
            { icon: Bookmark, label: 'Sources', active: false },
            { icon: BarChart3, label: 'Analytics', active: false },
            { icon: Settings, label: 'Settings', active: false }
          ].map((item) => (
            <motion.button
              key={item.label}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${
                item.active 
                  ? 'bg-[#7C5CFF] text-white' 
                  : 'hover:bg-secondary text-muted-foreground hover:text-foreground'
              }`}
              aria-label={item.label}
            >
              <item.icon className="h-5 w-5" />
              {item.active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute inset-0 rounded-lg ring-2 ring-[#7C5CFF]/50"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
            </motion.button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-16">
        <div className="content-container px-4 md:px-6 py-8">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex gap-2 mb-8 overflow-x-auto pb-2"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-[#7C5CFF] text-white shadow-[0_4px_20px_rgba(124,92,255,0.3)]'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Articles Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filteredArticles.map((article) => (
              <motion.article
                key={article.id}
                variants={cardVariants}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="group relative rounded-lg border border-border bg-card overflow-hidden hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-shadow"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-secondary">
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-black/50 text-white backdrop-blur-sm">
                      {article.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{article.source}</span>
                    <span>•</span>
                    <time>{formatDate(article.publishedAt)}</time>
                  </div>

                  <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-[#7C5CFF] transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {article.excerpt}
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full h-9 rounded-lg bg-secondary hover:bg-[#7C5CFF] hover:text-white transition-all flex items-center justify-center gap-2 text-sm font-medium group/btn"
                  >
                    Read Article
                    <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                  </motion.button>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="border-t border-border mt-16"
        >
          <div className="content-container px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>
                Built with Next.js, Tailwind CSS, and Framer Motion
              </p>
              <p>
                © {new Date().getFullYear()} FeedCentral - All rights reserved
              </p>
            </div>
          </div>
        </motion.footer>
      </main>
    </div>
  );
}
