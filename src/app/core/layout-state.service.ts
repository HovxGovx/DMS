import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'e-lamina.panels';

interface PanelsState {
  leftCollapsed: boolean;
  rightCollapsed: boolean;
}

/**
 * Panneaux latéraux de la vue Documents (explorateur à gauche, détails à droite), repliables.
 * Simple préférence d'affichage : gardée dans le navigateur, et ignorée si le stockage est indisponible.
 */
@Injectable({ providedIn: 'root' })
export class LayoutStateService {
  private readonly saved = readSaved();

  leftCollapsed = signal(this.saved.leftCollapsed);
  rightCollapsed = signal(this.saved.rightCollapsed);

  toggleLeft() {
    this.leftCollapsed.update(collapsed => !collapsed);
    this.save();
  }

  toggleRight() {
    this.rightCollapsed.update(collapsed => !collapsed);
    this.save();
  }

  private save() {
    const state: PanelsState = { leftCollapsed: this.leftCollapsed(), rightCollapsed: this.rightCollapsed() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Navigation privée ou stockage bloqué : le choix vaut pour la session seulement
    }
  }
}

function readSaved(): PanelsState {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    return { leftCollapsed: saved.leftCollapsed === true, rightCollapsed: saved.rightCollapsed === true };
  } catch {
    return { leftCollapsed: false, rightCollapsed: false };
  }
}
