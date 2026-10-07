import { Component, inject, signal, computed, effect } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { DocumentToolbarComponent } from '../document-toolbar/document-toolbar.component';
import { DocumentFiltersComponent } from '../document-filters/document-filters.component';
import { DocumentTableComponent } from '../document-table/document-table.component';
import { DocumentStateService } from '../document-state.service';
import { SmartFolderStateService } from '../smart-folder-state.service';
import { DocumentItem, SEVERITY_FILTER_COLORS, TagFilterOption } from '../document.model';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [BreadcrumbComponent, DocumentToolbarComponent, DocumentFiltersComponent, DocumentTableComponent],
  templateUrl: './document-list.component.html',
  host: {
    class: 'flex flex-col h-full min-h-0'
  }
})
export class DocumentListComponent {
  state = inject(DocumentStateService);
  folderState = inject(SmartFolderStateService);

  viewMode = signal<'list' | 'grid'>('list');
  activeTagFilters = signal<string[]>([]);
  dateRange = signal<Date[] | null>(null);

  breadcrumbSegments = computed(() => {
    if (this.state.isSearchMode()) {
      return [`Résultats de recherche (${this.state.searchResultCount()})`];
    }
    const path = this.folderState.currentPath();
    return path.length ? path : ['Documents publiés'];
  });

  // Options construites à partir de ce que le tableau affiche : type du document puis tags acceptés
  tagFilterOptions = computed<TagFilterOption[]>(() => {
    const options = new Map<string, TagFilterOption>();
    for (const doc of this.state.publishedDocuments()) {
      const labels = [{ label: doc.category, severity: doc.categorySeverity }, ...doc.tags];
      for (const tag of labels) {
        if (!options.has(tag.label)) {
          options.set(tag.label, { label: tag.label, ...SEVERITY_FILTER_COLORS[tag.severity] });
        }
      }
    }
    return Array.from(options.values()).sort((a, b) => a.label.localeCompare(b.label, 'fr'));
  });

  displayedDocuments = computed(() => {
    if (this.state.isSearchMode()) {
      return this.state.searchResults();
    }
    const active = this.activeTagFilters();
    const range = this.dateRange();
    return this.state.publishedDocuments().filter(doc =>
      this.matchesTags(doc, active) && this.matchesDate(doc, range)
    );
  });

  constructor() {
    // Les options de tags changent avec le dossier : on repart de zéro pour ne pas tout masquer
    effect(() => {
      this.folderState.selectedFolderId();
      this.activeTagFilters.set([]);
    });
  }

  onBreadcrumbClick(name: string) {
    if (this.state.isSearchMode()) return;
    const node = this.folderState.currentPathNodes().find(n => n.name === name);
    if (node) {
      this.folderState.selectFolder(node.id);
    }
  }

  onDocClick(id: string) {
    this.state.selectDocument(id);
  }

  onSort() {
    console.log('Sort clicked');
  }
  onClearSearch() {
    this.state.clearSearch();
  }

  onNew() {
    console.log('New clicked');
  }

  onDateClick() {
    console.log('Date picker à ouvrir');
  }
  onOpenFile(id: string) {
    console.log('Ouvrir le fichier :', id);
    // À brancher plus tard sur un viewer de document (pas encore développé)
  }

  onEditMetadata(id: string) {
    console.log('Modifier les métadonnées :', id);
    // À brancher plus tard sur un formulaire d'édition (pas encore développé)
  }

  private matchesTags(doc: DocumentItem, active: string[]): boolean {
    if (active.length === 0) return true;
    const labels = [doc.category, ...doc.tags.map(tag => tag.label)];
    return labels.some(label => active.includes(label));
  }

  private matchesDate(doc: DocumentItem, range: Date[] | null): boolean {
    if (!range || !range[0] || !range[1] || !doc.importDate) return true;
    const from = new Date(range[0]);
    from.setHours(0, 0, 0, 0);
    const to = new Date(range[1]);
    to.setHours(23, 59, 59, 999);
    const imported = new Date(doc.importDate);
    return imported >= from && imported <= to;
  }
}