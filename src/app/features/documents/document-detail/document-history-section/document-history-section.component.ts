import { Component, effect, inject, input, signal, untracked } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuditService } from '../../../audit/audit.service';
import { AuditEntry, auditActionDisplay, formatAuditDate } from '../../../audit/audit.model';

/** Nombre d'événements affichés avant « Voir tout ». */
const COLLAPSED_COUNT = 4;

/**
 * Historique du document dans le panneau de détails : qui l'a importé, validé, retiré, modifié...
 * Rechargé à chaque changement de document ou de refreshKey.
 */
@Component({
  selector: 'app-document-history-section',
  standalone: true,
  templateUrl: './document-history-section.component.html'
})
export class DocumentHistorySectionComponent {
  private auditService = inject(AuditService);

  documentId = input.required<string>();
  /** Recharge l'historique quand cette valeur change (ex : accès modifié depuis le panneau, même document). */
  refreshKey = input<unknown>();

  readonly display = auditActionDisplay;
  readonly formatDate = formatAuditDate;
  readonly collapsedCount = COLLAPSED_COUNT;

  entries = signal<AuditEntry[]>([]);
  isLoading = signal(false);
  loadError = signal(false);
  expanded = signal(false);

  private request?: Subscription;

  constructor() {
    effect(() => {
      const id = this.documentId();
      this.refreshKey();
      untracked(() => this.load(id));
    });
  }

  private load(id: string) {
    // Un clic rapide sur un autre document ne doit pas afficher l'historique du précédent
    this.request?.unsubscribe();
    this.entries.set([]);
    this.expanded.set(false);
    this.loadError.set(false);
    this.isLoading.set(true);
    this.request = this.auditService.getDocumentHistory(id).subscribe({
      next: entries => {
        this.entries.set(entries);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set(true);
      }
    });
  }

  visibleEntries(): AuditEntry[] {
    return this.expanded() ? this.entries() : this.entries().slice(0, COLLAPSED_COUNT);
  }
}
