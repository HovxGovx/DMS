import { Injectable, signal } from '@angular/core';

/**
 * Ne stocke PAS le vrai token (impossible en JS avec un cookie httpOnly).
 * Indique seulement, pour la session courante de l'onglet, que le backend a déjà confirmé
 * la session (login réussi ou /me OK). Volontairement en mémoire et non en localStorage :
 * au rechargement de l'app, le guard redemande au backend si le cookie est encore valide.
 */
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  isLoggedIn = signal<boolean>(false);

  markLoggedIn() {
    this.isLoggedIn.set(true);
  }

  markLoggedOut() {
    this.isLoggedIn.set(false);
  }
}
