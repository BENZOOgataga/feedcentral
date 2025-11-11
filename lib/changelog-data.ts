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
    version: '1.5.0',
    name: 'Reliability, Ingestion Limits & Cleanup Consolidation',
    type: 'minor',
    date: 'November 11, 2025',
    changes: [
      {
        type: 'feature',
        description: 'Per-source daily ingestion limits (tier-aware)',
        details: 'To keep feeds useful and prevent overload, FeedCentral now enforces daily article limits per source based on your account tier. Free, Premium and Pro tiers have different limits; the UI shows simple indicators so you can see when a source is near its daily limit.',
      },
      {
        type: 'feature',
        description: 'Unified article cleanup endpoint',
        details: 'Background cleanup now runs from a single, consolidated endpoint that handles both system and user-added articles. This simplifies maintenance and ensures old, unbookmarked articles are cleaned up automatically while bookmarked items are preserved for you.',
      },
      {
        type: 'improvement',
        description: 'Cron script compatibility and graceful deprecation',
        details: 'The scheduled cleanup script has been made tolerant of older, legacy endpoints so existing server cron jobs won\'t fail unexpectedly. The old user-article cleanup route now returns a clear deprecation response to help admins update their cron configuration safely.',
      },
      {
        type: 'improvement',
        description: 'UI and translation polish',
        details: 'Various spacing fixes and new i18n keys were added to the Sources and app pages so UI elements display correctly in both English and French. Small layout tweaks improve readability across devices.',
      },
      {
        type: 'fix',
        description: 'Reader and image reliability improvements',
        details: 'Improved handling of article images and reader load logic so articles open reliably even when images come from many different sources. This reduces the chance of client-side errors during reading.',
      },
      {
        type: 'improvement',
        description: 'Operational housekeeping and safer rollouts',
        details: 'Several internal cleanup and deployment changes were made to reduce the risk of scheduled jobs failing during rollout. These are behind-the-scenes improvements that make the service more robust without changing how you use it.',
      },
    ],
  },
  {
    version: '1.4.0',
    name: 'Database Infrastructure & Performance Optimization',
    type: 'minor',
    date: 'November 9, 2025',
    changes: [
      {
        type: 'feature',
        description: 'Improved database infrastructure for better reliability',
        details: 'Migrated to self-hosted database infrastructure with optimized connection pooling for improved performance and reliability. This upgrade provides better control over data and ensures more consistent service availability.',
      },
      {
        type: 'feature',
        description: 'Automated refresh system for custom RSS feeds',
        details: 'User-added custom RSS feeds are now automatically refreshed every 30 minutes, keeping your personalized news sources up-to-date alongside the global feed sources. Supports efficient batch processing for optimal performance.',
      },
      {
        type: 'feature',
        description: 'Enhanced automation infrastructure for reliable content updates',
        details: 'Improved backend automation systems to ensure RSS feeds are fetched reliably and efficiently. The system now runs automated tasks every 30 minutes to keep your news feed fresh with the latest articles from all sources.',
      },
      {
        type: 'feature',
        description: 'About page with project origin, mission, and core values',
        details: 'Created comprehensive /about page explaining FeedCentral\'s origin story, mission, and philosophy. Six main sections: Origin Story (born from frustration with algorithmic feeds), Mission (taking back control with transparency, privacy, simplicity, chronological feeds), Hobby Project (built by one developer as passion project), Open Source (MIT licensed, free to fork), Future (user-driven features), and Support (ways to help). Fully translated UI in both English and French. Includes links to GitHub, roadmap, and Patreon. Added to footer navigation in Project section. Features "Return to Home" buttons at both top and bottom for improved navigation.',
      },
      {
        type: 'improvement',
        description: 'Landing page design improvements with better visual hierarchy',
        details: 'Improved the landing page hero section with more prominent call-to-action buttons and better visual balance. The "Start Browsing" button is now larger and more eye-catching, while maintaining perfect symmetry with the buttons below. Enhanced French translations for better readability.',
      },
      {
        type: 'improvement',
        description: 'Massive RSS feed performance optimization - 75% faster updates',
        details: 'Significantly improved the speed of fetching articles from RSS feeds. What used to take 4 minutes now completes in under 1 minute, meaning you get fresh news faster. This was achieved through better batch processing and optimized database operations.',
      },
      {
        type: 'improvement',
        description: 'Settings page UX reorganization - grouped security settings',
        details: 'Moved Two-Factor Authentication section from standalone placement after Premium License area to Account Information section, right after the Password field. All security-related settings (Name, Email, Password, 2FA) are now logically grouped together, separate from billing/premium features. Improved information architecture and user experience.',
      },
      {
        type: 'improvement',
        description: 'Added historical articles from RSS feeds',
        details: 'Populated the feed with historical articles from all sources. Successfully added 104 new articles from the past weeks, with top contributions from Bloomberg (29), Forbes (25), and Phys.org (16). Note: RSS feeds typically only provide recent content from the last 7-30 days.',
      },
      {
        type: 'removal',
        description: 'Temporarily disabled Two-Factor Authentication feature',
        details: 'The 2FA feature has been temporarily disabled due to technical issues. A "Coming Soon" notice is displayed in the Settings page. Users who previously had 2FA enabled can still access their accounts normally. We\'re working to bring back this security feature in a future update.',
      },
      {
        type: 'fix',
        description: 'Fixed backend system for custom RSS feeds',
        details: 'Resolved internal issues with the custom RSS feed processing system to ensure user-added sources are properly fetched and displayed.',
      },
      {
        type: 'fix',
        description: 'Fixed horizontal scrolling issue on landing page',
        details: 'Resolved an annoying horizontal scroll bug on the landing page that could occur on certain screen sizes. The page now properly fits within the viewport width on all devices.',
      },
      {
        type: 'fix',
        description: 'Improved database connectivity and reliability',
        details: 'Fixed various database connection issues to ensure more stable and reliable service. Improved handling of special characters in configuration for better security.',
      },
    ],
  },
  {
    version: '1.3.0',
    name: 'Testing Infrastructure & Premium Licensing',
    type: 'minor',
    date: 'November 7, 2025',
    changes: [
      {
        type: 'feature',
        description: 'Premium license key system with secure validation',
        details: 'Implemented a secure license key system for Premium and Pro tiers. License keys are cryptographically signed and bound to specific FeedCentral instances to prevent unauthorized use. Admins can generate keys with configurable durations and quantities. Keys follow the format FEED-XXXX-XXXX-XXXX-XXXX and include built-in expiration management.',
      },
      {
        type: 'feature',
        description: 'Comprehensive testing infrastructure for better reliability',
        details: 'Built a complete automated testing system with over 200 test cases covering all major features: authentication, article feeds, custom RSS sources, and user workflows. This helps ensure FeedCentral remains stable and bug-free with future updates.',
      },
      {
        type: 'feature',
        description: 'License tier system with source limits',
        details: 'Three-tier system: Free (10 custom sources), Premium (50 custom sources, priority support, ad-free), and Pro (unlimited sources, early access features). License keys control tier upgrades with automatic expiration tracking. User model extended with premiumTier and premiumExpiresAt fields.',
      },
      {
        type: 'feature',
        description: 'Admin license management interface',
        details: 'New /admin/licenses page for administrators to generate license keys. Form with tier selection, duration input, quantity control, and optional notes. Generated keys display with one-click copy-to-clipboard functionality. Security notice explaining instance binding. Navigation integrated into admin sidebar with Key icon.',
      },
      {
        type: 'feature',
        description: 'License redemption system for upgrading to Premium',
        details: 'Users can now redeem license keys to upgrade their accounts to Premium or Pro tiers. The system validates keys, checks expiration dates, and automatically upgrades your account with the appropriate benefits and source limits.',
      },
      {
        type: 'improvement',
        description: 'Enhanced database structure for premium features',
        details: 'Updated the database to support the new license key system with proper tracking of redemptions, expirations, and user tier upgrades.',
      },
      {
        type: 'improvement',
        description: 'Enhanced security configuration',
        details: 'Improved security infrastructure to better protect license keys and user data with industry-standard cryptographic practices.',
      },
      {
        type: 'improvement',
        description: 'Complete testing documentation',
        details: 'Added comprehensive documentation for the testing system, making it easier for developers to contribute and maintain code quality.',
      },
    ],
  },
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
        description: 'Automated article cleanup system to maintain database health',
        details: 'Implemented a smart cleanup system that automatically removes old unbookmarked articles after 7 days (soft-delete) and permanently deletes very old articles after 14 days. Bookmarked articles are preserved forever and never deleted, ensuring your saved content is always available.',
      },
      {
        type: 'feature',
        description: 'Complete bookmarks feature to save your favorite articles',
        details: 'Save articles you want to read later or keep forever with a simple one-click bookmark button. Bookmarked articles are permanently preserved and will never be deleted by the automatic cleanup system. The dedicated bookmarks page provides a clean interface to manage all your saved articles.',
      },
      {
        type: 'feature',
        description: 'User registration with clear password recovery guidelines',
        details: 'New users can now create accounts. Please note: email-based password recovery is not available. If you forget your password, you\'ll need to contact the administrator for a manual reset. This is clearly communicated during registration.',
      },
      {
        type: 'feature',
        description: 'Intelligent search ranking for better results',
        details: 'Search results are now ranked by relevance, similar to how Google works. Articles with exact title matches appear first, followed by partial title matches, then description matches. This ensures the most relevant articles appear at the top of your search results.',
      },
      {
        type: 'feature',
        description: 'Automated feed refresh and maintenance',
        details: 'RSS feeds are now automatically refreshed every 30 minutes to keep your news feed up-to-date, and old articles are cleaned up daily at 2 AM to maintain optimal performance. Both processes run automatically in the background.',
      },
      {
        type: 'feature',
        description: 'Added Bookmarks, Dashboard, and Settings pages',
      },
      {
        type: 'feature',
        description: 'Added database support for bookmarks feature',
      },
      {
        type: 'improvement',
        description: 'Butter-smooth search animations at 120fps',
        details: 'Search interactions now feel incredibly smooth and responsive with optimized animations running at up to 120fps on capable displays. The search modal uses GPU acceleration and natural spring physics for fluid, professional motion.',
      },
      {
        type: 'improvement',
        description: 'Enhanced search bar with smooth animations',
      },
      {
        type: 'improvement',
        description: 'Improved password change experience',
      },
      {
        type: 'improvement',
        description: 'Support for article images from all trusted sources',
        details: 'Article thumbnails from any HTTPS source are now supported. This is necessary because RSS feeds reference images from various domains, and we want to show you the original images as intended by the publishers. Only secure HTTPS sources are allowed.',
      },
      {
        type: 'improvement',
        description: 'Improved database cleanup system',
      },
      {
        type: 'fix',
        description: 'Improved deployment reliability',
        details: 'Fixed various technical issues with the database connection to ensure stable deployment and reliable service on the hosting platform.',
      },
      {
        type: 'fix',
        description: 'Fixed layout issues across the application',
        details: 'Resolved critical layout bugs where content containers would sometimes render incorrectly, ensuring consistent and responsive layouts across all pages and screen sizes.',
      },
      {
        type: 'fix',
        description: 'Fixed search functionality and styling',
      },
      {
        type: 'fix',
        description: 'Fixed navigation highlighting',
      },
      {
        type: 'fix',
        description: 'Fixed text display on various pages',
      },
      {
        type: 'fix',
        description: 'Fixed build errors',
      },
      {
        type: 'fix',
        description: 'Fixed user account creation',
      },
      {
        type: 'fix',
        description: 'Improved database connection stability',
      },
      {
        type: 'fix',
        description: 'Various database improvements',
      },
      {
        type: 'removal',
        description: 'Cleaned up temporary migration tools',
        details: 'Removed one-time setup tools that were only needed during initial deployment. This improves security and keeps the application clean.',
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
