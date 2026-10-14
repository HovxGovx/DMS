import { Injectable, computed, inject, signal } from '@angular/core';
import { AdminDocumentService } from './admin-document.service';
import { OwnerlessDocument } from './ownerless-document.model';

@Injectable({ providedIn: 'root' })
export class OwnerlessDocumentsStateService {
  private adminDocumentService = inject(AdminDocumentService);

  documents = signal<OwnerlessDocument[]>([]);
  isLoading = signal(false);
  loadError = signal<string | null>(null);

  /** Filtre texte (titre ou nom de fichier). */
  filter = signal('');
  /** Documents cochés pour être rattachés ensemble. */
  selectedIds = signal<ReadonlySet<string>>(new Set());

  count = computed(() => this.documents().length);

  filteredDocuments = computed(() => {
    const term = this.filter().trim().toLowerCase();
    if (!term) return this.documents();
    return this.documents().filter(d =>
      d.fileName.toLowerCase().includes(term) || d.title?.toLowerCase().includes(term));
  });

  loadWithoutOwner() {
    this.isLoading.set(true);
    this.loadError.set(null);
    this.adminDocumentService.getWithoutOwner().subscribe({
      next: documents => {
        this.documents.set(documents);
        // Garde seulement les cases des documents encore sans propriétaire
        const ids = new Set(documents.map(d => d.id));
        this.selectedIds.update(selected => new Set([...selected].filter(id => ids.has(id))));
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set('Impossible de charger les documents sans propriétaire.');
      }
    });
  }

  toggle(id: string) {
    this.selectedIds.update(selected => {
      const next = new Set(selected);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  /** Coche ou décoche tous les documents affichés par le filtre. */
  setAllFiltered(checked: boolean) {
    const ids = this.filteredDocuments().map(d => d.id);
    this.selectedIds.update(selected => {
      const next = new Set(selected);
      ids.forEach(id => checked ? next.add(id) : next.delete(id));
      return next;
    });
  }

  /** Retire de la liste les documents qui viennent d'être rattachés. */
  removeAll(ids: string[]) {
    const removed = new Set(ids);
    this.documents.update(documents => documents.filter(d => !removed.has(d.id)));
    this.selectedIds.update(selected => new Set([...selected].filter(id => !removed.has(id))));
  }
}
