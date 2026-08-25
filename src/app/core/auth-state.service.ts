import { Injectable, signal } from '@angular/core';

const AUTH_FLAG_KEY = 'docuflow_is_logged_in';

/**
 * Ne stocke PAS le vrai token (impossible en JS avec un cookie httpOnly).
 * Sert uniquement d'indicateur pour l'UI (guard, affichage conditionnel) — la vraie
 * vérification d'authentification est toujours faite par le backend sur chaque requête,
 * via le cookie que le navigateur envoie automatiquement.
 */
@Injectable({ providedIn: 'root' })
export class AuthStateService {
  isLoggedIn = signal<boolean>(localStorage.getItem(AUTH_FLAG_KEY) === 'true');

  markLoggedIn() {
    localStorage.setItem(AUTH_FLAG_KEY, 'true');
    this.isLoggedIn.set(true);
  }

  markLoggedOut() {
    localStorage.removeItem(AUTH_FLAG_KEY);
    this.isLoggedIn.set(false);
  }
}