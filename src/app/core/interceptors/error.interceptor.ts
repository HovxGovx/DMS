import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStateService } from '../auth-state.service';
import { NotificationService } from '../notification.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authState = inject(AuthStateService);
  const notification = inject(NotificationService);

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
      } else if (error.status === 403) {
        // Authentifié, mais action refusée pour une autre raison — ne PAS déconnecter
        notification.error("Action non autorisée.");
      }
      return throwError(() => error);
    })
  );
};