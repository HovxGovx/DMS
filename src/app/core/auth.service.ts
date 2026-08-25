import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthStateService } from './auth-state.service';

interface LoginRequest {
  uid: string;
  password: string;
}

export interface CurrentUser {
  id: string;
  uid: string;
  fullName: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private authState = inject(AuthStateService);

  currentUser = signal<CurrentUser | null>(null);

  login(uid: string, password: string): Observable<void> {
    const body: LoginRequest = { uid, password };

    return this.http.post<void>(`${environment.apiUrl}/auth/login`, body).pipe(
      tap(() => this.authState.markLoggedIn())
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
      tap(user => this.currentUser.set(user))
    );
  }

  isAuthenticated(): boolean {
    return this.authState.isLoggedIn();
  }
}