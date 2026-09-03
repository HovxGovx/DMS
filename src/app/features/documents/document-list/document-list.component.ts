import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { DocumentToolbarComponent } from '../document-toolbar/document-toolbar.component';
import { DocumentFiltersComponent } from '../document-filters/document-filters.component';
import { DocumentTableComponent } from '../document-table/document-table.component';
import { DocumentStateService } from '../document-state.service';
import { TagFilterOption } from '../document.model';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [BreadcrumbComponent, DocumentToolbarComponent, DocumentFiltersComponent, DocumentTableComponent],
  templateUrl: './document-list.component.html',
  host: {
    class: 'flex flex-col h-full min-h-0'
  }
})
export class DocumentListComponent implements OnInit {
  state = inject(DocumentStateService);

  // breadcrumbSegments = ['Documents publiés'];

  viewMode = signal<'list' | 'grid'>('list');
  activeTagFilters = signal<string[]>([]);

  tagFilterOptions: TagFilterOption[] = [
    { label: 'Publié', dotColor: 'bg-emerald-500', textColor: 'text-emerald-600', borderColor: 'border-emerald-300', bgActive: 'bg-emerald-50' }
  ];
  breadcrumbSegments = computed(() =>
    this.state.isSearchMode()
      ? [`Résultats de recherche (${this.state.searchResultCount()})`]
      : ['Documents publiés']
  );
  displayedDocuments = computed(() => {
    if (this.state.isSearchMode()) {
      return this.state.searchResults();
    }

    const active = this.activeTagFilters();
    const docs = this.state.publishedDocuments();
    if (active.length === 0) return docs;
    return docs.filter(doc => doc.tags.some(t => active.includes(t.label)));
  });

  filteredDocuments = computed(() => {
    const active = this.activeTagFilters();
    const docs = this.state.publishedDocuments();

    if (active.length === 0) return docs;

    return docs.filter(doc => doc.tags.some(t => active.includes(t.label)));
  });

  ngOnInit() {
    this.state.loadPublishedDocuments();
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
}
