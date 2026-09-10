# Documentation du Layout - Application DMS

Le layout de l'application est conçu pour offrir une expérience de navigation fluide et efficace, typique des outils de gestion documentaire professionnels. Il est centralisé dans le composant `ShellComponent`.

## 🏗 Structure Globale (`ShellComponent`)

Le layout utilise une disposition flexible (`flex-col`) occupant toute la hauteur de l'écran (`h-screen`).

### 1. Topbar (`app-topbar`)
Située en haut de l'écran, elle contient les éléments de navigation globale et d'accès rapide :
- **Branding** : Logo et titre de l'application ("DocuFlow ENTERPRISE DMS").
- **Recherche** : Intégration de `SearchDropdownComponent` et `AdvancedSearchPanelComponent` pour un accès rapide aux documents.
- **Contrôles de vue** : `ViewToggleComponent` permettant de basculer entre la vue "Documents" et la vue "Validation".
- **Utilisateur** : `UserMenuComponent` pour la gestion du profil et la déconnexion.

### 2. Zone de Contenu Dynamique
Le contenu central s'adapte en fonction de l'état de la vue (`viewState.currentView()`) :

#### A. Vue "Documents" (Layout Tripartite)
Cette vue est organisée en trois colonnes principales :

- **Colonne Gauche (Explorateur)** :
    - **IngestPanel** : Accès rapide aux fonctions d'importation.
    - **Sidebar (`app-sidebar`)** : Explorateur hiérarchique des documents.
        - Gère l'arborescence via `HierarchyStateService`.
        - Comprend des composants `TreeNode` pour naviguer dans les dossiers.
        - Affiche des statistiques (nombre de documents, taille totale) et la version de l'application.

- **Colonne Centrale (Contenu Principal)** :
    - Utilise un `<router-outlet />` pour charger les composants de fonctionnalités (ex: `DocumentListComponent`). C'est ici que s'affiche la liste des fichiers ou les vues de navigation.

- **Colonne Droite (Détails)** :
    - **IngestPanel** : Répété pour l'accessibilité.
    - **DocumentDetailPanel** : Panneau contextuel qui s'affiche lorsqu'un document est sélectionné. Il fusionne les données de base du document avec ses métadonnées réelles via `mergeWithRealMetadata`.

#### B. Vue "Validation"
- Remplace toute la zone centrale par le composant `ValidationViewComponent`, dédié au workflow de validation des imports.

## ⚙️ Logique et État du Layout

### Gestion de la Vue
Le passage entre la vue "Documents" et "Validation" est géré par le `ViewStateService`, permettant une transition instantanée sans rechargement de page.

### Sélection de Document
Le layout réagit en temps réel à la sélection d'un document :
1. `DocumentStateService` détecte le changement de document sélectionné.
2. Le `ShellComponent` utilise un `computed` signal (`selectedDetail`) pour préparer les données détaillées.
3. Le panneau de détails à droite est automatiquement mis à jour.

## 🎨 Design & Style
- **Couleurs** : Utilisation d'une palette basée sur le bleu prussien (`bg-prussian-blue-50/30`).
- **Composants** : Fond blanc avec des bordures légères et des coins arrondis (`rounded-xl border-prussian-blue-100`) pour créer un effet de "cartes" modernes.
- **Responsive** : Utilisation de classes Tailwind (`shrink-0`, `flex-1`, `min-h-0`) pour garantir que les panneaux défilent indépendamment sans casser la structure globale.
