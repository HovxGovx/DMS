import { Injectable, inject, signal, computed } from '@angular/core';
import { LifecycleDocumentService } from './lifecycle-document.service';
import { LifecycleDocument } from './lifecycle-document.model';

@Injectable({ providedIn: 'root' })
export class ValidationStateService {
  private documentService = inject(LifecycleDocumentService);

  pendingImports = signal<LifecycleDocument[]>([]);
  isLoading = signal(false);
  loadError = signal<string | null>(null);

  selectedImportId = signal<string | null>(null);

  selectedImport = computed(() =>
    this.pendingImports().find(d => d.id === this.selectedImportId()) ?? null
  );

  remainingCount = computed(() => this.pendingImports().length);

  loadPendingImports() {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.documentService.getPending().subscribe({
      next: (docs) => {
        this.pendingImports.set(docs);
        this.isLoading.set(false);

        if (docs.length > 0 && !this.selectedImportId()) {
          this.selectedImportId.set(docs[0].id);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.loadError.set("Impossible de charger les imports en attente.");
        console.error('Erreur chargement documents:', err);
      }
    });
  }

  selectImport(id: string) {
    this.selectedImportId.set(id);
  }

  // Mutateur simple, appelé par les composants après une action réussie (ex: publication).
  // Pas d'appel HTTP ici — juste la mise à jour de l'état partagé.
  removeFromPending(id: string) {
    this.pendingImports.update(docs => docs.filter(d => d.id !== id));

    if (this.selectedImportId() === id) {
      const remaining = this.pendingImports();
      this.selectedImportId.set(remaining.length ? remaining[0].id : null);
    }
  }
}