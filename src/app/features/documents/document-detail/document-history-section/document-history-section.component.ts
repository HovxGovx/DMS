import { Component, computed, effect, inject, input, signal, untracked } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuditService } from '../../../audit/audit.service';
import { AuditEntry, auditActionDisplay, formatAuditDate } from '../../../audit/audit.model';

/** Nombre d'événements affichés avant « Voir tout ». */
const COLLAPSED_COUNT = 4;

/** Consultations d'un côté, toutes les autres actions de l'autre. */
type HistoryFilter = 'all' | 'actions' | 'views';

const isView = (entry: AuditEntry) => entry.action === 'VIEWED';

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
  readonly filterOptions: { value: HistoryFilter; label: string }[] = [
    { value: 'all', label: 'Tout' },
    { value: 'actions', label: 'Actions' },
    { value: 'views', label: 'Consultations' }
  ];

  entries = signal<AuditEntry[]>([]);
  isLoading = signal(false);
  loadError = signal(false);
  expanded = signal(false);
  /** Gardé d'un document à l'autre : qui ne veut que les actions n'a pas à refiltrer à chaque clic. */
  filter = signal<HistoryFilter>('all');

  viewCount = computed(() => this.entries().filter(isView).length);
  actionCount = computed(() => this.entries().length - this.viewCount());
  /** Le filtre ne s'affiche que s'il y a des deux : sinon il ne changerait rien. */
  showFilter = computed(() => this.viewCount() > 0 && this.actionCount() > 0);

  filteredEntries = computed(() => {
    const entries = this.entries();
    if (!this.showFilter()) return entries;
    switch (this.filter()) {
      case 'actions': return entries.filter(entry => !isView(entry));
      case 'views': return entries.filter(isView);
      default: return entries;
    }
  });

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

  setFilter(filter: HistoryFilter) {
    this.filter.set(filter);
    this.expanded.set(false);
  }

  filterCount(filter: HistoryFilter): number {
    switch (filter) {
      case 'actions': return this.actionCount();
      case 'views': return this.viewCount();
      default: return this.entries().length;
    }
  }

  visibleEntries(): AuditEntry[] {
    const entries = this.filteredEntries();
    return this.expanded() ? entries : entries.slice(0, COLLAPSED_COUNT);
  }
}
