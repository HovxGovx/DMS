import { Injectable, computed, inject, signal } from '@angular/core';
import { HierarchyNode } from './hierarchy.model';
import { SmartFolderApiService } from './smart-folder-api.service';
import { SmartFolderNode } from './smart-folder.model';
import { DocumentStateService } from './document-state.service';
import { fromFolderDocument } from './document.mapper';

const ROOT_KEY = 'root';
const PAGE_SIZE = 100;

@Injectable({ providedIn: 'root' })
export class SmartFolderStateService {
  private api = inject(SmartFolderApiService);
  private documentState = inject(DocumentStateService);

  private childrenByParent = signal<Map<string, SmartFolderNode[]>>(new Map());
  expandedIds = signal<Set<string>>(new Set());
  selectedFolderId = signal<string | null>(null);
  isLoadingTree = signal(false);
  treeError = signal<string | null>(null);

  private nodesById = computed(() => {
    const map = new Map<string, SmartFolderNode>();
    for (const nodes of this.childrenByParent().values()) {
      nodes.forEach(node => map.set(node.id, node));
    }
    return map;
  });

  currentPath = computed<string[]>(() => {
    const byId = this.nodesById();
    const path: string[] = [];
    let node = byId.get(this.selectedFolderId() ?? '');
    while (node) {
      path.unshift(node.name);
      node = node.parentId ? byId.get(node.parentId) : undefined;
    }
    return path;
  });

  tree = computed<HierarchyNode[]>(() => this.buildNodes(null, []));

  loadRoots() {
    this.isLoadingTree.set(true);
    this.treeError.set(null);

    this.api.getChildren(null).subscribe({
      next: roots => {
        this.setChildren(ROOT_KEY, roots);
        this.isLoadingTree.set(false);

        if (!this.selectedFolderId() && roots.length) {
          this.selectFolder(roots[0].id);
          if (roots[0].hasChildren) {
            this.expand(roots[0].id);
          }
        }
      },
      error: err => {
        this.isLoadingTree.set(false);
        this.treeError.set("Impossible de charger les dossiers.");
        console.error('Erreur chargement dossiers:', err);
      }
    });
  }

  selectFolder(id: string) {
    this.selectedFolderId.set(id);
    this.documentState.clearSearch();
    this.loadDocuments(id);
  }

  toggleExpand(id: string) {
    if (this.expandedIds().has(id)) {
      this.expandedIds.update(set => {
        const next = new Set(set);
        next.delete(id);
        return next;
      });
    } else {
      this.expand(id);
    }
  }

  // À appeler après une action qui change le contenu des dossiers (ex : validation d'un document)
  refresh() {
    Array.from(this.childrenByParent().keys()).forEach(key => {
      this.api.getChildren(key === ROOT_KEY ? null : key).subscribe({
        next: nodes => this.setChildren(key, nodes)
      });
    });
    const selected = this.selectedFolderId();
    if (selected) {
      this.loadDocuments(selected);
    }
  }

  private expand(id: string) {
    this.expandedIds.update(set => new Set(set).add(id));
    if (!this.childrenByParent().has(id)) {
      this.api.getChildren(id).subscribe({
        next: nodes => this.setChildren(id, nodes),
        error: err => console.error('Erreur chargement sous-dossiers:', err)
      });
    }
  }

  private loadDocuments(id: string) {
    this.documentState.isLoadingPublished.set(true);
    this.documentState.publishedLoadError.set(null);

    this.api.getDocuments(id, 0, PAGE_SIZE).subscribe({
      next: page => {
        if (this.selectedFolderId() !== id) return;
        this.documentState.publishedDocuments.set(page.content.map(fromFolderDocument));
        this.documentState.isLoadingPublished.set(false);
      },
      error: err => {
        if (this.selectedFolderId() !== id) return;
        this.documentState.isLoadingPublished.set(false);
        this.documentState.publishedLoadError.set('Impossible de charger les documents du dossier.');
        console.error('Erreur chargement documents du dossier:', err);
      }
    });
  }

  private setChildren(key: string, nodes: SmartFolderNode[]) {
    this.childrenByParent.update(map => new Map(map).set(key, nodes));
  }

  private buildNodes(parentId: string | null, parentPath: string[]): HierarchyNode[] {
    const nodes = this.childrenByParent().get(parentId ?? ROOT_KEY) ?? [];
    return nodes.map(node => {
      const path = [...parentPath, node.name];
      const expanded = this.expandedIds().has(node.id);
      return {
        key: node.id,
        label: node.name,
        icon: this.iconFor(node),
        type: node.hasChildren ? 'folder' : 'leaf',
        path,
        count: node.documentCount,
        hasChildren: node.hasChildren,
        children: node.hasChildren && expanded ? this.buildNodes(node.id, path) : undefined
      } as HierarchyNode;
    });
  }

  private iconFor(node: SmartFolderNode): string {
    if (!node.parentId) {
      return node.hasChildren ? 'pi pi-sitemap' : 'pi pi-inbox';
    }
    return node.hasChildren ? 'pi pi-folder' : 'pi pi-tag';
  }
}