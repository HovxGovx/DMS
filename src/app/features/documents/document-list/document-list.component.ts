import { Component, inject, signal, computed, effect } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { DocumentToolbarComponent } from '../document-toolbar/document-toolbar.component';
import { DocumentFiltersComponent } from '../document-filters/document-filters.component';
import { DocumentTableComponent } from '../document-table/document-table.component';
import { DocumentStateService } from '../document-state.service';

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

  viewMode = signal<'list' | 'grid'>('list');
  activeTagFilters = signal<string[]>([]);

  // Documents du dossier courant, filtrés par les tags actifs
  filteredDocuments = computed(() => {
    const active = this.activeTagFilters();
    const docs = this.state.currentDocuments();

    if (active.length === 0) return docs;

    return docs.filter(doc => doc.tags.some(t => active.includes(t.label)));
  });

  constructor() {
    // Réinitialise les tags actifs quand on change de dossier —
    // évite de garder un filtre sur un tag qui n'existe plus dans le nouveau dossier
    effect(() => {
      this.state.currentFilesKey();
      this.activeTagFilters.set([]);
    });
  }

  onDocClick(id: string) {
    this.state.selectDocument(id);
  }

  onSort() {
    console.log('Sort clicked');
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