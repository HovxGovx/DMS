import { Injectable, signal, computed, inject } from '@angular/core';
import { DocumentItem } from './document.model';
import { fromLifecycleDocument } from './document.mapper';
import { LifecycleDocumentService } from '../validation/lifecycle-document.service';
import { DocumentMetadataService, DocMetadata } from './document-metadata.service';
import { fromSearchResult } from './document.mapper';
import { SearchResult } from '../search/search-result.model';

@Injectable({ providedIn: 'root' })
export class DocumentStateService {
  private lifecycleService = inject(LifecycleDocumentService);
  private metadataService = inject(DocumentMetadataService);

  publishedDocuments = signal<DocumentItem[]>([]);
  isLoadingPublished = signal(false);
  publishedLoadError = signal<string | null>(null);
  searchResults = signal<DocumentItem[]>([]);
  isSearchMode = signal(false);
  searchResultCount = computed(() => this.searchResults().length);

  selectedDocId = signal<string | null>(null);
  documentMetadata = signal<DocMetadata | null>(null);
  isLoadingMetadata = signal(false);

  selectedDocument = computed(() => {
    const list = this.isSearchMode() ? this.searchResults() : this.publishedDocuments();
    return list.find(d => d.id === this.selectedDocId()) ?? null;
  });

  loadPublishedDocuments() {
    this.isLoadingPublished.set(true);
    this.publishedLoadError.set(null);

    this.lifecycleService.getPublished().subscribe({
      next: (docs) => {
        this.publishedDocuments.set(docs.map(fromLifecycleDocument));
        this.isLoadingPublished.set(false);
      },
      error: (err) => {
        this.isLoadingPublished.set(false);
        this.publishedLoadError.set("Impossible de charger les documents.");
        console.error('Erreur chargement documents publiés:', err);
      }
    });
  }

  selectDocument(id: string) {
    this.selectedDocId.set(id);
    this.loadMetadataFor(id);
  }

  private loadMetadataFor(id: string) {
    this.documentMetadata.set(null);
    this.isLoadingMetadata.set(true);

    this.metadataService.getMetadata(id).subscribe({
      next: (metadata) => {
        this.documentMetadata.set(metadata);
        this.isLoadingMetadata.set(false);
      },
      error: () => {
        this.documentMetadata.set(null);
        this.isLoadingMetadata.set(false);
      }
    });
  }
  setSearchResults(results: SearchResult[]) {
    this.searchResults.set(results.map(fromSearchResult));
    this.isSearchMode.set(true);
    this.selectedDocId.set(null);
    this.documentMetadata.set(null);
  }

  clearSearch() {
    this.isSearchMode.set(false);
    this.searchResults.set([]);
  }
}