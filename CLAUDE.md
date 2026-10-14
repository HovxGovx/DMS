# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

DMS ("E-Lamina", formerly "DocuFlow") — the Angular 19 frontend of a document management system (GED). Standalone components, PrimeNG 19 (Aura preset, customized as `ELaminaPreset` in `src/app/app.config.ts`), Tailwind CSS 4, signals + RxJS. UI text and code comments are in French.

## Commands

```bash
npm start                      # ng serve on :4200, uses proxy.conf.json (development config by default)
npm run build                  # production build -> dist/dms/browser
npm run watch                  # dev build in watch mode
npm test                       # Karma + Jasmine (Chrome)
npx ng test --include src/app/features/validation/validation.service.spec.ts   # single spec file
npx ng test --watch=false --browsers=ChromeHeadless                            # one-shot CI-style run
```

No linter is configured. Production builds enforce budgets: 500kB warn / 1.5MB error initial, and **4kB warn / 8kB error per component stylesheet** — prefer Tailwind utilities over large component CSS.

## Backend & environment

- All HTTP calls use `${environment.apiUrl}` (empty string) + absolute paths, so requests go through a proxy: `proxy.conf.json` in dev and `nginx.conf` in Docker both forward `/api/dms`, `/auth`, and `/me` to the backend on port 8080 (`backend:8080` in Docker). Adding a new top-level backend path requires updating both files.
- `environment.development.ts` replaces `environment.ts` in the development build. `onlyOfficeUrl` differs between them (8089 dev vs 8085 prod).
- `Dockerfile` builds with `--configuration production` and serves via nginx (SPA fallback, 250M upload limit).

## Architecture

- `src/app/core/` — auth, guards, interceptors, global UI state.
  - Auth is **cookie-based (httpOnly)**. `credentialsInterceptor` sets `withCredentials` on every request. `authGuard` asks the backend (`AuthService.checkSession()` → `GET /me`) on the first guarded navigation; `AuthStateService` only remembers in memory that the session was confirmed (no `localStorage`), so a reload always re-checks the cookie.
  - `errorInterceptor`: on 401 it marks the user logged out and redirects to `/login`; on 403 it shows a toast but does **not** log out.
  - `NotificationService` wraps PrimeNG `MessageService` (provided globally with `ConfirmationService`).
- `src/app/layout/` — `ShellComponent` is the authenticated layout (topbar, sidebar, ingest panel, detail panel). It switches between the **documents** and **validation** views via `ViewStateService.currentView` (a signal, not routing).
- Routes (`app.routes.ts`): `/login`, `/documents/:id/editor` (full-page OnlyOffice editor, outside the shell), and `''` → shell → `DocumentListComponent`.
- `src/app/features/` — one folder per domain. Each domain follows the same pattern: `*-api`/`*.service.ts` (thin `HttpClient` wrapper returning Observables) → `*-state.service.ts` (`providedIn: 'root'`, holds `signal`s/`computed`s, subscribes to the API, exposes loading/error signals) → components that read the state service.
  - `documents/`: `DocumentStateService` (published docs, search results/search mode, selection + metadata), `SmartFolderStateService` (lazy-loaded folder tree from `/api/dms/document/folders`, feeds the sidebar). Backend DTOs are converted to the UI `DocumentItem` model in `document.mapper.ts` (`fromLifecycleDocument`, `fromSearchResult`, `fromFolderDocument`, `mergeWithRealMetadata`).
  - `validation/`: import review workflow, shown to users as « À publier » / « Publier » (the business action is publishing; code keeps the `validation` names). Queue from `/api/dms/document/pending-validation`, validation detail, taxonomy, tag accept/reject, publish via `/{id}/validate`. `ValidationStateService` holds the queue, selection, filter and session publish state.
  - `search/`: simple and advanced search (`/api/dms/search/*`), results pushed into `DocumentStateService`.
  - `upload/`: batch upload via `IngestPanel`.
  - `editor/`: loads the OnlyOffice `api.js` dynamically from `environment.onlyOfficeUrl` and fetches config from `/api/dms/document/{id}/editor/config`.
- `src/app/shared/` — small reusable UI pieces (breadcrumb, dropdown backdrop).

## Styling

`src/styles.css` defines CSS layer order `tailwind-base, primeng, tailwind-utilities` so Tailwind utilities can override PrimeNG. Custom color scales (`prussian-blue`, `regal-navy`, `burnt-peach`, …) are declared in `@theme` and usable as Tailwind classes (e.g. `bg-prussian-blue-500`). PrimeNG dark mode is disabled.

## Conventions
- Hide what the user's role does not allow with `AuthService.hasRole('VALIDATOR')` (hierarchical, reactive); the backend enforces the same rules and answers 403.
- State services hold reactive state and do reads only. Write actions (publish, upload) and their toasts belong to the triggering component.
- Reply in French. Never commit or push unless asked.
- Ask before adding a dependency or changing the design tokens.