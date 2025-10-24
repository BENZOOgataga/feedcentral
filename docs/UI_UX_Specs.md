# Spécifications UI / UX d’interaction - FeedCentral (Vercel-like)

## Vision

FeedCentral doit offrir une expérience **aussi fluide et maîtrisée que le dashboard de Vercel** : transitions naturelles, réactions instantanées, focus states précis. Le ressenti global doit être celui d’un **produit fiable, clair et stable**, jamais chargé.

---

## Thème & direction visuelle

* **Style principal** : sobre, lumineux, minimaliste, dark-first.
* **Palette** : gris neutres, accents violet froid (#7C5CFF), pas de glass excessif.
* **Typographie** : Inter ou Geist (sobre, géométrique, lisible).
* **Espacement** : généreux et constant (8/12/16/24/32px).
* **Lignes et bords** : radius doux (8–12px), bordures semi-transparentes (rgba(255,255,255,0.08)).
* **Animations** : `ease-out cubic-bezier(0.16, 1, 0.3, 1)` pour tous les mouvements.

---

## Structure & navigation

### 1. Landing page

* Mise en avant du concept : "L’actualité, centralisée et vérifiée."
* Hero minimaliste avec fond dégradé, logo, bouton "Accéder au dashboard".
* Section de présentation (screenshots, liste des sources, valeurs du projet).
* CTA clair : connexion / accès rapide.

### 2. App shell (après connexion)

* **Topbar** : fixe, minimaliste, hauteur 64px.

  * Logo compact à gauche.
  * Barre de recherche centrale avec `Cmd+K` activable.
  * Icônes à droite : notifications, thème, profil.
  * Animation d’apparition : fade-down + blur léger.

* **Navigation latérale** (si active) :

  * Compacte (64–72px).
  * Icônes Lucide uniquement (nom visible au hover ou expansion).
  * Indicateur animé de section active (barre verticale violette, spring motion).

* **Onglets supérieurs** (catégories) :

  * Présents dans le header secondaire.
  * Scroll horizontal fluide sur mobile.
  * Interaction par `Framer Motion layoutId` pour effet d’indicateur animé.

### 3. Dashboard (All Feeds)

* **Layout** : grille verticale fluide.

* **FeedCard** :

  * Fond légèrement contrasté, radius 10px, padding 16px.
  * Hover : lift (translate-y[-2px]), shadow doux, curseur pointer.
  * Titre : 15–16px, poids 500, texte ellipsé.
  * Métadonnées (source, date, catégorie) : taille 12px, couleur secondaire.
  * Image preview facultative (ratio 16:9, bord arrondi).
  * Animation d’entrée : stagger fade-in-up, delay 0.03s.

* **EmptyState** : icône neutre, texte court, CTA ("Rafraîchir les flux").

### 4. Article page (lecteur interne)

* **Layout** : header (titre + meta) + contenu texte + footer (lien source).
* **Effet entrée** : fade + slide from right (0.25s, ease-out).
* **Contenu** : texte lisible, largeur max 680px, line-height 1.6.
* **Lien externe** : bouton secondaire ("Lire sur la source"), hover glow.

### 5. Recherche instantanée

* **Cmd+K Palette** : overlay semi-transparent, blur fort.
* **Animation** : scale-in (0.95 -> 1.0, opacity 0 -> 1).
* **Résultats** :

  * Liste dynamique (scrollable, max-height 70vh).
  * Highlight du terme recherché.
  * Navigation clavier (↑↓ Entrée).
* **Barre topnav** :

  * Input inline avec animation de focus (ring accent, bg foncé).
  * Placeholder : “Rechercher dans les 30 sources...”

### 6. Admin panel

* Layout sobre : sidebar + topbar.
* Tableaux avec pagination, switch actifs/inactifs.
* Actions (add/edit/delete) via modals glissantes (`Dialog + Framer Motion`).
* Feedback instantané (toast en bas à droite, 3s, fade-out).

---

## Interactions principales

* **Hover global** : accent léger (bg +1 ton, shadow subtile).
* **Focus visible** : anneau 2px `ring-accent/30`.
* **Transitions universelles** : 150–250ms max.
* **Animations de présence** : `AnimatePresence` pour modals, menus, toasts.
* **Prefers-reduced-motion** : désactive les transitions non critiques.

---

## Responsivité

* Mobile : nav horizontale, topbar fixe, sidebar masquée.
* Tablette : sidebar rétractable.
* Desktop : layout complet.
* Largeur max: 1280px, centrée.

---

## Accessibilité

* Navigation clavier intégrale.
* Contrastes AA/AAA pour le texte.
* Feedback visuel clair (loading, erreur, succès).
* Aria-labels sur tous les boutons/icônes.

---

## Micro-interactions clés (Vercel-like)

| Élément      | Interaction | Effet                                     |
| ------------ | ----------- | ----------------------------------------- |
| Bouton       | Hover       | Légère élévation, ombre douce, scale 1.02 |
| Bouton       | Active      | Scale 0.98, shadow réduite                |
| Input        | Focus       | Glow interne, ring accent discret         |
| Card         | Hover       | Déplacement vertical -2px + shadow accent |
| Sidebar item | Hover       | Accent bar animé à gauche                 |
| Cmd+K        | Open        | Scale 0.95 -> 1.0 + blur backdrop         |
| Toast        | Apparition  | Fade + slide-up, 0.25s                    |
| Modal        | Fermeture   | Fade + slide-down                         |

---

## Règle d’or

Chaque interaction doit être **prévisible, fluide et subtile**.
Aucune animation gratuite, aucun délai perceptible.
FeedCentral doit donner l’impression d’un **produit fini, stable et professionnel**, au même niveau de qualité qu’une interface Vercel.
