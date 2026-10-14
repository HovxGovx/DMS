import { Component, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { FailedDocumentsStateService } from '../failed-documents-state.service';
import { AdminDocumentService } from '../admin-document.service';
import { FailedDocument, FailedStatus } from '../failed-document.model';
import { DocumentValidationService } from '../../validation/document-validation.service';
import { ValidationStateService } from '../../validation/validation-state.service';
import { SmartFolderStateService } from '../../documents/smart-folder-state.service';
import { NotificationService } from '../../../core/notification.service';
import { getFileTypeInfo } from '../../validation/file-type.util';

const STATUS_LABELS: Record<FailedStatus, string> = {
  EXTRACTION_FAILED: 'Extraction',
  INDEXING_FAILED: 'Indexation'
};

@Component({
  selector: 'app-failed-documents-panel',
  standalone: true,
  templateUrl: './failed-documents-panel.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0'
  }
})
export class FailedDocumentsPanelComponent {
  state = inject(FailedDocumentsStateService);
  private adminDocumentService = inject(AdminDocumentService);
  private validationService = inject(DocumentValidationService);
  private validationState = inject(ValidationStateService);
  private folderState = inject(SmartFolderStateService);
  private notification = inject(NotificationService);
  private confirmation = inject(ConfirmationService);

  readonly statusLabels = STATUS_LABELS;
  readonly fileType = getFileTypeInfo;

  /** Documents dont une relance ou une suppression est en cours. */
  busyIds = signal<ReadonlySet<string>>(new Set());

  isBusy(doc: FailedDocument): boolean {
    return this.busyIds().has(doc.id);
  }

  formatDate(iso: string | null): string {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  }

  /** Seul un document jamais publié se supprime (règle du backend) : c'est le cas d'un échec d'extraction. */
  canDelete(doc: FailedDocument): boolean {
    return doc.status === 'EXTRACTION_FAILED';
  }

  onRetry(doc: FailedDocument) {
    if (this.isBusy(doc)) return;
    this.setBusy(doc.id, true);
    this.adminDocumentService.retry(doc.id).subscribe({
      next: result => {
        this.setBusy(doc.id, false);
        this.state.remove(doc.id);
        if (result.status === 'PUBLISHED') {
          this.notification.success(`« ${this.displayName(doc)} » est de nouveau publié.`, 'Administration');
          this.folderState.refresh();
        } else {
          this.notification.success(`« ${this.displayName(doc)} » a été extrait : il attend sa publication.`, 'Administration');
          this.validationState.loadPendingImports();
        }
      },
      error: err => {
        this.setBusy(doc.id, false);
        this.notification.error(err.error?.message ?? `Nouvel échec pour « ${this.displayName(doc)} ».`, 'Administration');
        // Le document a pu changer entre-temps (déjà relancé, supprimé) : on repart de l'état du serveur
        this.state.loadFailed();
      }
    });
  }

  onDelete(doc: FailedDocument) {
    if (this.isBusy(doc) || !this.canDelete(doc)) return;

    this.confirmation.confirm({
      header: 'Suppression',
      message: `Supprimer « ${this.displayName(doc)} » définitivement ?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Supprimer',
      rejectLabel: 'Annuler',
      accept: () => {
        this.setBusy(doc.id, true);
        this.validationService.deleteDocument(doc.id).subscribe({
          next: () => {
            this.setBusy(doc.id, false);
            this.state.remove(doc.id);
            this.notification.success('Le document a été supprimé.', 'Administration');
          },
          error: err => {
            this.setBusy(doc.id, false);
            this.notification.error(err.error?.message ?? 'Impossible de supprimer le document.', 'Administration');
          }
        });
      }
    });
  }

  displayName(doc: FailedDocument): string {
    return doc.title || doc.fileName;
  }

  private setBusy(id: string, busy: boolean) {
    this.busyIds.update(ids => {
      const next = new Set(ids);
      if (busy) next.add(id); else next.delete(id);
      return next;
    });
  }
}
