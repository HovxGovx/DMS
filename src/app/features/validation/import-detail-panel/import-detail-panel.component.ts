import { Component, signal, inject } from '@angular/core';
import { ValidationStateService } from '../validation-state.service';
import { LifecycleDocumentService } from '../lifecycle-document.service';
import { NotificationService } from '../../../core/notification.service';
import { ViewStateService } from '../../../core/view-state.service';

@Component({
  selector: 'app-import-detail-panel',
  standalone: true,
  templateUrl: './import-detail-panel.component.html',
  host: {
    class: 'flex-1 bg-white rounded-xl border border-prussian-blue-100 p-6 flex flex-col min-h-0'
  }
})
export class ImportDetailPanelComponent {
  state = inject(ValidationStateService);
  private documentService = inject(LifecycleDocumentService);
  private notification = inject(NotificationService);
  private viewState = inject(ViewStateService);

  isPublishing = signal(false);

  onPublish() {
    const doc = this.state.selectedImport();
    if (!doc) return;

    this.isPublishing.set(true);

    this.documentService.publish(doc.id).subscribe({
      next: () => {
        this.isPublishing.set(false);
        this.notification.success(`${doc.originalFileName} a été publié.`, 'Publication');
        this.state.removeFromPending(doc.id);
        this.viewState.setView('documents');
      },
      error: (err) => {
        this.isPublishing.set(false);
        const serverMessage = err.error?.message;
        this.notification.error(serverMessage ?? `Échec de la publication de ${doc.originalFileName}.`, 'Publication');
        console.error('Erreur publication:', err);
      }
    });
  }
}