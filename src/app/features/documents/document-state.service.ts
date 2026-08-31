import { Injectable, signal, computed, inject } from '@angular/core';
import { DOCUMENTS_BY_FOLDER } from './document-data';
import { TagFilterOption, SEVERITY_FILTER_COLORS, DocumentItem } from './document.model';
import { fromLifecycleDocument } from './document.mapper';

import { LifecycleDocumentService } from '../validation/lifecycle-document.service';
import { DocumentMetadataService, DocMetadata } from './document-metadata.service';

@Injectable({ providedIn: 'root' })
export class DocumentStateService {
  private documentsByFolder = DOCUMENTS_BY_FOLDER;
  private lifecycleService = inject(LifecycleDocumentService);
  private metadataService = inject(DocumentMetadataService);
  documentMetadata = signal<DocMetadata | null>(null);
  isLoadingMetadata = signal(false);

  publishedDocuments = signal<DocumentItem[]>([]);
  isLoadingPublished = signal(false);
  publishedLoadError = signal<string | null>(null);

  private loadMetadataFor(id: string) {
    this.documentMetadata.set(null);
    this.isLoadingMetadata.set(true);

    this.metadataService.getMetadata(id).subscribe({
      next: (metadata) => {
        this.documentMetadata.set(metadata);
        this.isLoadingMetadata.set(false);
      },
      error: () => {
        // Pas de métadonnées disponibles pour ce document — pas grave, on garde les valeurs par défaut
        this.documentMetadata.set(null);
        this.isLoadingMetadata.set(false);
      }
    });
  }
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

  expandedKeys = signal<Set<string>>(new Set(['corporate', 'departments', 'finance']));
  currentPath = signal<string[]>(['Corporate', 'Departments', 'Finance', 'Invoices']);
  currentFilesKey = signal<string>('finance_invoices');
  selectedDocId = signal<string | null>(null);

  currentDocuments = computed(() => this.documentsByFolder[this.currentFilesKey()] ?? []);

  // Tags uniques réellement présents dans les documents du dossier actuel
  availableTagFilters = computed<TagFilterOption[]>(() => {
    const map = new Map<string, TagFilterOption>();
    for (const doc of this.currentDocuments()) {
      for (const tag of doc.tags) {
        if (!map.has(tag.label)) {
          map.set(tag.label, { label: tag.label, ...SEVERITY_FILTER_COLORS[tag.severity] });
        }
      }
    }
    return Array.from(map.values());
  });

  selectedDocument = computed(() =>
    this.publishedDocuments().find(d => d.id === this.selectedDocId()) ?? null
  );

  getCount(filesKey: string): number {
    return this.documentsByFolder[filesKey]?.length ?? 0;
  }

  navigateTo(path: string[], filesKey: string) {
    this.currentPath.set(path);
    this.currentFilesKey.set(filesKey);
    this.selectedDocId.set(null);
  }

  toggleExpand(key: string) {
    this.expandedKeys.update(set => {
      const next = new Set(set);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  isExpanded(key: string): boolean {
    return this.expandedKeys().has(key);
  }

  selectDocument(id: string) {
    this.selectedDocId.set(id);
    this.loadMetadataFor(id);
  }
}
