import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ViewStateService {
  // On gère l'état d'ouverture du panneau de validation ici pour une accessibilité globale
  isValidationOpen = signal(false);

  toggleValidationPanel() {
    this.isValidationOpen.update(v => !v);
  }

  closeValidationPanel() {
    this.isValidationOpen.set(false);
  }

  // Gardé pour compatibilité si d'autres composants l'utilisent encore
  currentView = computed(() => this.isValidationOpen() ? 'validation' : 'documents');
}
