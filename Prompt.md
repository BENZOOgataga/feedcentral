# Prompt IA - Refonte complète de FeedCentral (Vercel-like, App Router)

## 📎 Références

Ce prompt se base intégralement sur les deux documents précédents :

* **FeedCentral - Plan d’architecture front** (structure des dossiers, logique d’app, modules et conventions)
* **FeedCentral - Spécifications UI/UX d’interaction** (animations, comportements, transitions, interactions, accessibilité)

L’IA doit les considérer comme des **documents contractuels** : tout le développement et la conception doivent s’y conformer. Aucune interprétation libre ne doit altérer les décisions déjà prises.

---

## 🎯 Objectif

Refaire entièrement le frontend de **FeedCentral**, un agrégateur RSS professionnel. Le but est d’atteindre la **qualité visuelle, structurelle et interactive du site de Vercel**.
Aucune dette technique à garder : **repartir de zéro**.

FeedCentral doit incarner un **outil de vérité** — une interface stable, fiable et claire, qui centralise les actualités avec précision et élégance.

---

## 🧱 Stack & principes

* **Next.js 14 (App Router, React 18)**
* **TypeScript**
* **Tailwind CSS + shadcn/ui**
* **Framer Motion** (micro-interactions, transitions)
* **Lucide-react** (icônes légères)
* **next-themes** (dark-first, light toggle)
* **@vercel/analytics** + **@vercel/speed-insights**

Code modulaire, clair, lisible. Architecture basée sur le plan d’architecture front et les spécifications d’interaction fournies.

---

## 🧩 Objectifs fonctionnels

* **Landing page** claire et rapide, avec message de marque et CTA.
* **Dashboard** dynamique : liste d’articles, filtres par catégorie, recherche plein texte instantanée.
* **Page article** interne (lecteur minimaliste) avec redirection vers la source.
* **Admin panel** pour gérer les sources RSS et jobs CRON.
* **Auth JWT** et structure multi-utilisateurs prête.
* **Thème dark-first** avec compatibilité light.

---

## 💡 Style et direction visuelle

* **Référence principale** : design et interactions du dashboard Vercel.
* **Tonalité** : sobre, professionnelle, moderne.
* **Couleurs** : gris profonds, accents violet froid (#7C5CFF), contrastes doux.
* **Typo** : Inter ou Geist, 400/500/600.
* **Marge et rythme** : 8–12–16–24–32px.
* **Bordures** : `rgba(255,255,255,0.08)`.
* **Ombres** : subtiles, diffusées (`rgba(0,0,0,0.25)`).
* **Pas de glassmorphism global**, uniquement si utile.

---

## ⚙️ Layouts & pages

### Landing page `/`

* Hero minimaliste : logo, phrase clé, bouton CTA.
* Section “Sources vérifiées” avec logos.
* Section “Pourquoi FeedCentral”.
* CTA vers /app.

### App shell `(app)/`

* Topbar (64px) : logo, barre de recherche, thème, profil.
* Sidebar compacte (64–72px) : icônes Lucide, hover expand.
* Onglets horizontaux (catégories) : animés (Framer Motion layoutId).
* Command palette (`Cmd+K`) : recherche instantanée (overlay + blur).

### Dashboard `/app` et `/app/[category]`

* Liste d’articles animée (fade-in-up stagger).
* FeedCard : hover lift, titre, meta, image preview.
* EmptyState : CTA refresh.
* Pagination/infinite scroll.

### Article page `/article/[id]`

* Transition slide-from-right.
* Header : titre, source, date.
* Contenu : lisible, max 680px.
* Bouton “Lire sur la source”.

### Admin panel `/admin`

* Sidebar + topbar sobres.
* Tables (sources, jobs, users) avec actions modales.
* Feedback instantané (toasts, status badge).

---

## 🎞 Interactions clés (Vercel-like)

| Élément | Interaction | Effet                                 |
| ------- | ----------- | ------------------------------------- |
| Bouton  | Hover       | Lift, shadow douce, scale 1.02        |
| Bouton  | Active      | Scale 0.98, shadow réduite            |
| Input   | Focus       | Glow interne, ring accent             |
| Card    | Hover       | Déplacement -2px + shadow accent      |
| Sidebar | Active      | Bar latérale violette animée (spring) |
| Cmd+K   | Open        | Scale 0.95 → 1.0 + blur backdrop      |
| Toast   | Apparition  | Fade + slide-up 0.25s                 |
| Modal   | Fermeture   | Fade + slide-down                     |

---

## 🪶 Accessibilité & performance

* ARIA complet, focus visible, navigation clavier.
* Support `prefers-reduced-motion`.
* Contrastes AA/AAA.
* Optimisation : images Next, virtualisation liste, partial prerendering.

---

## 🧠 Guidelines de code

* Séparation stricte UI / logique métier.
* Composants atomiques, lisibles, réutilisables.
* Aucune duplication visuelle : centraliser via `ui/` et `layout/`.
* Respect naming convention claire (`FeedCard`, `ArticleHeader`, `CommandSearch`).
* ESLint + Prettier strict.

---

## 📦 Deliverables IA

1. Arborescence complète respectant le plan d’architecture front.
2. Fichiers Next.js fonctionnels, compilables sans erreurs.
3. Tailwind config adaptée (palette, radius, shadows).
4. Composants clés :

   * `TopNav.tsx`, `SideNav.tsx`, `AppTabs.tsx`
   * `FeedCard.tsx`, `CommandSearch.tsx`, `ThemeToggle.tsx`
   * `AdminTable.tsx`, `Dialog.tsx`, `Toast.tsx`
5. Animations `Framer Motion` conformes au style Vercel.

---

## 🔓 Liberté créative

Tu es libre d’ajuster les proportions, le comportement des onglets et les transitions tant que le **niveau de qualité global reste équivalent à Vercel**.
Priorité absolue : stabilité, élégance, fluidité.
Pas de templates réutilisés — **crée un produit fini, propre et crédible.**
