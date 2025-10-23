# Plan d’architecture front - FeedCentral (Vercel-like rebuild)

## Stack

* Framework: Next.js 14 (App Router)
* Langage: TypeScript
* UI: Tailwind CSS + shadcn/ui
* Animations: Framer Motion
* Thème: next-themes (dark first)
* Icônes: Lucide-react
* Analytics: @vercel/analytics + @vercel/speed-insights

---

## Arborescence générale

```
feedcentral/
├─ app/
│  ├─ layout.tsx                 # Shell global (topnav + context)
│  ├─ globals.css                # Styles globaux + design tokens
│  ├─ (landing)/page.tsx         # Page d’accueil marketing
│  ├─ (app)/layout.tsx           # Shell app interne (nav + onglets)
│  ├─ (app)/page.tsx             # Dashboard principal (All Feeds)
│  ├─ (app)/[category]/page.tsx  # Onglets filtrables par catégorie
│  ├─ article/[id]/page.tsx      # Lecteur interne d’article
│  ├─ admin/
│  │  ├─ layout.tsx              # Panel admin protégé
│  │  ├─ sources/page.tsx        # Gestion des flux RSS
│  │  ├─ jobs/page.tsx           # Tâches RSS cron + logs
│  │  └─ users/page.tsx          # Gestion utilisateurs
│  └─ api/                       # Routes REST Next.js (server actions)
│     ├─ articles/route.ts
│     ├─ stats/route.ts
│     ├─ search/route.ts
│     ├─ sources/route.ts
│     ├─ auth/login/route.ts
│     ├─ auth/logout/route.ts
│     └─ auth/change-password/route.ts
├─ components/
│  ├─ layout/
│  │  ├─ TopNav.tsx
│  │  ├─ SideNav.tsx
│  │  └─ AppTabs.tsx
│  ├─ feed/
│  │  ├─ FeedList.tsx
│  │  ├─ FeedCard.tsx
│  │  ├─ FeedSkeleton.tsx
│  │  └─ EmptyState.tsx
│  ├─ reader/
│  │  ├─ ArticleHeader.tsx
│  │  ├─ ArticleContent.tsx
│  │  └─ MetaBar.tsx
│  ├─ ui/
│  │  ├─ Button.tsx
│  │  ├─ Input.tsx
│  │  ├─ Badge.tsx
│  │  ├─ Sheet.tsx
│  │  ├─ Tooltip.tsx
│  │  └─ Dialog.tsx
│  ├─ search/CommandSearch.tsx   # Recherche instantanée type Cmd+K
│  ├─ theme/ThemeProvider.tsx
│  ├─ theme/ThemeToggle.tsx
│  ├─ analytics/VercelAnalytics.tsx
│  └─ analytics/SpeedInsights.tsx
├─ lib/
│  ├─ fetcher.ts
│  ├─ format.ts
│  ├─ auth.ts
│  ├─ permissions.ts
│  └─ search.ts                  # hooks de recherche instantanée
├─ styles/
│  ├─ tokens.css                 # Variables CSS (couleurs, radius, spacing)
│  └─ tailwind.config.ts         # Config du design system
└─ types/
   └─ index.ts                   # Interfaces TS (Article, Source, User, etc.)
```

---

## Principes

* **Structure modulaire**, indépendante de la logique backend.
* **Rendu hybride** : SSR pour feed principal, ISR pour landing.
* **Shell app-like** : navigation fluide, transitions Framer Motion.
* **Dashboard** : systeme d’onglets filtrables (catégories), recherche instantanée.
* **Lecteur interne** : page minimaliste avec lien vers la source originale.
* **Admin** : gestion complète des flux et jobs RSS (accès restreint JWT).

---

## Performances & accessibilité

* Partial prerendering + route segments.
* `prefers-reduced-motion` supporté.
* Focus visible et navigation clavier complète.
* Virtualisation de liste si >200 articles.

---

## À garder en tête

* Code base **ouverte à l’évolution** : ajout futur de mode lecteur, favoris, multi-utilisateurs.
* Séparation nette UI / logique métier.
* Qualité Vercel : transitions, lisibilité, structure, réactivité.
