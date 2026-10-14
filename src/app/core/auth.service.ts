import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, switchMap, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthStateService } from './auth-state.service';

interface LoginRequest {
  uid: string;
  password: string;
}

/** Rôles du backend, du moins au plus élevé : chaque rôle a aussi les droits des rôles précédents. */
const ROLES = ['READER', 'CONTRIBUTOR', 'VALIDATOR', 'ADMIN'] as const;
export type Role = typeof ROLES[number];

export interface CurrentUser {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  role: Role;
  /** Domaines de la taxonomie (ex : FINANCE) : ils décident des documents visibles. */
  domainCodes: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private authState = inject(AuthStateService);

  currentUser = signal<CurrentUser | null>(null);

  /** Vrai si l'utilisateur a au moins ce rôle. Lit un signal : réactif dans un template ou un computed. */
  hasRole(role: Role): boolean {
    const current = this.currentUser()?.role;
    return !!current && ROLES.indexOf(current) >= ROLES.indexOf(role);
  }

  login(uid: string, password: string): Observable<void> {
    const body: LoginRequest = { uid, password };

    // On charge l'utilisateur juste après le login pour que le guard n'ait pas à rappeler /me
    return this.http.post<void>(`${environment.apiUrl}/auth/login`, body).pipe(
      switchMap(() => this.fetchCurrentUser()),
      map(() => undefined)
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.authState.markLoggedOut();
        this.currentUser.set(null);
      })
    );
  }

  fetchCurrentUser(): Observable<CurrentUser> {
    return this.http.get<CurrentUser>(`${environment.apiUrl}/me`).pipe(
      tap(user => {
        this.currentUser.set(user);
        this.authState.markLoggedIn();
      })
    );
  }

  /**
   * Session déjà confirmée dans cet onglet → true sans appel réseau.
   * Sinon on demande au backend (/me) : c'est lui qui sait si le cookie est encore valide.
   */
  checkSession(): Observable<boolean> {
    if (this.authState.isLoggedIn()) {
      return of(true);
    }
    return this.fetchCurrentUser().pipe(
      map(() => true),
      catchError(() => of(false))
    );
  }
}