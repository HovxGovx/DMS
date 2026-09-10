# Documentation de l'Application DMS (Document Management System)

## 📌 Présentation Générale
L'application **DMS** est une interface de Gestion Électronique de Documents développée avec **Angular 19**. Elle permet la gestion, la recherche, l'importation et la validation de documents numériques.

## 🛠 Stack Technique
- **Framework**: Angular 19 (Standalone Components)
- **UI Library**: PrimeNG 19 (Thème Aura)
- **Styling**: Tailwind CSS 4
- **Gestion d'état**: Services Angular & RxJS
- **Icônes**: PrimeIcons

## 🏗 Architecture du Projet

### 📂 Structure des Dossiers (`src/app`)
L'application suit une organisation modulaire par fonctionnalités :

- **`core/`**: Services transverses, guards et intercepteurs.
    - `auth.service.ts` & `auth-state.service.ts`: Gestion de la session utilisateur.
    - `interceptors/`: Gestion des erreurs et ajout des credentials aux requêtes HTTP.
    - `view-state.service.ts`: Gestion de l'état global de l'interface.
- **`layout/`**: Composants de structure.
    - `shell/`: Le conteneur principal de l'application.
    - `sidebar/`, `topbar/`: Navigation et menus utilisateur.
- **`features/`**: Logique métier découpée par domaine.
    - **`auth/`**: Pages de connexion et d'inscription (`AuthPageComponent`).
    - **`documents/`**: Cœur du DMS.
        - `document-list/`: Affichage tabulaire des documents.
        - `document-detail/`: Panneaux d'informations et métadonnées.
        - `document-filters/`: Filtrage par date et tags.
    - **`search/`**: Moteur de recherche avec dropdown et panel avancé.
    - **`upload/`**: Gestion de l'ingestion des fichiers (`IngestPanel`).
    - **`validation/`**: Workflow de validation des imports (classification, confiance, file d'attente).

## 🛣 Navigation et Routage
L'application utilise un routage protégé :
- `/login`: Accès public pour l'authentification.
- `/`: Route protégée par `authGuard`, utilisant le `ShellComponent` comme layout parent.
    - Route par défaut $\rightarrow$ `DocumentListComponent`.

## ⚙️ Configuration Clé
- **Intercepteurs**:
    - `credentialsInterceptor`: Injecte les jetons d'authentification.
    - `errorInterceptor`: Centralise la gestion des erreurs API.
- **PrimeNG**: Configuré avec le preset **Aura** pour un design moderne et épuré.

## 🚀 Flux de Travail Principaux
1. **Authentification** $\rightarrow$ Accès au Dashboard.
2. **Exploration** $\rightarrow$ Recherche $\rightarrow$ Filtrage $\rightarrow$ Consultation des détails du document.
3. **Ingestion** $\rightarrow$ Upload $\rightarrow$ File de validation $\rightarrow$ Classification $\rightarrow$ Intégration finale.
