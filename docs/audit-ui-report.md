# Audit UI/UX : traces « vibe coded » dans le frontend E-Lamina

Audit réalisé le 2026-10-13 sur `frontend/DMS/src` (Angular 19, PrimeNG 19 Aura, Tailwind 4), à comparer avec la maquette v0 d'origine (`frontend/Maquette/Maquette 1.png`, « DocuFlow »).

**Méthode.** Lecture des templates, des classes et de la maquette, puis parcours de l'application en local (front :4200, compte de test `arakoto`, ADMIN) avec Brave piloté par Playwright, sur un profil temporaire et en lecture seule (aucune publication ni suppression). Les 21 captures sont dans [`audit-captures/`](audit-captures/), aux largeurs 1440, 1024 et 768 px. Les constats vus à l'écran sont regroupés en § 2 bis.

Limites : OnlyOffice n'était pas joignable dans cet environnement, donc l'éditeur n'a pas pu être audité (capture 19). Aucun document de la file ne portait de tag suggéré, donc les trois états des tags n'ont pas pu être vus à l'écran (G4 vient du code). Le volume de 5 000 documents a été évalué à la lecture du code, pas testé.

Aucun fichier de code n'a été modifié.

---

## 1. Synthèse

L'impression « généré par IA » est **modérée** et tient surtout à l'**habillage**. Le fond est plutôt travaillé : le flux de publication enchaîne les documents au clavier, garde la saisie en cours et explique pourquoi on ne peut pas publier ; la microcopie est en français, précise et écrite du point de vue de l'utilisateur ; il n'y a ni mock, ni lorem ipsum, ni emoji, ni carte KPI. En revanche, l'enveloppe visuelle reste celle de la maquette v0 : bleu azur saturé, libellés en MAJUSCULES espacées au-dessus de chaque bloc, icône dans un carré coloré, flou sur toute la page à l'ouverture de chaque menu, gris clair partout.

Les trois problèmes les plus visibles :

1. **Le « prussian-blue » n'est pas du bleu de Prusse.** L'échelle `--color-prussian-blue-*` (et le preset PrimeNG qui la recopie) est centrée sur `#0a7ff5`, un azur vif très proche du `blue-500` de Tailwind et du primaire par défaut d'Aura. Le vrai bleu de Prusse est autour de `#003153`. S'ajoutent quatre autres échelles bleues presque identiques et jamais utilisées : c'est l'export brut d'un générateur de palettes. C'est le signal le plus fort de toute l'application.
2. **Le tableau de documents a perdu les colonnes d'une GED.** Il n'affiche que *Nom*, *Tags* et *Actions* : ni format lisible, ni date, ni taille, ni statut, et aucun tri. La maquette v0 avait pourtant *Modified* et *Size*. En plus, un dossier ne charge que ses 100 premiers documents (`PAGE_SIZE = 100`), et rien ne signale qu'il en manque.
3. **L'accessibilité et la largeur tablette ne tiennent pas.** Vu à l'écran : aucun focus visible au clavier, et à 1024 px les titres du tableau tombent à 3 lettres (§ 2 bis). Il n'y a **aucun** attribut `aria-*` dans le projet. Les éléments cliquables sont souvent des `<i>`, `<span>`, `<div>` ou `<li>`, ce qui les rend inaccessibles au clavier : les actions de l'arbre, l'acceptation et le refus des tags, le menu utilisateur, la zone d'import, le fil d'Ariane. Les actions n'apparaissent qu'au survol, donc jamais sur tablette. `text-gray-400` (contraste 2,5:1) revient 64 fois. Aucune règle `prefers-reduced-motion`, et aucun point de rupture responsive (0 classe `sm:`/`md:`/`lg:`).

---

## 2. Tableau des constats

