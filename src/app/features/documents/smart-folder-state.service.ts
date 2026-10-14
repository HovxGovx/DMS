import { Injectable, computed, inject, signal } from '@angular/core';
import { HierarchyNode } from './hierarchy.model';
import { SmartFolderApiService } from './smart-folder-api.service';
import { SmartFolderNode } from './smart-folder.model';
import { DocumentStateService } from './document-state.service';
import { fromFolderDocument, fromLifecycleDocument } from './document.mapper';
import { LifecycleDocumentService } from '../validation/lifecycle-document.service';

const ROOT_KEY = 'root';
/** Dossier virtuel des contributeurs : ce qu'ils ont importé, quel que soit le statut. */
export const MY_IMPORTS_FOLDER_ID = 'my-imports';
const MY_IMPORTS_LABEL = 'Mes imports';
const PAGE_SIZE = 100;

@Injectable({ providedIn: 'root' })
export class SmartFolderStateService {
  private api = inject(SmartFolderApiService);
  private documentState = inject(DocumentStateService);
  private lifecycleService = inject(LifecycleDocumentService);

  private childrenByParent = signal<Map<string, SmartFolderNode[]>>(new Map());
  expandedIds = signal<Set<string>>(new Set());
  selectedFolderId = signal<string | null>(null);
  isLoadingTree = signal(false);
  treeError = signal<string | null>(null);
  /** Nombre de documents dans « Mes imports » (null tant qu'il n'est pas chargé). */
  myImportsCount = signal<number | null>(null);

  private nodesById = computed(() => {
    const map = new Map<string, SmartFolderNode>();
    for (const nodes of this.childrenByParent().values()) {
      nodes.forEach(node => map.set(node.id, node));
    }
    return map;
  });
  currentPathNodes = computed<{ id: string; name: string }[]>(() => {
    if (this.selectedFolderId() === MY_IMPORTS_FOLDER_ID) {
      return [{ id: MY_IMPORTS_FOLDER_ID, name: MY_IMPORTS_LABEL }];
    }
    const byId = this.nodesById();
    const path: { id: string; name: string }[] = [];
    let node = byId.get(this.selectedFolderId() ?? '');
    while (node) {
      path.unshift({ id: node.id, name: node.name });
      node = node.parentId ? byId.get(node.parentId) : undefined;
    }
    return path;
  });

  currentPath = computed<string[]>(() => this.currentPathNodes().map(node => node.name));


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
      error: () => {
        this.isLoadingTree.set(false);
        this.treeError.set("Impossible de charger les dossiers.");
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

    // À appeler après une action qui change le contenu des dossiers (ex : validation d'un document).
    // silent : recharge sans indicateur de chargement ni message d'erreur (retour sur l'onglet)
    refresh(reloadDocuments = true, silent = false) {
      Array.from(this.childrenByParent().keys()).forEach(key => {
        this.api.getChildren(key === ROOT_KEY ? null : key).subscribe({
          next: nodes => this.setChildren(key, nodes)
        });
      });
      const selected = this.selectedFolderId();
      if (reloadDocuments && selected) {
        this.loadDocuments(selected, silent);
      } else if (silent && selected !== MY_IMPORTS_FOLDER_ID && this.myImportsCount() !== null) {
        // Le compteur de « Mes imports » n'est pas rechargé avec le dossier ouvert
        this.loadMyImports(true);
      }
    }

    // Déplie un dossier pour que son contenu soit visible (ex : après y avoir créé un sous-dossier)
    reveal(id: string) {
      if (!this.expandedIds().has(id)) {
        this.expand(id);
      }
    }

    /** Déplie tous les dossiers du chemin (racine en premier) puis ouvre le dernier. */
    revealPath(folderIds: string[]) {
      if (!folderIds.length) return;
      folderIds.slice(0, -1).forEach(id => this.reveal(id));
      this.selectFolder(folderIds[folderIds.length - 1]);
    }

    afterDelete(deletedId: string, parentId: string | null) {
      const wasInPath = this.currentPathNodes().some(node => node.id === deletedId);
      this.childrenByParent.update(map => {
        const next = new Map(map);
        next.delete(deletedId);
        return next;
      });
      this.expandedIds.update(set => {
        const next = new Set(set);
        next.delete(deletedId);
        return next;
      });

      if (wasInPath) {
        const fallback = parentId ?? this.childrenByParent().get(ROOT_KEY)?.[0]?.id ?? null;
        if (fallback) {
          this.selectFolder(fallback);
        } else {
          this.selectedFolderId.set(null);
        }
        this.refresh(false);
      } else {
        this.refresh();
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

  /** Recharge « Mes imports » (compteur, et tableau s'il est ouvert), par exemple après un import. */
  loadMyImports(silent = false) {
    const isOpen = this.selectedFolderId() === MY_IMPORTS_FOLDER_ID;
    if (isOpen && !silent) {
      this.documentState.isLoadingPublished.set(true);
      this.documentState.publishedLoadError.set(null);
    }
    this.lifecycleService.getMine().subscribe({
      next: docs => {
        this.myImportsCount.set(docs.length);
        if (this.selectedFolderId() !== MY_IMPORTS_FOLDER_ID) return;
        this.documentState.publishedDocuments.set(docs.map(fromLifecycleDocument));
        this.documentState.isLoadingPublished.set(false);
      },
      error: () => {
        if (this.selectedFolderId() !== MY_IMPORTS_FOLDER_ID || silent) return;
        this.documentState.isLoadingPublished.set(false);
        this.documentState.publishedLoadError.set('Impossible de charger vos imports.');
      }
    });
  }

  private loadDocuments(id: string, silent = false) {
    if (id === MY_IMPORTS_FOLDER_ID) {
      this.loadMyImports(silent);
      return;
    }
    if (!silent) {
      this.documentState.isLoadingPublished.set(true);
      this.documentState.publishedLoadError.set(null);
    }

    this.api.getDocuments(id, 0, PAGE_SIZE).subscribe({
      next: page => {
        if (this.selectedFolderId() !== id) return;
        this.documentState.publishedDocuments.set(page.content.map(fromFolderDocument));
        this.documentState.isLoadingPublished.set(false);
      },
      error: () => {
        if (this.selectedFolderId() !== id || silent) return;
        this.documentState.isLoadingPublished.set(false);
        this.documentState.publishedLoadError.set('Impossible de charger les documents du dossier.');
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
        editable: !node.system,
        parentId: node.parentId,
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