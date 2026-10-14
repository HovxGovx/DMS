import { Injectable, inject, signal, computed } from '@angular/core';
import { DocumentValidationService } from './document-validation.service';
import { PendingDocument, ValidationDetail } from './validation-detail.model';
import { AuthService } from '../../core/auth.service';

/** Dernier document publié depuis la file, pour proposer d'aller le voir dans son dossier. */
export interface PublishedEntry {
  id: string;
  title: string;
}

/** Saisie non publiée, gardée quand on quitte la vue (ex : affichage du document en pleine page). */
export interface FormDraft {
  id: string;
  title: string;
  domainCode: string | null;
  typeCode: string | null;
  confidentiality: string | null;
}

@Injectable({ providedIn: 'root' })
export class ValidationStateService {
  private validationService = inject(DocumentValidationService);
  private authService = inject(AuthService);

  pendingImports = signal<PendingDocument[]>([]);
  isLoading = signal(false);
  loadError = signal<string | null>(null);

  /** Filtre texte de la file (titre ou nom de fichier). */
  queueFilter = signal('');

  selectedImportId = signal<string | null>(null);

  detail = signal<ValidationDetail | null>(null);
  isDetailLoading = signal(false);
  detailError = signal<string | null>(null);

  /** Publications faites pendant la session (non persisté). */
  lastPublished = signal<PublishedEntry | null>(null);
  formDraft = signal<FormDraft | null>(null);
  publishedCount = signal(0);

  filteredImports = computed(() => {
    const query = this.queueFilter().trim().toLowerCase();
    const docs = this.pendingImports();
    if (!query) return docs;
    return docs.filter(d =>
      d.title.toLowerCase().includes(query) || d.fileName.toLowerCase().includes(query)
    );
  });

  remainingCount = computed(() => this.pendingImports().length);

  loadPendingImports() {
    // Réservée aux validateurs : le backend répondrait 403
    if (!this.authService.hasRole('VALIDATOR')) return;
    this.isLoading.set(true);
    this.loadError.set(null);

    this.validationService.getPending().subscribe({
      next: (docs) => {
        this.pendingImports.set(docs);
        this.isLoading.set(false);

        // Sélection absente ou déjà publiée ailleurs : on repart du premier document
        const selected = this.selectedImportId();
        if (docs.length > 0 && (!selected || !docs.some(d => d.id === selected))) {
          this.selectImport(docs[0].id);
        } else if (!docs.length) {
          this.selectedImportId.set(null);
          this.detail.set(null);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set("Impossible de charger les documents à publier.");
      }
    });
  }

  selectImport(id: string) {
    if (id === this.selectedImportId() && this.detail()?.id === id) return;
    this.selectedImportId.set(id);
    this.loadDetail(id);
  }

  /** Sélectionne le document précédent (-1) ou suivant (+1) dans la file affichée. */
  selectAdjacent(step: 1 | -1) {
    const docs = this.filteredImports();
    if (!docs.length) return;
    const index = docs.findIndex(d => d.id === this.selectedImportId());
    const next = index === -1 ? 0 : Math.min(Math.max(index + step, 0), docs.length - 1);
    this.selectImport(docs[next].id);
  }

  // Mutateur simple, appelé par les composants après une publication réussie.
  // Pas d'appel HTTP ici — juste la mise à jour de l'état partagé.
  markPublished(entry: PublishedEntry) {
    this.lastPublished.set(entry);
    this.publishedCount.update(count => count + 1);
    this.removeFromQueue(entry.id);
  }

  // Mutateur appelé après la suppression d'un import fait par erreur.
  markDeleted(id: string) {
    this.removeFromQueue(id);
  }

  dismissLastPublished() {
    this.lastPublished.set(null);
  }

  private removeFromQueue(id: string) {
    const docs = this.filteredImports();
    const index = docs.findIndex(d => d.id === id);
    this.pendingImports.update(list => list.filter(d => d.id !== id));

    if (this.selectedImportId() !== id) return;

    // On enchaîne sur le document suivant (même position), pas sur le premier de la liste
    const remaining = this.filteredImports();
    if (remaining.length) {
      this.selectImport(remaining[Math.min(Math.max(index, 0), remaining.length - 1)].id);
    } else if (this.pendingImports().length) {
      this.queueFilter.set('');
      this.selectImport(this.pendingImports()[0].id);
    } else {
      this.selectedImportId.set(null);
      this.detail.set(null);
    }
  }

  private loadDetail(id: string) {
    // On garde le détail précédent affiché pendant le chargement pour éviter le clignotement
    this.isDetailLoading.set(true);
    this.detailError.set(null);

    this.validationService.getDetail(id).subscribe({
      next: (detail) => {
        if (this.selectedImportId() !== id) return;
        this.detail.set(detail);
        this.isDetailLoading.set(false);
      },
      error: () => {
        if (this.selectedImportId() !== id) return;
        this.isDetailLoading.set(false);
        this.detail.set(null);
        this.detailError.set('Impossible de charger le détail du document.');
      }
    });
  }
}
