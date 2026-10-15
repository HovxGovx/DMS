import { Component, signal, inject } from '@angular/core';
import { LifecycleDocumentService } from '../../validation/lifecycle-document.service';
import { ValidationStateService } from '../../validation/validation-state.service';
import { ViewStateService } from '../../../core/view-state.service';
import { BatchUploadResult } from '../../validation/lifecycle-document.model';
import { NotificationService } from '../../../core/notification.service';
import { AuthService } from '../../../core/auth.service';
import { SmartFolderStateService } from '../../documents/smart-folder-state.service';
import {
  ACCEPT_ATTRIBUTE, MAX_BATCH_SIZE_MB, MAX_FILE_SIZE_MB,
  isAllowedFormat, isBatchTooLarge, isFileTooLarge, toMegabytes, totalSize
} from '../upload-limits';
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
  readonly maxFileSizeMb = MAX_FILE_SIZE_MB;
  readonly acceptedExtensions = ACCEPT_ATTRIBUTE;

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
    const files = this.withoutTooLargeFiles(this.withoutUnsupportedFiles(Array.from(fileList)));
    if (files.length === 0) {
      return;
    }
    if (isBatchTooLarge(files)) {
      this.notification.error(
        `Import trop volumineux : ${toMegabytes(totalSize(files))} Mo au total, ${MAX_BATCH_SIZE_MB} Mo maximum. Importez les fichiers en plusieurs fois.`,
        'Import');
      return;
    }
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

        // Un 413 renvoyé par nginx n'a pas de corps JSON : on rappelle les limites nous-mêmes
        const serverMessage = err.error?.message;
        const fallback = err.status === 413
          ? `Import trop volumineux : ${MAX_FILE_SIZE_MB} Mo maximum par fichier, ${MAX_BATCH_SIZE_MB} Mo par import.`
          : "Échec de l'import — vérifiez votre connexion ou réessayez.";
        this.notification.error(serverMessage ?? fallback);
      }
    });
  }

  // Le glisser-déposer ignore l'attribut accept : les formats refusés par le backend sont écartés et nommés ici
  private withoutUnsupportedFiles(files: File[]): File[] {
    const unsupported = files.filter(file => !isAllowedFormat(file));
    if (unsupported.length > 0) {
      const plural = unsupported.length > 1 ? 's' : '';
      this.notification.error(
        `Format${plural} non accepté${plural} (PDF et documents bureautiques seulement) : ${unsupported.map(file => file.name).join(', ')}`,
        'Import');
    }
    return files.filter(isAllowedFormat);
  }

  // Les fichiers trop gros sont écartés et nommés ; les autres partent quand même
  private withoutTooLargeFiles(files: File[]): File[] {
    const tooLarge = files.filter(isFileTooLarge);
    if (tooLarge.length > 0) {
      const plural = tooLarge.length > 1 ? 's' : '';
      this.notification.error(
        `Fichier${plural} trop volumineux (${MAX_FILE_SIZE_MB} Mo maximum) : ${tooLarge.map(file => file.name).join(', ')}`,
        'Import');
    }
    return files.filter(file => !isFileTooLarge(file));
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
