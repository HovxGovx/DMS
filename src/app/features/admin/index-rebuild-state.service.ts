import { Injectable, signal } from '@angular/core';
import { IndexRebuildResult } from './admin-index.service';

/** État de la reconstruction de l'index, gardé hors du composant pour survivre à un changement de section. */
@Injectable({ providedIn: 'root' })
export class IndexRebuildStateService {
  isRebuilding = signal(false);
  lastResult = signal<{ result: IndexRebuildResult; at: Date } | null>(null);
}
