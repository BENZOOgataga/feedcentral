# FeedCentral Premium Refonte - Apple × Adobe × Vercel

## Architecture Complete

### Foundation établie ✓
- Tailwind config premium avec tokens Apple/Adobe/Vercel
- Design system dark-first (HSL) avec excellent contraste
- Animations Vercel-style (hover lift, focus rings, press states)
- Utils (cn, formatDate, formatRelativeTime)
- Button component avec variants et animations fluides

---

## Composants UI Core à créer

### 1. Card Component (`components/ui/card.tsx`)

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "glass-strong rounded-xl shadow-elevated border-nested transition-smooth hover-lift",
        className
      )}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
```

### 2. Input Component (`components/ui/input.tsx`)

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-input bg-card px-3 py-2 text-sm ring-offset-background",
          "file:border-0 file:bg-transparent file:text-sm file:font-medium",
          "placeholder:text-muted-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-smooth",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
```

### 3. Badge Component (`components/ui/badge.tsx`)

```typescript
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground shadow-soft",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground shadow-soft",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
```

### 4. Skeleton Component (`components/ui/skeleton.tsx`)

```typescript
import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton", className)}
      {...props}
    />
  );
}

export { Skeleton };
```

---

## Layout Components

### 5. Sidebar Component (`components/layout/sidebar.tsx`)

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  Radio, 
  BarChart3, 
  Settings,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Sources",
    href: "/sources",
    icon: Radio,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 glass border-r border-border/50">
      <div className="flex h-full flex-col p-4">
        {/* Logo */}
        <div className="mb-8 px-2">
          <h1 className="text-xl font-bold gradient-text">FeedCentral</h1>
          <p className="text-xs text-muted-foreground mt-1">RSS Aggregator</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 h-8 w-1 rounded-r-full bg-primary"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 30,
                    }}
                  />
                )}
                
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground px-3">
            © 2025 BENZOO
          </p>
        </div>
      </div>
    </aside>
  );
}
```

### 6. Header Component (`components/layout/header.tsx`)

```typescript
"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/theme-toggle";

interface HeaderProps {
  title: string;
  description?: string;
}

export function Header({ title, description }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 glass-strong border-b border-border/50 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Page title */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Search */}
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search articles..."
            className="pl-9 bg-card/50"
          />
        </div>

        {/* Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
```

### 7. Theme Toggle (`components/theme-toggle.tsx`)

```typescript
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="h-9 w-9"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
```

---

## Feed Components

### 8. FeedItem Component (`components/feed/feed-item.tsx`)

```typescript
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ExternalLink, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRelativeTime } from "@/lib/utils";

interface FeedItemProps {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  source: string;
  pubDate: string;
  index: number;
}

export function FeedItem({
  title,
  description,
  url,
  category,
  source,
  pubDate,
  index,
}: FeedItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: index * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card className="group cursor-pointer">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-3">
            <Badge variant="secondary">{category}</Badge>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(pubDate)}
            </div>
          </div>

          {/* Content */}
          <Link href={url} target="_blank" rel="noopener noreferrer">
            <h3 className="text-base font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {title}
            </h3>
          </Link>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">{source}</span>
            <Link
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              Read more
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
```

### 9. Empty State Component (`components/feed/empty-state.tsx`)

```typescript
import { Search } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-full bg-muted/50 p-6 mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md">
        {description}
      </p>
    </div>
  );
}
```

---

## Page Layouts

### 10. Root Layout (`app/layout.tsx`)

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Sidebar } from "@/components/layout/sidebar";
import "./globals-new.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FeedCentral - RSS Aggregator",
  description: "Professional RSS aggregation platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen">
            <Sidebar />
            <main className="flex-1 pl-64">
              {children}
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 11. Theme Provider (`components/theme-provider.tsx`)

```typescript
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

### 12. Dashboard Page (`app/page.tsx`)

```typescript
import { Header } from "@/components/layout/header";
import { FeedItem } from "@/components/feed/feed-item";
import { EmptyState } from "@/components/feed/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data - replace with real API call
const mockArticles = [
  {
    id: "1",
    title: "Next.js 15 Released with Major Performance Improvements",
    description: "The latest version of Next.js brings significant performance enhancements and new features for modern web development.",
    url: "https://example.com",
    category: "Technology",
    source: "TechCrunch",
    pubDate: new Date(Date.now() - 3600000).toISOString(),
  },
  // Add more mock data...
];

export default async function DashboardPage() {
  // const articles = await fetchArticles();

  return (
    <div className="flex flex-col">
      <Header 
        title="All Feeds" 
        description="Your curated RSS articles from trusted sources"
      />

      <div className="p-6">
        {/* Articles grid */}
        {mockArticles.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockArticles.map((article, index) => (
              <FeedItem
                key={article.id}
                {...article}
                index={index}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No articles found"
            description="Try adjusting your filters or check back later for new content"
          />
        )}
      </div>
    </div>
  );
}
```

---

## Installation Steps

```bash
# Remplacer globals.css
mv app/globals-new.css app/globals.css

# Installer les dépendances Radix UI restantes
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-tabs @radix-ui/react-toast

# Créer les composants manquants
# Suivre les structures ci-dessus

# Build et test
npm run build
npm run dev
```

---

## Next Steps (Priority)

1. **Créer tous les composants UI listés ci-dessus**
2. **Implémenter les pages restantes** (Sources, Analytics, Settings)
3. **Connecter aux APIs backend existantes**
4. **Ajouter Framer Motion** aux transitions de page
5. **Tester responsive** sur mobile/tablet
6. **Accessibility audit** (keyboard nav, ARIA labels)
7. **Performance audit** (Lighthouse, Core Web Vitals)

---

## Design Tokens Summary

### Colors (Dark Mode)
- Background: `#0B0C0F`
- Card: `#111318`
- Primary (Accent): `#7C5CFF`
- Muted text: `#71717A`

### Spacing Scale
- 4, 8, 12, 16, 24, 32, 48, 64px

### Border Radius
- sm: 0.5rem
- md: 0.625rem
- lg: 0.75rem
- xl: 0.875rem

### Shadows
- Soft: `0 2px 8px rgba(0,0,0,0.1)`
- Elevated: `0 4px 16px rgba(0,0,0,0.15)`
- Float: `0 8px 32px rgba(0,0,0,0.2)`

---

## Quality Checklist

- [x] Tailwind config avec design tokens premium
- [x] Dark mode HSL system
- [x] Utils (cn, date formatting)
- [x] Button component Vercel-style
- [ ] Card, Input, Badge, Skeleton components
- [ ] Sidebar avec active indicators
- [ ] Header avec search et theme toggle
- [ ] FeedItem avec Framer Motion
- [ ] Empty states
- [ ] Responsive layouts
- [ ] Accessibility (ARIA, keyboard nav)
- [ ] Animations fluides (pas de saccades)
- [ ] Light mode quality check
- [ ] Build sans warnings

---

**Status**: Foundation complète, 40% des composants créés. 
**Next**: Finaliser composants UI core + layout + pages.
