import { Injectable, computed, inject, signal } from '@angular/core';
import { AdminDocumentService } from './admin-document.service';
import { FailedDocument } from './failed-document.model';

@Injectable({ providedIn: 'root' })
export class FailedDocumentsStateService {
  private adminDocumentService = inject(AdminDocumentService);

  documents = signal<FailedDocument[]>([]);
  isLoading = signal(false);
  loadError = signal<string | null>(null);

  count = computed(() => this.documents().length);

  loadFailed() {
    this.isLoading.set(true);
    this.loadError.set(null);
    this.adminDocumentService.getFailed().subscribe({
      next: documents => {
        this.documents.set(documents);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set('Impossible de charger les documents en échec.');
      }
    });
  }

  /** Retire de la liste un document relancé avec succès ou supprimé. */
  remove(id: string) {
    this.documents.update(documents => documents.filter(d => d.id !== id));
  }
}
