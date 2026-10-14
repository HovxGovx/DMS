import { Injectable, inject, signal } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { DocumentStateService } from './document-state.service';
import { SmartFolderStateService } from './smart-folder-state.service';
import { LifecycleDocumentService } from '../validation/lifecycle-document.service';
import { ValidationStateService } from '../validation/validation-state.service';
import { NotificationService } from '../../core/notification.service';

/**
 * Retrait de la consultation d'un document depuis le tableau ou le panneau de détails :
 * retire le document de la recherche et des dossiers ; il revient dans « À publier ».
 */
@Injectable({ providedIn: 'root' })
export class DocumentUnpublishService {
  private confirmation = inject(ConfirmationService);
  private lifecycleService = inject(LifecycleDocumentService);
  private documentState = inject(DocumentStateService);
  private folderState = inject(SmartFolderStateService);
  private validationState = inject(ValidationStateService);
  private notification = inject(NotificationService);

  /** Document en cours de retrait (null = aucun). */
  readonly unpublishingId = signal<string | null>(null);

  unpublish(docId: string, name: string) {
    this.confirmation.confirm({
      header: 'Retrait de la consultation',
      message: `Retirer « ${name} » de la consultation ? Il ne sera plus visible ni trouvable, et reviendra dans « À publier ».`,
      icon: 'pi pi-eye-slash',
      acceptIcon: 'pi pi-eye-slash',
      acceptLabel: 'Retirer',
      rejectLabel: 'Annuler',
      accept: () => {
        this.unpublishingId.set(docId);
        this.lifecycleService.unpublish(docId).subscribe({
          next: () => {
            this.unpublishingId.set(null);
            this.documentState.removeDocument(docId);
            this.folderState.refresh(false);
            this.validationState.loadPendingImports();
            this.notification.success('Le document a été retiré de la consultation.', 'Publication');
          },
          error: (err) => {
            this.unpublishingId.set(null);
            this.notification.error(err.error?.message ?? 'Impossible de retirer le document.', 'Publication');
          }
        });
      }
    });
  }
}
