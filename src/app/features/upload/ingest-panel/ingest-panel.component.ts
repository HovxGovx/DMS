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

    this.documentService.uploadBatch(files).subscribe({
      next: (result: BatchUploadResult) => {
        this.isUploading.set(false);
        this.showPerFileToasts(files, result.failedFiles);

        this.validationState.loadPendingImports();
        this.viewState.setView('validation');
      },
      error: (err) => {
        this.isUploading.set(false);

        const serverMessage = err.error?.message;
        this.notification.error(serverMessage ?? "Échec de l'import — vérifiez votre connexion ou réessayez.");
        console.error('Erreur upload:', err);
      }
    });
  }

  private showPerFileToasts(files: File[], failedFiles: string[]) {
    for (const file of files) {
      if (failedFiles.includes(file.name)) {
        this.notification.error(`${file.name} — échec de l'import`, 'Import');
      } else {
        this.notification.success(`${file.name} — importé avec succès`, 'Import');
      }
    }
  }

  dismissFeedback() {
    this.uploadFeedback.set(null);
  }
}
