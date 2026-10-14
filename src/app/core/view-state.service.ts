import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';

export type AppView = 'documents' | 'validation' | 'admin';

@Injectable({ providedIn: 'root' })
export class ViewStateService {
  private authService = inject(AuthService);

  currentView = signal<AppView>('documents');

  setView(view: AppView) {
    // La vue « À publier » est réservée aux validateurs (le backend refuserait son contenu)
    if (view === 'validation' && !this.authService.hasRole('VALIDATOR')) return;
    // L'administration est réservée aux administrateurs
    if (view === 'admin' && !this.authService.hasRole('ADMIN')) return;
    this.currentView.set(view);
  }
}
