# Structure du projet Angular

Arborescence du dossier `src/app`, organisée en quatre grandes catégories : `core`, `features`, `layout` et `shared`.

```
app/
├── core/
│   └── interceptors/
├── features/
│   ├── auth/
│   │   ├── auth-overlay/
│   │   ├── auth-page/
│   │   ├── login-form/
│   │   └── signup-form/
│   ├── documents/
│   │   ├── document-detail/
│   │   │   ├── document-detail-panel/
│   │   │   ├── document-info-card/
│   │   │   └── document-metadata-section/
│   │   ├── document-filters/
│   │   │   ├── date-range-filter/
│   │   │   └── tags-filter-dropdown/
│   │   ├── document-list/
│   │   ├── document-table/
│   │   └── document-toolbar/
│   ├── editor/
│   │   └── document-editor-page/
│   ├── search/
│   │   ├── advanced-search-panel/
│   │   └── search-dropdown/
│   ├── upload/
│   │   └── ingest-panel/
│   └── validation/
│       ├── classification-select/
│       ├── confidence-badge/
│       ├── import-detail-panel/
│       ├── import-preview-card/
│       ├── import-queue-list/
│       ├── metadata-form/
│       ├── path-selector/
│       ├── tags-editor/
│       ├── title-field/
│       ├── validation-footer/
│       └── validation-view/
├── layout/
│   ├── shell/
│   ├── sidebar/
│   │   └── tree-node/
│   └── topbar/
│       ├── user-menu/
│       └── view-toggle/
├── shared/
│   ├── breadcrumb/
│   └── dropdown-backdrop/
└── environments/
```

## Conventions de rangement

- **`core/`** : logique transversale et technique, sans UI — intercepteurs HTTP, guards, services singleton globaux.
- **`features/`** : un sous-dossier par domaine fonctionnel (`auth`, `documents`, `editor`, `search`, `upload`, `validation`). Chaque feature regroupe ses propres composants, y compris ses sous-composants imbriqués dans des dossiers dédiés (ex. `document-detail/document-info-card/`).
- **`layout/`** : structure visuelle globale de l'application (`shell`, `sidebar`, `topbar`) et leurs sous-composants propres.
- **`shared/`** : composants réutilisables entre plusieurs features, sans logique métier propre (ex. `breadcrumb`, `dropdown-backdrop`).
- **`environments/`** : fichiers de configuration par environnement (dev, prod).

## Règle de nommage

Chaque composant vit dans son propre dossier, nommé en kebab-case, reflétant le nom du composant (ex. `document-detail-panel/` pour `DocumentDetailPanelComponent`). Un composant qui n'est utilisé que par un composant parent est imbriqué directement sous le dossier de ce parent plutôt que placé au même niveau.