import { Component, signal, inject } from '@angular/core';
import { LifecycleDocumentService } from '../../validation/lifecycle-document.service';
import { ValidationStateService } from '../../validation/validation-state.service';
import { ViewStateService } from '../../../core/view-state.service';
import { BatchUploadResult } from '../../validation/lifecycle-document.model';
import { NotificationService } from '../../../core/notification.service';
import { AuthService } from '../../../core/auth.service';
import { SmartFolderStateService } from '../../documents/smart-folder-state.service';
@Component({
  selector: 'app-ingest-panel',
  standalone: true,
  templateUrl: './ingest-panel.component.html'
})
export class IngestPanelComponent {
  private documentService = inject(LifecycleDocumentService);
  private validationState = inject(ValidationStateService);
  private viewState = inject(ViewStateService);
  private notification = inject(NotificationService);
  private authService = inject(AuthService);
  private folderState = inject(SmartFolderStateService);

  isDragOver = signal(false);
  isUploading = signal(false);

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragOver.set(false);
    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.handleFiles(files);
    }
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFiles(input.files);
      input.value = ''; // permet de resélectionner les mêmes fichiers plus tard si besoin
    }
  }

  private handleFiles(fileList: FileList) {
    const files = Array.from(fileList);
    this.isUploading.set(true);

    this.documentService.uploadBatch(files).subscribe({
      next: (result: BatchUploadResult) => {
        this.isUploading.set(false);
        this.showSummaryToasts(files, result.failedFiles);

        // Seul un validateur publie : lui seul est emmené vers la file « À publier »
        if (this.authService.hasRole('VALIDATOR')) {
          this.validationState.loadPendingImports();
          this.viewState.setView('validation');
        } else {
          this.folderState.loadMyImports();
        }
      },
      error: (err) => {
        this.isUploading.set(false);

        const serverMessage = err.error?.message;
        this.notification.error(serverMessage ?? "Échec de l'import — vérifiez votre connexion ou réessayez.");
      }
    });
  }

  // Un toast de synthèse plutôt qu'un par fichier : seuls les échecs sont nommés
  private showSummaryToasts(files: File[], failedFiles: string[]) {
    const successCount = files.filter(file => !failedFiles.includes(file.name)).length;
    if (successCount > 0) {
      const plural = successCount > 1 ? 's' : '';
      const next = this.authService.hasRole('VALIDATOR')
        ? `prêt${plural} à publier.`
        : 'en attente de publication par un validateur.';
      this.notification.success(`${successCount} fichier${plural} importé${plural} — ${next}`, 'Import');
    }
    if (failedFiles.length > 0) {
      this.notification.error(`Échec de l'import : ${failedFiles.join(', ')}`, 'Import');
    }
  }
}
