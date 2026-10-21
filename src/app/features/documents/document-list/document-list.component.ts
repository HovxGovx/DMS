import { Component, inject, signal, computed, effect } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { DocumentFiltersComponent } from '../document-filters/document-filters.component';
import { DocumentTableComponent } from '../document-table/document-table.component';
import { DocumentStateService } from '../document-state.service';
import { SmartFolderStateService } from '../smart-folder-state.service';
import { DocumentLocationService } from '../document-location.service';
import { DocumentItem, TagFilterOption } from '../document.model';
import { AuthService } from '../../../core/auth.service';
import { RagPanelComponent } from '../../rag/rag-panel/rag-panel.component';
import { RagStateService } from '../../rag/rag-state.service';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [BreadcrumbComponent, DocumentFiltersComponent, DocumentTableComponent, RagPanelComponent],
  templateUrl: './document-list.component.html',
  host: {
    class: 'flex flex-col h-full min-h-0'
  }
})
export class DocumentListComponent {
  state = inject(DocumentStateService);
  folderState = inject(SmartFolderStateService);
  ragState = inject(RagStateService);
  private locationService = inject(DocumentLocationService);
  private authService = inject(AuthService);

  /** Sans domaine, seuls ses propres imports sont visibles (l'admin voit tout). */
  hasNoDomain = computed(() => {
    const user = this.authService.currentUser();
    return !!user && !this.authService.hasRole('ADMIN') && !user.domainCodes?.length;
  });

  activeTagFilters = signal<string[]>([]);

  breadcrumbSegments = computed(() => {
    if (this.state.isSearchMode()) {
      const count = this.state.searchResultCount();
      const label = this.state.searchLabel();
      const what = label ? `Recherche « ${label} »` : '';
      return [`${what}  ${count} résultat${count > 1 ? 's' : ''}`];
    }
    const path = this.folderState.currentPath();
    return path.length ? path : ['Documents publiés'];
  });

  // Options construites à partir de ce que le tableau affiche : type du document puis tags acceptés
  tagFilterOptions = computed<TagFilterOption[]>(() => {
    const labels = new Set<string>();
    for (const doc of this.state.publishedDocuments()) {
      labels.add(doc.category);
      doc.tags.forEach(tag => labels.add(tag.label));
    }
    return Array.from(labels)
      .sort((a, b) => a.localeCompare(b, 'fr'))
      .map(label => ({ label }));
  });

  displayedDocuments = computed(() => {
    if (this.state.isSearchMode()) {
      return this.state.searchResults();
    }
    const active = this.activeTagFilters();
    return this.state.publishedDocuments().filter(doc => this.matchesTags(doc, active));
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
    // Un import pas encore publié n'a pas de détails consultables par son auteur
    const doc = this.state.publishedDocuments().find(d => d.id === id);
    if (doc?.status && doc.status !== 'PUBLISHED') return;
    this.state.selectDocument(id);
  }

  onRevealInFolder(id: string) {
    this.locationService.revealInFolder(id);
  }

  onClearSearch() {
    this.state.clearSearch();
  }

  private matchesTags(doc: DocumentItem, active: string[]): boolean {
    if (active.length === 0) return true;
    const labels = [doc.category, ...doc.tags.map(tag => tag.label)];
    return labels.some(label => active.includes(label));
  }
}