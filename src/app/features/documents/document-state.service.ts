import { Injectable, signal, computed } from '@angular/core';
import { DOCUMENTS_BY_FOLDER } from './document-data';

@Injectable({ providedIn: 'root' })
export class DocumentStateService {
  private documentsByFolder = DOCUMENTS_BY_FOLDER;

  expandedKeys = signal<Set<string>>(new Set(['corporate', 'departments', 'finance']));
  currentPath = signal<string[]>(['Corporate', 'Departments', 'Finance', 'Invoices']);
  currentFilesKey = signal<string>('finance_invoices');
  selectedDocId = signal<string | null>(null);

  currentDocuments = computed(() => this.documentsByFolder[this.currentFilesKey()] ?? []);

  selectedDocument = computed(() =>
    this.currentDocuments().find(d => d.id === this.selectedDocId()) ?? null
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
  }
}