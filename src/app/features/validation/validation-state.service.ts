import { Injectable, inject, signal, computed } from '@angular/core';
import { LifecycleDocumentService } from './lifecycle-document.service';
import { LifecycleDocument } from './lifecycle-document.model';

@Injectable({ providedIn: 'root' })
export class ValidationStateService {
  private documentService = inject(LifecycleDocumentService);

  private allDocuments = signal<LifecycleDocument[]>([]);
  isLoading = signal(false);
  loadError = signal<string | null>(null);

  selectedImportId = signal<string | null>(null);

  pendingImports = computed(() =>
    this.allDocuments().filter(d => d.status === 'PENDING_VALIDATION')
  );

  selectedImport = computed(() =>
    this.pendingImports().find(d => d.id === this.selectedImportId()) ?? null
  );

  remainingCount = computed(() => this.pendingImports().length);

  loadPendingImports() {
    this.isLoading.set(true);
    this.loadError.set(null);

    this.documentService.getAll().subscribe({
      next: (docs) => {
        this.allDocuments.set(docs);
        this.isLoading.set(false);

        // Sélectionne automatiquement le premier import en attente, s'il y en a un
        const pending = docs.filter(d => d.status === 'PENDING_VALIDATION');
        if (pending.length > 0 && !this.selectedImportId()) {
          this.selectedImportId.set(pending[0].id);
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

  publish(id: string) {
    this.documentService.publish(id).subscribe({
      next: () => {
        // On enlève le document publié de la liste locale, sans refaire un fetch complet
        this.allDocuments.update(docs => docs.filter(d => d.id !== id));

        const remaining = this.pendingImports();
        this.selectedImportId.set(remaining.length ? remaining[0].id : null);
      },
      error: (err) => console.error('Erreur publication:', err)
    });
  }
}