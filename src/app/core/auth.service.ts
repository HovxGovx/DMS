import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthStateService } from './auth-state.service';

interface LoginRequest {
  uid: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private authState = inject(AuthStateService);

  login(uid: string, password: string): Observable<void> {
    const body: LoginRequest = { uid, password };

    return this.http.post<void>(`${environment.apiUrl}/auth/login`, body).pipe(
      tap(() => this.authState.markLoggedIn())
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/logout`, {}).pipe(
      tap(() => this.authState.markLoggedOut())
    );
  }

  isAuthenticated(): boolean {
    return this.authState.isLoggedIn();
  }
}