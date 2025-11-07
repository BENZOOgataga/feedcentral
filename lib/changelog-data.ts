export interface ChangelogEntry {
  version: string;
  name: string;
  type: 'major' | 'minor' | 'patch';
  date: string;
  changes: {
    type: 'feature' | 'improvement' | 'fix' | 'removal';
    description: string;
    details?: string;
  }[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: '1.2.0',
    name: 'Internationalization & Transparency',
    type: 'minor',
    date: 'November 7, 2025',
    changes: [
      {
        type: 'feature',
        description: 'Full French translation with bilingual support (English/French)',
        details: 'Complete internationalization using next-intl with 500+ translation keys. All UI elements, navigation, buttons, tooltips, error messages, and static page headers are now available in French. Users can switch languages from Settings page. Date formatting adapts to locale (e.g., "7 novembre 2025" in French). Actual content (articles, roadmap details, legal text, changelog descriptions) remains in English for technical accuracy.',
      },
      {
        type: 'feature',
        description: 'Added Content Language Disclaimer component for non-English locales',
        details: 'Reusable disclaimer component that appears on static pages (roadmap, contributors, sources, legal pages) when viewing in French. Informs users that main content is in English while UI/navigation is translated. Uses Lucide Info icon with blue accent styling.',
      },
      {
        type: 'feature',
        description: 'Added comprehensive legal pages (Privacy Policy, Terms of Service, Cookie Policy)',
        details: 'Full GDPR and French law compliance with clear, user-friendly language. Includes legal framework references, CNIL guidelines, consumer mediation information, and version tracking. All pages clearly identify the official instance and include appropriate disclaimers for third-party forks.',
      },
      {
        type: 'feature',
        description: 'Created RSS Sources transparency page',
        details: 'New public page showing all RSS feed sources grouped by category, with logos, article counts, last fetch times, and direct links. Helps users understand exactly where their news comes from.',
      },
      {
        type: 'feature',
        description: 'Added Roadmap page with visual timeline design',
        details: 'Five-phase roadmap (Current State, Maybe Soon™, If I Feel Like It, Ambitious Ideas, Pipe Dreams) with gradient timeline and clear messaging that this is a hobby project with no commitments.',
      },
      {
        type: 'feature',
        description: 'Added changelog page to track FeedCentral updates and improvements',
        details: 'This dedicated changelog page provides a comprehensive history of all updates, organized by version with color-coded tags for different change types. Includes expandable cards for detailed explanations, a comprehensive legend explaining update types and change categories, and full translation support for UI elements.',
      },
      {
        type: 'feature',
        description: 'Added Contributors page to recognize testers and community members',
        details: 'New dedicated page showcasing people who have contributed to FeedCentral through testing, ideas, feedback, and support. Features GitHub avatar integration, role badges, and contribution highlights.',
      },
      {
        type: 'feature',
        description: 'Added dynamic changelog notification system with toast and golden button indicator',
        details: 'When a new changelog is published (within 7 days), users see a golden gradient button with a pulsing notification dot on the landing page, plus a toast notification in the top-right corner. The system uses localStorage to track which version users have seen, automatically marks as seen when visiting the changelog page, and includes a developer reset function for testing.',
      },
      {
        type: 'improvement',
        description: 'Standardized legal page styling with consistent banner layout',
        details: 'All three legal pages (Privacy, Terms, Cookies) now have identical structure: title, subtitle, version info, last updated date, disclaimer, and "Applicable to" banner. Banner styling is consistent (text-sm, p-4, centered text, semibold links). Fixed multiple styling inconsistencies across pages.',
      },
      {
        type: 'improvement',
        description: 'Enhanced landing page footer with organized navigation',
        details: 'Redesigned footer with grid layout featuring Project, Legal, Resources, and Contact sections. Makes it easier to find documentation, report issues, or access legal information.',
      },
      {
        type: 'improvement',
        description: 'Integrated Patreon support links across the platform',
        details: 'Added "Support Us" links to the landing page (hero CTA and footer), roadmap, contributors page, and sources page. Makes it easy for users who want to support the project financially.',
      },
      {
        type: 'fix',
        description: 'Fixed article images with inline styles breaking layout',
        details: 'Some RSS feeds include images with hardcoded inline styles (e.g., width:3333px, height:2000px) that were overriding our CSS and causing massive images to overflow the container. Added CSS !important modifiers to force images to constrain to container width (max-width: 100%) and maintain aspect ratio (width: auto, height: auto), regardless of inline style attributes. Images now properly display at readable sizes on all devices.',
      },
    ],
  },
  {
    version: '1.1.0',
    name: 'Foundation & Core Features',
    type: 'minor',
    date: 'October 31, 2025',
    changes: [
      {
        type: 'feature',
        description: 'Implemented automated article cleanup system with soft-delete (7 days) and hard-delete (14 days) strategies',
        details: 'A three-tier cleanup strategy: (1) Soft-delete unbookmarked articles after 7 days by setting a deletedAt timestamp, (2) Archive bookmarked articles with preserved metadata, and (3) Hard-delete very old unbookmarked articles after 14 days to permanently free up database space.',
      },
      {
        type: 'feature',
        description: 'Complete bookmarks feature: user-linked bookmarks with full CRUD API and dedicated UI',
        details: 'Users can now save their favorite articles with a one-click bookmark button. Bookmarked articles are permanently preserved and will never be deleted by the automatic cleanup system. The bookmarks page provides a clean interface to manage all saved articles.',
      },
      {
        type: 'feature',
        description: 'Added user registration with password recovery warning and admin contact guidance',
        details: 'New users can now create accounts with a clear warning that password recovery via email is not available. If users forget their password, they must contact the administrator for a manual reset. This is clearly communicated during registration to set proper expectations.',
      },
      {
        type: 'feature',
        description: 'Implemented Google-like relevance ranking for search results',
        details: 'Search results are now ranked by relevance using multiple factors: exact title matches are prioritized, followed by partial title matches, then description matches. This ensures the most relevant articles appear at the top of search results, similar to how Google ranks pages.',
      },
      {
        type: 'feature',
        description: 'Added crontab configuration and automated feed refresh scripts for production deployment',
        details: 'Production server now runs automated tasks: feed fetching every 30 minutes to keep content fresh, and article cleanup daily at 2 AM to maintain database health. Both scripts include detailed logging and error handling for reliable operation.',
      },
      {
        type: 'feature',
        description: 'Added placeholder pages for Bookmarks, Dashboard, and Settings',
      },
      {
        type: 'feature',
        description: 'Added database migration for bookmarks table with SQL scripts and API endpoints',
      },
      {
        type: 'improvement',
        description: 'Optimized search modal animations to 120fps with GPU acceleration and spring physics',
        details: 'Search interactions now feel incredibly smooth and responsive. By leveraging GPU acceleration (will-change CSS hints) and optimized transition timings, the search modal animates at up to 120fps on capable displays. Spring physics create natural, fluid motion.',
      },
      {
        type: 'improvement',
        description: 'Enhanced search bar with smooth 300ms animations and GPU acceleration',
      },
      {
        type: 'improvement',
        description: 'Replaced password change dialog with toast notifications for better UX',
      },
      {
        type: 'improvement',
        description: 'Allowed all HTTPS images in Next.js config for article thumbnails',
        details: 'Updated Next.js image optimization configuration to accept images from any HTTPS source. This is necessary because RSS feeds reference images from various domains, and trying to maintain a whitelist of all possible sources would be impractical. Only HTTPS sources are allowed for security.',
      },
      {
        type: 'improvement',
        description: 'Added soft-delete migration support for production database',
      },
      {
        type: 'fix',
        description: 'Resolved Prisma client issues with Neon adapter and Vercel deployment',
        details: 'Fixed multiple issues with Prisma deployment on Vercel: configured the Neon serverless adapter correctly, set proper connection pooling, resolved binary bundling issues, and ensured the database client initializes correctly in edge runtime. This involved extensive trial and error with Prisma 6.x and Vercel edge functions.',
      },
      {
        type: 'fix',
        description: 'Fixed width 0px issues in content containers across the application',
        details: 'Resolved a critical layout bug where content containers would sometimes render at 0px width due to Tailwind CSS class conflicts. Added explicit inline width styles and fixed arbitrary value handling to ensure consistent, responsive layouts across all pages.',
      },
      {
        type: 'fix',
        description: 'Fixed search bar width, padding, and API response structure issues',
      },
      {
        type: 'fix',
        description: 'Fixed Feed nav item staying active when navigating to other sections',
      },
      {
        type: 'fix',
        description: 'Resolved text wrapping issues on placeholder pages with proper max-width and padding',
      },
      {
        type: 'fix',
        description: 'Fixed empty preferences route that was causing build errors',
      },
      {
        type: 'fix',
        description: 'Fixed admin user creation and email configuration',
      },
      {
        type: 'fix',
        description: 'Fixed database connection pooling with proper environment variables',
      },
      {
        type: 'fix',
        description: 'Multiple fixes for seed endpoint and database schema alignment',
      },
      {
        type: 'removal',
        description: 'Removed one-time migration endpoints to clean up API surface',
        details: 'Temporary API endpoints used for initial database migrations were removed after successful deployment. These endpoints were only needed during the transition period and posed a potential security risk if left active in production.',
      },
      {
        type: 'removal',
        description: 'Removed Cmd+K keyboard shortcut indicator from search bar for cleaner UI',
        details: 'The Cmd+K (or Ctrl+K) keyboard shortcut badge was removed from the search bar to reduce visual clutter. The shortcut still works, but the UI is now cleaner and more minimalist. Power users can still use the keyboard shortcut without the visual indicator.',
      },
      {
        type: 'removal',
        description: 'Removed default credentials text from login page for better security',
        details: 'Removed the display of default admin credentials from the login page to improve security. While this was helpful during development, showing credentials publicly is a security risk in production. Users should receive credentials securely through other channels.',
      },
      {
        type: 'removal',
        description: 'Removed debug endpoints after fixing database connection issues',
        details: 'Temporary debugging endpoints that were used to diagnose Prisma and Neon adapter connection issues have been removed. These endpoints exposed internal system information and were only needed during troubleshooting. Removing them improves security and reduces API surface area.',
      },
      {
        type: 'removal',
        description: 'Removed temporary setup endpoints after successful deployment',
      },
    ],
  },
  {
    version: '1.0.0',
    name: 'Initial Release',
    type: 'major',
    date: 'October 25, 2025',
    changes: [
      {
        type: 'feature',
        description: 'Initial release of FeedCentral RSS aggregator with Vercel-like design system',
      },
      {
        type: 'feature',
        description: 'User authentication and authorization with JWT tokens',
      },
      {
        type: 'feature',
        description: 'Automatic RSS feed fetching and article aggregation',
      },
      {
        type: 'feature',
        description: 'Admin panel for managing sources, categories, and users',
      },
      {
        type: 'feature',
        description: 'Full-text search with relevance ranking',
      },
      {
        type: 'feature',
        description: 'Responsive design with dark mode support',
      },
      {
        type: 'feature',
        description: 'PostgreSQL database with Prisma ORM',
      },
      {
        type: 'feature',
        description: 'Vercel deployment with automatic HTTPS and edge caching',
      },
    ],
  },
];

// Helper function to check if a changelog entry is new (within 7 days)
export function isChangelogNew(dateString: string): boolean {
  const changelogDate = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - changelogDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 7;
}

// Get the latest changelog entry if it's new
export function getLatestNewChangelog(): ChangelogEntry | null {
  const latest = changelog[0];
  if (latest && isChangelogNew(latest.date)) {
    return latest;
  }
  return null;
}

// Developer utility: Reset the changelog "seen" state to trigger the notification again
// Usage in browser console: window.resetChangelogNotification()
export function resetChangelogNotification(): void {
  const STORAGE_KEY = 'feedcentral-changelog-seen';
  localStorage.removeItem(STORAGE_KEY);
  console.log('✨ Changelog notification reset! Reload the page to see it again.');
}

// Expose to window for easy developer access
if (typeof window !== 'undefined') {
  (window as any).resetChangelogNotification = resetChangelogNotification;
}