Gravité : **B** bloquant, **I** important, **C** cosmétique. Effort : S (< 1 h), M (une demi-journée à une journée), L (plus d'une journée).
Catégorie = section de la grille (1 Visuel, 2 Structure, 3 Animations, 4 Microcopie, 5 UX, 6 PrimeNG, 7 GED, 8 Code).

### Visuel et identité

| # | Fichier / écran | Signal observé | Cat. | Grav. | Effort |
|---|---|---|---|---|---|
| V1 | `styles.css:18-28`, `app.config.ts:14-30` | « prussian-blue » = azur `#0a7ff5` (≈ `blue-500` Tailwind / primaire Aura). Le preset ne change que `primary`, avec ces mêmes valeurs | 1, 6 | I | M |
| V2 | `styles.css:30-74` | 4 échelles bleues presque identiques (`regal-navy`, `brilliant-azure`, `cool-horizon`, `sky-blue`), **0 utilisation** | 1 | C | S |
| V3 | `styles.css:76-110` | 3 échelles orange quasi identiques (`almond-silk`, `burnt-peach`, `rusty-spice`) utilisées 1 à 5 fois chacune, au hasard (astérisque, bandeau, bouton de connexion) | 1 | C | S |
| V4 | tout `app/` | Pas de teal / ambre / corail dans le `@theme` : la vue de validation utilise directement `emerald-*`, `amber-*`, `orange-*`, `red-*` de Tailwind (≈ 90 occurrences), avec des sens variables (orange = sélection dans la file, retiré, badge du compteur) | 1, 6 | I | M |
| V5 | `styles.css:151-166` | Couleurs des toasts en hexadécimal en dur (`#fef2f2`, `#ef4444`, `#fffbeb`…) | 1 | C | S |
| V6 | `auth-overlay.component.html:1-2` | Dégradé décoratif `bg-linear-135` et icône dans un carré `bg-white/10`, typique d'un écran de login v0 | 1 | C | S |
| V7 | `dropdown-backdrop.component.html:3-5`, `folder-editor-dialog.component.html:8`, `styles.css:167-172` | Glassmorphism : `bg-white/10 backdrop-blur-[3px]` sur **toute la page** à l'ouverture de chaque menu (utilisateur, tags, recherche avancée), alors que le fond est déjà blanc. Coûteux et sans rôle | 1, 3 | I | S |
| V8 | `topbar.component.html:5-6`, `ingest-panel.component.html:25-31`, `validation-view.component.html:111` | Icônes posées dans un carré / cercle coloré au même gabarit (repris tel quel de la maquette) | 1 | C | S |
| V9 | 13 fichiers (sidebar, détails, filtres, file, tags, dialog, login) | Libellés en MAJUSCULES espacées au-dessus de chaque section (`EXPLORATEUR`, `DÉTAILS DU DOCUMENT`, `MÉTADONNÉES SYSTÈME`, `TAGS SUGGÉRÉS`, `ACCÈS SÉCURISÉ À L'ESPACE DE TRAVAIL`…) | 1 | I | S |
| V10 | tout `app/` | Pas d'échelle typographique : 80 × `text-2xs` (11 px), plus `text-[9px]` (`document-history-section.component.html:18`). Les tailles sont choisies au cas par cas, et l'UI reste globalement très petite | 1 | I | M |
| V11 | tout `app/` | `text-gray-400` (64 ×) pour du texte porteur de sens (compteurs, dates, états vides, icônes) : contraste 2,5:1, sous le seuil AA | 1, 5 | I | S |
| V12 | `login-form.component.html:39` vs reste de l'app | Le bouton principal de connexion est orange (`rusty-spice-500`), toutes les autres actions principales sont en `prussian-blue-700` | 1 | C | S |
| V13 | `search-dropdown.component.html:4,16,19,26` | Gris `slate-*` mélangés au `prussian-blue` ; classe `border-purssian-blue-300` (faute de frappe, sans effet) | 1, 6 | C | S |

### Structure et mise en page

| # | Fichier / écran | Signal observé | Cat. | Grav. | Effort |
|---|---|---|---|---|---|
| S1 | `shell.component.html:14-30`, `validation-view.component.html:3` | Trois panneaux en `rounded-xl border` identiques, séparés par 4 px (`gap-1`) : effet « cartes posées » plutôt que des volets d'outil. Largeurs fixes (`w-65`, `w-70`, `w-96`) | 2 | C | M |
| S2 | `document-table.component.ts:12-14, 61-70` | Lignes de 48 px (`h-12`) et nombre de lignes calculé pour ne jamais faire défiler : à 900 px de haut, environ 12 documents visibles. Densité faible pour une GED | 2, 5 | I | S |
| S3 | `auth-page.component.html:2` | `grid-cols-2` sans point de rupture : sur tablette portrait ou mobile, le formulaire est écrasé à côté du panneau décoratif | 2, 5 | I | S |
| S4 | tout `app/` | 0 classe responsive. L'explorateur fait 260 + 280 px de panneaux fixes : à 1024 px, il reste environ 470 px pour le tableau, et rien ne se replie | 5 | I | M |

### Animations et micro-interactions

| # | Fichier / écran | Signal observé | Cat. | Grav. | Effort |
|---|---|---|---|---|---|
| A1 | 6 menus (`user-menu`, `tags-filter`, `date-range`, `advanced-search`, `search-dropdown`, panneau des tags) | Même animation `transition-all duration-150 scale-95 → scale-100` partout. C'est acceptable, mais `transition-all` anime aussi les positions | 3 | C | S |
| A2 | tout `src/` | Aucune règle `prefers-reduced-motion` (ni `motion-reduce:`). `scroll-smooth` sur les panneaux | 3, 5 | I | S |
| A3 | `document-list.component.html:31-35`, `import-queue-list.component.html:32-34`, `validation-view.component.html:94-97`, `folder-editor-dialog.component.html:27-28` | « Chargement... » en texte gris centré, sans skeleton à la forme de la ligne ou du panneau. L'arbre n'a **aucun** état de chargement (`isLoadingTree` jamais lu dans le template) | 3, 5 | I | M |
| A4 | `login-form.component.ts:34` | Toast « Connexion réussie. » alors que l'écran change déjà | 3, 6 | C | S |
| A5 | `document-detail-panel.component.ts:43`, `sidebar.component.ts:122-124` | Toasts pour des résultats déjà visibles (titre copié, dossier créé puis sélectionné, dossier modifié) | 3, 6 | C | S |
| A6 | `error.interceptor.ts:19-22` + composants | Sur un 403, l'intercepteur affiche « Action non autorisée. » **et** le composant affiche son propre toast d'erreur : deux toasts pour une seule action | 5, 6 | I | S |

### Microcopie

| # | Fichier / écran | Signal observé | Cat. | Grav. | Effort |
|---|---|---|---|---|---|
| M1 | `ingest-panel.component.html:40-41` vs `:20` | Le texte annonce « PDF, DOCX, XLSX, PNG, EML » alors que `accept` autorise aussi TIFF, JPEG, PPT, PPTX. Aucune taille maximale annoncée (nginx : 250 Mo) | 4 | I | S |
| M2 | `search-dropdown.component.html:15` | Placeholder écrit du point de vue du système : « Rechercher documents, métadonnées, OCR... » | 4 | C | S |
| M3 | `tags-editor.component.html:49` | Bouton générique « Ajouter » (→ « Ajouter un tag ») | 4 | C | S |
| M4 | `tags-filter-dropdown.component.html:34` | « Annuler » pour vider les filtres (→ « Tout effacer ») | 4 | C | S |
| M5 | `login-form.component.ts:39` | « Identifiants incorrects ou serveur inaccessible. » : deux causes différentes dans un même message (401 ou panne réseau) | 4, 5 | I | S |
| M6 | `document-list.component.html:37-39`, `sidebar.component.html:15-16`, `document-editor-page.component.ts:40` | « Impossible de charger… » sans rien proposer (pas de bouton « Réessayer ») | 4, 5 | I | S |
| M7 | `document-table.component.html:20-21` | En-tête « Nom Fichier » (majuscule inutile ; affiche en fait le titre) | 4 | C | S |
| M8 | `topbar.component.html:10` | Sous-titre « Alamino milamina » : à confirmer (signature voulue ou reste de la maquette « ENTERPRISE DMS ») | 4 | C | S |
| M9 | `document-editor-page.component.html:9` | « Retour à E-Lamina » sans le titre du document ouvert | 4, 7 | C | S |

### UX et comportement

| # | Fichier / écran | Signal observé | Cat. | Grav. | Effort |
|---|---|---|---|---|---|
| U1 | `smart-folder-state.service.ts:13, 197` | Un dossier ne charge que la page 0 de 100 documents ; le `total` renvoyé par le backend est ignoré. Au-delà de 100, des documents disparaissent sans aucun message. Le filtre par tags ne porte que sur ces 100 | 5, 7 | **B** | M |
| U2 | `document-table.component.html:2-16` | `p-table` en pagination côté client, sans tri (`pSortableColumn` absent) ni lazy loading. `/published` et la recherche renvoient tout d'un coup | 5, 6 | I | M |
| U3 | `document-table.component.html:134-147` | État vide « Aucun document à afficher » sans action (importer, revenir au dossier parent) | 5 | I | S |
| U4 | `search-dropdown.component.ts:65-70` | Une erreur réseau de la recherche s'affiche « Aucun résultat » : l'utilisateur croit que le document n'existe pas | 5 | I | S |
| U5 | `advanced-search-panel.component.ts:82-85` | Erreur de la recherche avancée : seulement un `console.error`, le panneau reste ouvert sans message | 5 | I | S |
| U6 | `advanced-search-panel.component.html:78-79` | `display-none` n'est pas une classe Tailwind, donc la case « Tolère les fautes de frappe » s'affiche ; `[defaultValue]="true"` est contredit par `fuzzy = signal(false)` | 5, 8 | I | S |
| U7 | `advanced-search-panel.component.html:37-56` | « Format » et « Langue » en texte libre (l'utilisateur doit deviner `pdf` / `PDF` / `application/pdf`, `fr` / `fra`) | 5 | I | S |
| U8 | `breadcrumb.component.html:3-9` | Segments en `<span>` cliquables, y compris le dernier et ceux de la recherche (curseur main, mais aucun effet). Le dossier est retrouvé par son **nom** (`document-list.component.ts:75-80`), donc deux dossiers homonymes posent problème | 5, 7 | I | S |
| U9 | `search-dropdown` | Pas de navigation ↑/↓ dans les suggestions, pas de raccourci clavier pour la recherche. Pas de syntaxe `/` (command palette) dans le code | 5 | C | M |
| U10 | **Accessibilité** : `tree-node.component.html:1-48`, `tags-editor.component.html:25-38`, `user-menu.component.html:3`, `ingest-panel.component.html:1-15`, `import-queue-list.component.html:50-57`, `document-table.component.html:75` | `div` / `span` / `i` / `li` / `td` cliquables : pas de focus, pas de touche Entrée, pas de rôle. **0** `aria-*` dans le projet. Pas de `role="tree"` / `treeitem` / `aria-expanded` sur l'arbre | 5 | **B** | M |
| U11 | `tree-node.component.html:32`, `document-table.component.html:95` | Actions visibles uniquement au survol (`opacity-0 group-hover:opacity-100`) : invisibles sur tablette et au clavier dans l'arbre (le tableau a `focus-within`, l'arbre non) | 5 | I | S |
| U12 | 13 × `focus:outline-none` | Focus retiré sur des champs natifs, remplacé au mieux par un changement de bordure ; pas de style `focus-visible` global pour les boutons Tailwind | 5 | I | S |
| U13 | `ingest-panel.component.ts:56-81` | Import en lot sans progression ni liste des fichiers en cours ; la zone est simplement grisée | 5 | C | M |

### Signaux propres à PrimeNG

| # | Fichier / écran | Signal observé | Cat. | Grav. | Effort |
|---|---|---|---|---|---|
| P1 | `app.config.ts:14-30` | `definePreset` ne surcharge que `primary`. Les surfaces, `focusRing`, `borderRadius` et les couleurs de sévérité restent ceux d'Aura (le `p-tag severity="info"` reste bleu Aura) | 6 | I | M |
| P2 | 30+ classes `!…` sur des composants PrimeNG (`!bg-prussian-blue-700 !border-…` sur `p-button`, `!text-xs` sur `p-tag`, `styleClass` des dialogs) | Style forcé avec `!important` au lieu d'être porté par le preset. Même bouton principal redéfini 3 fois | 6 | I | M |
| P3 | `advanced-search-panel.component.html:30,44,54` | `pInputText` dans `p-floatlabel` avec `px-2.5 py-1.5 rounded-md border…` Tailwind : padding et bordure en conflit avec ceux du composant (le libellé flottant se décale) | 6 | C | S |
| P4 | `document-table.component.html:52-57` | Même icône `pi-lock` ambre pour « verrouillé » (`locked`) et « confidentiel » | 6, 7 | I | S |
| P5 | `document.mapper.ts:161-177` et `validation/file-type.util.ts:7-27` | Deux tables d'icônes de format en double. Aucune ne couvre PPT/PPTX, EML, TIFF, PNG ou JPG, pourtant acceptés à l'import ; libellé de repli « FICHIER » | 6, 7 | I | S |

### Signaux propres à une GED

| # | Fichier / écran | Signal observé | Cat. | Grav. | Effort |
|---|---|---|---|---|---|
| G1 | `document-table.component.html:19-29` | Liste sans colonnes **Format**, **Ajouté le**, **Taille**, **Statut**. Le format ne se devine qu'à la couleur de l'icône | 7 | **B** | M |
| G2 | `document.mapper.ts:225` | Dans « Mes imports », le statut (« À publier », « Échec de l'extraction ») est rendu comme un **tag** dans la colonne Tags, mélangé aux mots-clés | 7 | I | S |
| G3 | `import-preview-card.component.html:5-15` | La vue de validation n'a **pas d'aperçu** : une vignette factice de 32×40 px (bandeau, icône à 60 % d'opacité, trait de 1 px) et un bouton « Voir le document » qui quitte la vue | 7 | **B** | L |
| G4 | `tags-editor.component.html:9-39` | Tag suggéré en bleu primaire, accepté en vert, refusé en rouge barré : seule la couleur distingue « suggéré » de « accepté » (aucune forme, aucune icône d'état). Les ✓ / ✕ sont des `<i>` non focusables | 7, 5 | I | S |
| G5 | `import-queue-list.component.html:53-54, 65`, `view-toggle.component.html:30` | Orange = document sélectionné **et** « Retiré » **et** compteur « À publier » ; ailleurs, la sélection est en bleu (`prussian-blue-100`) | 7, 1 | I | S |
| G6 | `validation-footer.component.html:31-33` | « 12 restants » est affiché, mais pas la position (« 3 sur 12 ») | 7 | C | S |
| G7 | `search-dropdown`, `document-table` | La recherche ne dit pas **pourquoi** un résultat remonte (titre, contenu ou tag) : pas d'extrait ni de mise en évidence. Ça dépend du backend | 7 | I | L |
| G8 | `document-detail-panel.component.html:84-89` | Statut Public / Confidentiel bien visible, mais le statut de cycle de vie (publié, retiré…) n'apparaît que dans les métadonnées métier, et pas du tout dans le tableau | 7 | C | S |

### Code frontend

| # | Fichier / écran | Signal observé | Cat. | Grav. | Effort |
|---|---|---|---|---|---|
| C1 | 16 fichiers | 24 `console.error` laissés en production | 8 | C | S |
| C2 | `editor-config.service.ts:10-11`, `document-editor-page.component.ts:22,33`, `onlyoffice-script-loader.service.ts:6` | `any` pour la config OnlyOffice et l'instance ; `.toPromise()` déprécié | 8 | C | S |
| C3 | `document-filters/date-range-filter/*` | Composant complet jamais utilisé (son emplacement dans `document-filters.component.html:3` n'est plus qu'un commentaire) | 8 | C | S |
| C4 | `ingest-panel.component.ts:26,98`, `advanced-search-panel.component.ts:32-33`, `document.model.ts:112-126` + `:25`, `document.mapper.ts:223,227` | Code mort : `uploadFeedback` / `dismissFeedback`, `encrypted` / `signed` jamais exposés, couleurs de `TagFilterOption` inutilisées (point commenté), `modifiedDotColor`, `category: 'Document'` | 8 | C | S |
| C5 | `document-info-card.component.html:3-9`, `ingest-panel.component.html:45-63`, `user-menu.component.html:7-10` | Blocs commentés, restes de la maquette (« OCR enabled », « Classification », « Parcourrir ») | 8 | C | S |
| C6 | `document.model.ts:18`, `document.mapper.ts:220,282` | `format: 'PDF' \| 'XLSX' \| 'DOCX'` forcé par `as` alors que la valeur peut être `TXT`, `FICHIER`… | 8 | C | S |
| C7 | `ingest-panel.component.ts:11` | Sélecteur `IngestPanel` (PascalCase, sans préfixe `app-`) | 8 | C | S |
| C8 | `sidebar.component.ts:2,7`, `topbar.component.ts:2-4`, `title-field.component.ts:3,5`, `ingest-panel.component.ts:2` | Imports PrimeNG inutilisés | 8 | C | S |
| C9 | `app.component.spec.ts` | Test généré par la CLI qui attend un `<h1>Hello, DMS</h1>` et une propriété `title` inexistants : il échoue | 8 | C | S |

Sans objet ou conforme : aucun mock ni tableau de données en dur, aucun lorem ipsum, aucun `href="#"`, aucun emoji, pas de texte en dégradé ni de blob, pas de `hover:scale`, pas de carte KPI, aucune dépendance en double (une seule bibliothèque d'icônes, pas de bibliothèque de dates ni d'animations), aucun identifiant en français dans le code, aucun composant au-delà de 250 lignes, et les appels HTTP passent tous par un service.

### 2 bis. Constats vus à l'écran

Ces constats confirment ou aggravent les précédents. Deux gravités sont relevées : **S4** (responsive) et **U12** (focus) passent à **bloquant**.

| # | Capture | Observé | Lien | Grav. | Effort |
|---|---|---|---|---|---|
| E1 | `16-explorer-1024` | À 1024 px, la colonne du nom fait environ 60 px : les titres sont réduits à 3 lettres (« PD… », « rh-… »), alors que Tags (240 px) et Actions (128 px) gardent leur largeur. Le tableau devient inutilisable | S4, G1 | **B** | M |
| E2 | `17-explorer-768` | À 768 px, les en-têtes se chevauchent (« Nom / Tags / Fichier » superposés), les titres disparaissent, la pagination passe sur deux lignes et « À publier » se coupe dans la topbar | S4 | **B** | M |
| E3 | `01-login`, `18-login-768` | Le login garde ses deux colonnes à 768 px, et le titre se coupe en « E- / Lamina ». À 1440 px, le formulaire flotte dans une grande colonne blanche vide | S3, V6 | I | S |
| E4 | `07-keyboard-focus` | Après 6 Tab, **aucun** indicateur de focus visible nulle part : impossible de savoir où l'on est au clavier | U12 | **B** | S |
| E5 | `04`, `06-tree-hover` | Les noms de types sont tronqués dans l'arbre (« Bon de ca… », « Déclarati… », « Fa… », « Pal… »), sans infobulle. Au survol, les trois icônes d'action prennent encore de la place et le libellé tombe à 2 lettres | U11, S1 | I | S |
| E6 | `05-tags-popup`, `08`, `12` | Le flou couvre tout l'écran pour afficher 5 tags ou le petit panneau de recherche avancée. C'est l'effet le plus « démo » de l'application | V7 | I | S |
| E7 | `09-search-dropdown` | Le toast « Succès — Connexion réussie. » s'affiche bien, et il **déborde du bord droit** de l'écran (croix de fermeture coupée) | A4 | I | S |
| E8 | `10-search-results` | Trois résultats affichent exactement « Contrat de fourniture N° CTF-2026-012 » avec le même fichier d'origine : sans date, domaine ni statut dans le tableau, rien ne les distingue | G1 | I | (lot 3) |
| E9 | `11b-search-empty-table` | Résultat vide : pagination « 0–0 sur 0 » affichée avec ses flèches. Boutons de pagination ronds d'Aura, sans retouche | U3, P1 | C | S |
| E10 | `14-validation` | Sous le formulaire de validation, environ 60 % du panneau reste vide : la place existe pour l'aperçu (G3). La vignette « DOCX » déborde de son cadre de 32 px | G3 | I | (lot 4) |
| E11 | `14-validation`, `08-folder-dialog` | Les `p-floatlabel` ne se ressemblent pas : libellé petit sur la bordure pour un champ rempli, grand et gras dans le champ pour un champ vide (« Domaine \* »). Le champ désactivé est grisé plein. Les champs PrimeNG sont environ deux fois plus hauts que les textes `text-xs` qui les entourent | V10, P2 | I | M |
| E12 | `12-advanced-search` | La case « Tolère les fautes de frappe » est bien affichée (`display-none` sans effet). Les dates natives « jj/mm/aaaa » côtoient des champs `p-floatlabel` | U6, U7 | I | S |
| E13 | `04`, `14`, `20` | Unités de taille en anglais (« 11,1 KB », « 56 B ») : la chaîne vient du backend (`fileSize`) | 4 | C | S/back |
| E14 | `02`, `16` | Placeholder de recherche coupé dès 1440 px (« Rechercher documents, ») | M2 | C | S |
| E15 | `04` | « EXPLORATEUR » et « Nouveau dossier » collés aux bords du panneau (aucune marge horizontale), décalés par rapport à l'arbre et à la zone d'import ; la bordure pointillée de la zone touche le bord | V9, S1 | C | S |
| E16 | `14`, `20` | File « À publier » : dates sans année (« 09/10 11:45 »). Une grande partie de la file est faite de documents de test retirés : c'est une question de données, pas d'UI, mais ça fausse la démo | G5 | C | S |
| E17 | `19-editor` | Éditeur indisponible : « Impossible de charger l'éditeur de document. », sans cause (serveur OnlyOffice injoignable, droit refusé, document introuvable), sans bouton Réessayer ni lien de téléchargement | M6 | I | S |
| E18 | `04`, `10` | Des tags acceptés comme « count », « extended », « microsoft », « true » sont des restes d'extraction de métadonnées. L'UI de validation les propose et rien n'aide à les écarter en lot | G4 | C | M |

---

## 3. Propositions de correction (lots)

Lots classés par rapport impact / effort. Chacun compile et se teste seul. Les lots 1 et 3 demandent d'abord une décision (voir § 5).

### Lot 1 — Tokens de thème : vrai bleu de Prusse, couleurs d'état, preset complet (M)

**Change.** Une seule source de couleurs. Le `@theme` Tailwind définit la palette ; le preset PrimeNG pointe vers les mêmes variables CSS au lieu de recopier les hexadécimaux. Ajout de tokens sémantiques pour les états de la validation et du cycle de vie. Suppression des 4 échelles bleues inutilisées et de 2 des 3 oranges. Suppression du flou d'arrière-plan.

**Fichiers.** `styles.css`, `app.config.ts`, `dropdown-backdrop.component.html`, `folder-editor-dialog.component.html:8`, puis remplacement mécanique de `emerald-*` / `amber-*` / `orange-*` / `red-*` par les tokens (tags-editor, file, footer, bandeaux).

Avant (`styles.css`) :
```css
--color-prussian-blue-500: #0a7ff5;   /* azur, ≈ blue-500 */
--color-regal-navy-500: #167fe9;      /* inutilisé */
/* … 3 autres échelles bleues, 3 échelles orange */
```
Après (valeurs à valider, voir question 1) :
```css
@theme {
  /* Bleu de Prusse : #003153 au 800 */
  --color-prussian-blue-50:  #eef4f8;
  --color-prussian-blue-100: #d5e4ee;
  --color-prussian-blue-200: #aac7dc;
  --color-prussian-blue-300: #78a3c2;
  --color-prussian-blue-400: #4a7fa5;
  --color-prussian-blue-500: #2a6189;
  --color-prussian-blue-600: #1a4d72;
  --color-prussian-blue-700: #0f3d5e;
  --color-prussian-blue-800: #003153;
  --color-prussian-blue-900: #00243d;
  --color-prussian-blue-950: #001727;

  /* États (validation, cycle de vie) */
  --color-accepted: var(--color-teal-700);
  --color-accepted-soft: var(--color-teal-50);
  --color-pending: var(--color-amber-700);
  --color-pending-soft: var(--color-amber-50);
  --color-rejected: var(--color-burnt-peach-600);   /* corail */
  --color-rejected-soft: var(--color-burnt-peach-50);
}
```
Avant (`app.config.ts`) : 11 hexadécimaux recopiés dans `semantic.primary`.
Après :
```ts
const ELaminaPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: 'var(--color-prussian-blue-50)',
      // … idem jusqu'à 950
    },
    focusRing: { width: '2px', style: 'solid', color: '{primary.600}', offset: '2px' }
  }
});
```
Les toasts (`styles.css:151-166`) passent sur ces tokens. `dropdown-backdrop` garde son rôle (bloquer le clic) mais sans `backdrop-blur` ni voile.

### Lot 2 — Accessibilité et éléments interactifs (M)

**Change.** Tout élément cliquable devient un `<button type="button">` (ou un lien) avec un nom accessible. L'arbre reçoit les rôles ARIA de base. Les actions au survol deviennent aussi visibles au focus. Ajout d'un style `focus-visible` global et de la règle `prefers-reduced-motion`. Les textes porteurs de sens passent de `gray-400` à `gray-500` (4,8:1).

**Fichiers.** `tree-node.component.html`, `tags-editor.component.html`, `user-menu.component.html`, `ingest-panel.component.html`, `breadcrumb.component.html`, `import-queue-list.component.html`, `document-table.component.html`, `styles.css`, plus un remplacement ciblé de `text-gray-400`.

Avant (`tree-node.component.html:33-37`) :
```html
<i class="pi pi-plus text-2xs text-gray-400 hover:text-prussian-blue-700"
   title="Nouveau sous-dossier" (click)="onAction($event, 'create')"></i>
```
Après :
```html
<button type="button" class="tree-action" aria-label="Nouveau sous-dossier"
        pTooltip="Nouveau sous-dossier" (click)="onAction($event, 'create')">
  <i class="pi pi-plus" aria-hidden="true"></i>
</button>
```
La ligne de l'arbre reçoit `role="treeitem"`, `[attr.aria-expanded]`, `[attr.aria-selected]` et `tabindex="0"`, avec Entrée et Espace pour sélectionner et ← / → pour plier et déplier. Le conteneur reçoit `role="tree"`. Le groupe d'actions prend `group-focus-within:opacity-100`.

`styles.css` :
```css
@layer tailwind-base {
  :focus-visible { outline: 2px solid var(--color-prussian-blue-600); outline-offset: 2px; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0.01ms !important; animation-duration: 0.01ms !important; scroll-behavior: auto !important; }
}
```

### Lot 3 — Liste de documents digne d'une GED (M, dépend en partie du backend)

**Change.**
- Colonnes **Format** (badge court `PDF` / `DOCX`), **Ajouté le** (date courte, triable) et **Statut**. La colonne Statut n'apparaît que dans « Mes imports » ; le statut quitte ainsi la colonne Tags. **Taille** seulement si le backend la fournit (question 4).
- Tri avec `pSortableColumn`, côté client tant que les listes sont complètes.
- Dossiers : `p-table` en `[lazy]="true"` avec `totalRecords = page.total`, chargement page par page via `getDocuments(id, page, size)` (l'API pagine déjà). Corrige U1 sans toucher au backend. Le filtre par tags devra alors passer côté serveur, ou être limité à la page affichée et le dire (question 4).
- Lignes plus denses (`h-9`), donc environ 18 lignes visibles au lieu de 12.
- Icônes distinctes : `pi-lock` pour confidentiel, `pi-pencil` ou `pi-user-edit` pour « en cours d'édition ».
- Une seule table de formats (fusion de `detectFileType` et `getFileTypeInfo`), qui couvre tout ce que l'import accepte.

**Fichiers.** `document-table.component.{html,ts}`, `document.mapper.ts`, `document.model.ts`, `validation/file-type.util.ts` (supprimé, intégré au mapper), `smart-folder-state.service.ts`, `document-list.component.ts`.

Avant :
```html
<th>Nom Fichier</th> <th class="w-60">Tags</th> <th class="w-32"><span class="sr-only">Actions</span></th>
```
Après :
```html
<th pSortableColumn="name">Titre <p-sortIcon field="name" /></th>
<th class="w-16">Format</th>
<th pSortableColumn="importDate" class="w-28">Ajouté le <p-sortIcon field="importDate" /></th>
@if (showStatus()) { <th class="w-32">Statut</th> }
<th class="w-60">Tags</th>
<th class="w-28"><span class="sr-only">Actions</span></th>
```

### Lot 4 — Vue de validation : états des tags, aperçu, position dans la file (M, aperçu L)

**Change.**
- Les trois états des tags se distinguent sans lire et sans voir les couleurs :
  - suggéré : contour **pointillé** ambre, icône `pi-question-circle` ;
  - accepté : fond teal plein, icône `pi-check` ;
  - refusé : contour corail, texte barré, icône `pi-ban`.
  - Les ✓ / ✕ deviennent des boutons avec `aria-label` et `aria-pressed`.
- La sélection dans la file passe au primaire (comme partout) ; l'orange disparaît. « Retiré » prend un badge neutre.
- Le pied de page affiche « 3 sur 12 » à côté de « restants ».
- Aperçu : retrait de la fausse vignette ; la zone d'aperçu occupe la moitié haute du panneau, avec un `<iframe>` ou un `<object>` sur le fichier, ou l'éditeur OnlyOffice en mode lecture intégré. **Bloqué par la question 3** (quel point d'accès sert le contenu).

**Fichiers.** `tags-editor.component.html`, `import-queue-list.component.html`, `validation-footer.component.{html,ts}`, `import-preview-card.component.*`, `validation-view.component.html`.

Avant (`tags-editor.component.html:18-20`) :
```html
[class.bg-prussian-blue-50]="tag.status === 'PENDING'"
[class.border-prussian-blue-200]="tag.status === 'PENDING'"
```
Après :
```html
<span class="tag" [attr.data-status]="tag.status">
  <i class="pi {{ statusIcon[tag.status] }}" aria-hidden="true"></i>{{ tag.label }}
  <button type="button" [attr.aria-pressed]="tag.status === 'ACCEPTED'" aria-label="Accepter le tag {{ tag.label }}" …>
```
Le style des états se trouve à un seul endroit, avec `[data-status=PENDING] { border-style: dashed; … }` sur les tokens du lot 1.

### Lot 5 — Habillage : retirer les tics de la maquette v0 (S)

**Change.**
- Libellés de section en casse normale (`text-xs font-semibold text-gray-600`, sans `tracking-wide` ni majuscules) : « Explorateur », « Détails », « Métadonnées système », « Tags suggérés ». L'en-tête marketing du login (« ACCÈS SÉCURISÉ… ») est supprimé.
- Login : fond uni `prussian-blue-800` à la place du dégradé, pas d'icône en carré flou, une seule colonne sous `md`. Le bouton passe au primaire.
- Logo de la topbar sans carré coloré.
- Échelle typographique fixée à trois tailles d'interface (`2xs` réservé aux badges, `xs` pour les métadonnées, `sm` pour le contenu) et suppression de `text-[9px]`.

**Fichiers.** Les 13 templates de V9, `auth-overlay`, `auth-page`, `login-form`, `topbar`, `document-history-section`.

Avant : `<span class="text-xs font-semibold text-gray-600 tracking-wide">EXPLORATEUR</span>`
Après : `<h2 class="text-xs font-semibold text-gray-700">Explorateur</h2>`

### Lot 6 — États de chargement, d'erreur et vides (M)

**Change.**
- Skeletons à la forme réelle : lignes du tableau, nœuds de l'arbre, panneau de validation (PrimeNG `p-skeleton`, déjà fourni, sans nouvelle dépendance).
- Chaque erreur de chargement propose un bouton « Réessayer ».
- Le login distingue le 401 (« Identifiant ou mot de passe incorrect ») de la panne réseau (« Serveur injoignable, réessayez dans un instant »).
- La recherche distingue « Aucun résultat » de « La recherche n'a pas abouti ». La recherche avancée affiche son erreur dans le panneau.
- États vides avec action : dossier vide → « Importer des fichiers » (si contributeur) ou « Revenir à {parent} » ; recherche vide → « Effacer la recherche ».
- 403 : l'intercepteur ne toaste plus, seul le composant l'appelant affiche le message (ou l'inverse, mais pas les deux).

**Fichiers.** `document-list`, `document-table`, `sidebar`, `import-queue-list`, `validation-view`, `login-form.component.ts`, `search-dropdown.component.ts`, `advanced-search-panel.*`, `error.interceptor.ts`.

### Lot 7 — Microcopie et politique de toasts (S)

**Change.**
- Formats annoncés = formats acceptés, avec la taille max : « PDF, Word, Excel, PowerPoint, e-mail, images · 250 Mo max ».
- Placeholder de recherche : « Rechercher par titre, contenu ou tag ».
- « Ajouter » → « Ajouter un tag » ; « Annuler » (filtres) → « Tout effacer » ; « Nom Fichier » → « Titre ».
- Éditeur : « ← {titre du document} » à la place de « Retour à E-Lamina ».
- Recherche avancée : `Format` en `p-select` (valeurs connues) ; `Langue` en `p-select` ou retirée.
- Plus de toasts quand le résultat est déjà visible (connexion, dossier créé ou modifié, titre copié → coche de 1,5 s sur le bouton). On garde les toasts pour l'import, la suppression, le retrait et les erreurs.

**Fichiers.** `ingest-panel.component.html`, `search-dropdown.component.html`, `tags-editor.component.html`, `tags-filter-dropdown.component.html`, `document-table.component.html`, `document-editor-page.*`, `advanced-search-panel.*`, `login-form.component.ts`, `sidebar.component.ts`, `document-detail-panel.*`.

### Lot 8 — Nettoyage du code (S)

Rien de visible pour l'utilisateur ; ça réduit le bruit avant les autres lots.
- Suppression de `date-range-filter/`, `uploadFeedback`, `encrypted` / `signed`, des couleurs de `TagFilterOption`, de `modifiedDotColor` et des blocs commentés.
- Imports PrimeNG inutilisés retirés.
- `IngestPanel` → `app-ingest-panel`.
- `border-purssian` et `display-none` corrigés (la case « fautes de frappe » : la garder visible ou la retirer, au choix).
- Types `DocsEditorConfig` / `DocEditor` minimaux à la place de `any` ; `firstValueFrom` à la place de `.toPromise()`.
- `format: string`.
- `console.error` retirés (les erreurs sont déjà montrées à l'utilisateur).
- `app.component.spec.ts` réécrit ou supprimé.

### Lot 9 — Largeur tablette (M)

**Change.** Sous 1280 px, le panneau de détails devient un tiroir à droite (ouvert au clic sur une ligne, fermé par Échap), ce qui libère 280 px pour le tableau. Sous 1024 px, l'arbre se replie derrière un bouton « Dossiers ». La vue de validation passe la file à `w-72`. Le login passe à une colonne sous `md`.

**Fichiers.** `shell.component.{html,ts}`, `validation-view.component.html`, `auth-page.component.html`.

**Ordre proposé** : 8 → 1 → 2 → 5 → 3 → 6 → 7 → 4 → 9. Le nettoyage d'abord, pour des diffs lisibles ; les tokens ensuite, car presque tous les autres lots les utilisent.

---

## 4. Ce qui est déjà bien (à garder)

- **Le flux de publication.** ↑ / ↓ et Ctrl+Entrée, rappel des raccourcis en pied de file, passage au document suivant à la même position, saisie conservée quand on part voir le document, raison du blocage affichée à côté du bouton, bouton désactivé pendant l'envoi, bandeau « … a été publié · Voir dans son dossier », état de fin de file avec action. Tout ça est pensé pour un usage réel.
- **La microcopie métier.** Français partout, verbes précis (« Retirer de la consultation », « Annuler l'import » / « Garder »), confirmations qui disent les conséquences (« Les documents ne sont pas supprimés », « reviendra dans « À publier » »). L'éditeur de dossier explique la logique ET / OU des critères.
- **La typographie.** IBM Plex Sans et Mono : un choix assumé et adapté à un outil documentaire ; le mono sert aux métadonnées et aux dates.
- **La pertinence affichée honnêtement.** Barres à trois niveaux plus un libellé, et un commentaire qui interdit d'afficher le score Lucene comme un pourcentage.
- **En recherche, le nom du fichier d'origine** s'affiche sous le titre, pour distinguer des titres proches.
- **L'architecture.** API → service d'état à signaux → composants ; gardes contre les réponses arrivées dans le désordre (`selectedImportId() !== id`) ; `takeUntilDestroyed` là où il faut ; aucun `HttpClient` dans un composant ; aucun mock.
- **Les droits.** Les actions sont masquées par rôle et par `manageable`, en cohérence avec le backend.
- **Les couches CSS.** L'ordre `tailwind-base, primeng, tailwind-utilities` est correct, et le mode sombre est désactivé plutôt qu'imité.
- **La sobriété.** Pas de dépendance superflue, pas de carte KPI, pas d'emoji, pas de ton enjoué dans les toasts ; un seul toast de synthèse par lot importé.

---

## 5. Questions ouvertes

1. **Valeurs exactes du bleu de Prusse.** L'échelle du lot 1 est une proposition (800 = `#003153`). Est-ce que tu as une charte imposée ? Le changement assombrit nettement toute l'interface : à valider sur une capture avant d'appliquer.
2. **Couleurs d'état.** Teal pour accepté, ambre pour suggéré / en attente, corail pour refusé / échec : d'accord ? Peut-on garder `burnt-peach` comme corail et supprimer `almond-silk` et `rusty-spice` (et les 4 échelles bleues inutilisées) ? `CLAUDE.md` demande validation avant de toucher aux tokens.
3. **Aperçu dans la vue de validation (bloquant pour G3).** Existe-t-il un point d'accès qui sert le fichier, ou un rendu PDF, pour un `<iframe>` ? Sinon, faut-il intégrer OnlyOffice en mode `view` dans le panneau ? C'est une décision backend.
4. **Pagination et tri côté serveur.** `/api/dms/document/folders/{id}/documents` pagine déjà : la correction de U1 est donc possible côté front seul. Mais `/lifecycle/documents/published`, `/mine` et la recherche renvoient tout, sans tri serveur, et `FolderDocument` n'a pas de taille de fichier. Faut-il ajouter `fileSize` et des paramètres `sort` au backend ? Et le filtre par tags : côté serveur, ou limité à la page affichée ?
5. **Pourquoi un résultat remonte (G7).** Il faudrait que la recherche renvoie les champs trouvés et un extrait surligné (highlighter Lucene). C'est hors périmètre frontend : à planifier ?
6. **« Alamino milamina »** dans la topbar : c'est une signature voulue ? Je la garde si oui.
7. **Cible responsive.** Quelle largeur minimale faut-il supporter (tablette paysage à 1024 px, portrait à 768 px) ? Ça décide de l'ampleur du lot 9.
8. **Politique de toasts.** Je propose de les réserver aux actions asynchrones dont le résultat n'est pas visible à l'écran, et aux erreurs. Pour le 403 : message dans l'intercepteur ou dans le composant ?
9. **Recherche « / » façon command palette.** Elle n'existe pas dans le code. C'est souhaité, ou hors périmètre ?
10. **OnlyOffice et tags suggérés.** Pour auditer l'éditeur (E17) et les états des tags à l'écran, il faut lancer le serveur OnlyOffice et avoir dans la file au moins un document avec des tags `PENDING`. Peux-tu les préparer, ou m'indiquer un document qui en a ?
11. **Unités de taille (E13).** `fileSize` arrive déjà formaté en anglais (« KB »). On passe en « Ko » côté backend, ou bien le backend renvoie des octets et le front formate ?
12. **Écran d'administration.** Il n'était pas dans la liste des écrans : seuls les motifs (console, `$any`) y ont été relevés. Faut-il l'auditer aussi ?
