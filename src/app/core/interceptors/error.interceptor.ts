import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStateService } from '../auth-state.service';

/** Message d'un 403 sans corps (refus de Spring Security sur le rôle). */
const FORBIDDEN_MESSAGE = "Vos droits ne permettent pas cette action.";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authState = inject(AuthStateService);

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {
        // Vraie expiration/absence de session — ici la déconnexion est justifiée.
        // Session déjà ouverte dans l'onglet : rechargement complet, pour que le prochain compte
        // ne retrouve rien de l'état en mémoire (vue, dossiers, réponse du RAG...).
        // Sinon (premier chargement, mauvais mot de passe) il n'y a rien à effacer.
        if (authState.isLoggedIn()) {
          authState.markLoggedOut();
          window.location.assign('/login');
        } else {
          router.navigate(['/login']);
        }
      } else if (error.status === 403 && error instanceof HttpErrorResponse && !error.error?.message) {
        // Authentifié, mais action refusée — ne PAS déconnecter. Pas de toast ici : le composant affiche
        // déjà err.error?.message (un toast de plus faisait deux messages). On lui fournit le message manquant.
        return throwError(() => new HttpErrorResponse({
          error: { message: FORBIDDEN_MESSAGE },
          headers: error.headers,
          status: error.status,
          statusText: error.statusText,
          url: error.url ?? undefined
        }));
      }
      return throwError(() => error);
    })
  );
};
