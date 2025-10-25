'use client';

import { Article } from '@/types';
import { FeedCard } from './FeedCard';
import { useEffect, useRef, useState } from 'react';

interface FeedListProps {
  articles: Article[];
}

// Estimated card height: image (96px) + padding + gap
const CARD_HEIGHT = 140; // Base height including margins
const GAP = 16; // space-y-4 equivalent (1rem = 16px)

export function FeedList({ articles }: FeedListProps) {
  const [containerHeight, setContainerHeight] = useState(800);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });

  // Calculate container height based on viewport
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const viewportHeight = window.innerHeight;
        const rect = containerRef.current.getBoundingClientRect();
        const availableHeight = viewportHeight - rect.top - 80; // 80px buffer for footer/padding
        setContainerHeight(Math.max(400, Math.min(availableHeight, 2000)));
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  // Handle scroll for virtualization
  useEffect(() => {
    if (!scrollContainerRef.current || articles.length < 50) return;

    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollTop = container.scrollTop;
      const itemHeight = CARD_HEIGHT + GAP;
      const overscan = 5;

      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      const visibleCount = Math.ceil(containerHeight / itemHeight) + overscan * 2;
      const end = Math.min(articles.length, start + visibleCount);

      setVisibleRange({ start, end });
    };

    const container = scrollContainerRef.current;
    container.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation

    return () => container.removeEventListener('scroll', handleScroll);
  }, [articles.length, containerHeight]);

  if (articles.length === 0) {
    return null;
  }

  // For small lists (< 50 items), render normally without virtualization
  if (articles.length < 50) {
    return (
      <div className="space-y-4">
        {articles.map((article, index) => (
          <FeedCard key={article.id} article={article} index={index} />
        ))}
      </div>
    );
  }

  // Virtualized list for large datasets
  const totalHeight = articles.length * (CARD_HEIGHT + GAP);
  const offsetY = visibleRange.start * (CARD_HEIGHT + GAP);
  const visibleArticles = articles.slice(visibleRange.start, visibleRange.end);

  return (
    <div ref={containerRef} className="w-full">
      <div
        ref={scrollContainerRef}
        style={{
          height: `${containerHeight}px`,
          overflow: 'auto',
          position: 'relative',
        }}
        className="scrollbar-thin"
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${offsetY}px)`,
              willChange: 'transform',
            }}
          >
            <div className="space-y-4">
              {visibleArticles.map((article, idx) => (
                <FeedCard
                  key={article.id}
                  article={article}
                  index={visibleRange.start + idx}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
