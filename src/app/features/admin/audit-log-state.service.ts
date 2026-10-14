import { Injectable, computed, inject, signal } from '@angular/core';
import { AuditService } from '../audit/audit.service';
import { AuditEntry, AuditFilter } from '../audit/audit.model';

const PAGE_SIZE = 50;

const EMPTY_FILTER: AuditFilter = { actorId: null, action: null, fromDay: null, toDay: null };

/** Journal d'audit de l'administration : filtres, page courante, résultats. */
@Injectable({ providedIn: 'root' })
export class AuditLogStateService {
  private auditService = inject(AuditService);

  readonly pageSize = PAGE_SIZE;

  filter = signal<AuditFilter>(EMPTY_FILTER);
  page = signal(0);
  entries = signal<AuditEntry[]>([]);
  total = signal(0);
  isLoading = signal(false);
  loadError = signal<string | null>(null);

  pageCount = computed(() => Math.max(1, Math.ceil(this.total() / PAGE_SIZE)));
  hasFilter = computed(() => Object.values(this.filter()).some(value => !!value));

  /** Change un filtre et revient à la première page. */
  updateFilter(change: Partial<AuditFilter>) {
    this.filter.update(filter => ({ ...filter, ...change }));
    this.load(0);
  }

  clearFilter() {
    this.filter.set(EMPTY_FILTER);
    this.load(0);
  }

  load(page = this.page()) {
    this.isLoading.set(true);
    this.loadError.set(null);
    this.auditService.search(this.filter(), page, PAGE_SIZE).subscribe({
      next: result => {
        this.entries.set(result.content);
        this.total.set(result.total);
        this.page.set(result.page);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.loadError.set("Impossible de charger le journal d'audit.");
      }
    });
  }
}
