import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthStateService } from '../auth-state.service';

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
      }
      // Les autres erreurs (403 compris) sont annoncées par le composant, avec un message propre à l'action
      // (httpErrorMessage) : un toast ici en ferait deux.
      return throwError(() => error);
    })
  );
};
