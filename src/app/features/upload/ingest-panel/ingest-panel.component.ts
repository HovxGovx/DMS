import { Component, signal, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { LifecycleDocumentService } from '../../validation/lifecycle-document.service';
import { ValidationStateService } from '../../validation/validation-state.service';
import { ViewStateService } from '../../../core/view-state.service';
import { BatchUploadResult } from '../../validation/lifecycle-document.model';
import { NotificationService } from '../../../core/notification.service';
@Component({
  selector: 'IngestPanel',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './ingest-panel.component.html'
})
export class IngestPanelComponent {
  private documentService = inject(LifecycleDocumentService);
  private validationState = inject(ValidationStateService);
  private viewState = inject(ViewStateService);
  private notification = inject(NotificationService);

  isDragOver = signal(false);
  isUploading = signal(false);
  uploadFeedback = signal<{ success: boolean; message: string; failedFiles: string[] } | null>(null);


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
    this.uploadFeedback.set(null);

    this.documentService.uploadBatch(files).subscribe({
      next: (result: BatchUploadResult) => {
        this.isUploading.set(false);
        if (result.failureCount === 0) {
          this.notification.success(`${result.successCount} fichier(s) importé(s) avec succès.`);
        } else {
          this.notification.warn(
            `${result.successCount} importé(s), ${result.failureCount} échec(s) : ${result.failedFiles.join(', ')}`
          );
        }


        // Rafraîchit la liste des imports en attente et bascule sur la vue validation
        this.validationState.loadPendingImports();
        this.viewState.setView('validation');
      },
      error: (err) => {
        this.isUploading.set(false);
        this.notification.error("Échec de l'import");
        console.error('Erreur upload:', err);
      }
    });
  }

  dismissFeedback() {
    this.uploadFeedback.set(null);
  }
}
