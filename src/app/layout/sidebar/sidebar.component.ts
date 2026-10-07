import { Component, OnInit, inject, signal } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { TreeNodeComponent } from './tree-node/tree-node.component';
import { HierarchyNode, NodeActionEvent } from '../../features/documents/hierarchy.model';
import { IconField } from "primeng/iconfield";
import { SmartFolderStateService } from '../../features/documents/smart-folder-state.service';
import { SmartFolderApiService } from '../../features/documents/smart-folder-api.service';
import { FolderEditorDialogComponent } from '../../features/documents/folder-editor/folder-editor-dialog/folder-editor-dialog.component';
import { NotificationService } from '../../core/notification.service';

interface EditorState {
  mode: 'create' | 'edit';
  folderId: string | null;
  parentId: string | null;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    InputTextModule,
    TreeNodeComponent,
    ConfirmDialog,
    FolderEditorDialogComponent],
  templateUrl: './sidebar.component.html',
  host: { class: 'flex flex-col flex-1 min-h-0 h-full' }
})
export class SidebarComponent implements OnInit {
  state = inject(SmartFolderStateService);
  private api = inject(SmartFolderApiService);
  private confirmation = inject(ConfirmationService);
  private notification = inject(NotificationService);

  editor = signal<EditorState | null>(null);

  totalDocs = '2,847 docs';
  totalSize = '14.2 GB';
  version = 'v3.2.1';

  ngOnInit() {
    this.state.loadRoots();
  }

  isExpanded = (key: string) => this.state.expandedIds().has(key);
  isActive = (node: HierarchyNode) => this.state.selectedFolderId() === node.key;

  onToggleExpand(key: string) {
    this.state.toggleExpand(key);
  }

  onNodeSelect(node: HierarchyNode) {
    this.state.selectFolder(node.key);
    if (node.hasChildren && !this.state.expandedIds().has(node.key)) {
      this.state.toggleExpand(node.key);
    }
  }

  openCreateAtRoot() {
    this.editor.set({ mode: 'create', folderId: null, parentId: null });
  }

  onNodeAction(event: NodeActionEvent) {
    const { node, action } = event;
    if (action === 'create') {
      this.editor.set({ mode: 'create', folderId: null, parentId: node.key });
    } else if (action === 'edit' && node.editable) {
      this.editor.set({ mode: 'edit', folderId: node.key, parentId: node.parentId ?? null });
    } else if (action === 'delete' && node.editable) {
      this.confirmDelete(node);
    }
  }

  onEditorSaved(folderId: string) {
    const editor = this.editor();
    this.editor.set(null);
    if (!editor) return;

    this.state.refresh();
    if (editor.mode === 'create') {
      if (editor.parentId) {
        this.state.reveal(editor.parentId);
      }
      this.state.selectFolder(folderId);
      this.notification.success('Le dossier a été créé.', 'Dossiers');
    } else {
      this.notification.success('Le dossier a été modifié.', 'Dossiers');
    }
  }

  private confirmDelete(node: HierarchyNode) {
    this.confirmation.confirm({
      header: 'Supprimer le dossier',
      message: `Supprimer « ${node.label} » et ses sous-dossiers ? Les documents ne sont pas supprimés.`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      accept: () => {
        this.api.delete(node.key).subscribe({
          next: () => {
            this.state.afterDelete(node.key, node.parentId ?? null);
            this.notification.success('Le dossier a été supprimé.', 'Dossiers');
          },
          error: err => this.notification.error(
            err.error?.message ?? 'Impossible de supprimer le dossier.', 'Dossiers')
        });
      }
    });
  }
}