import { Component, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'IngestPanel',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './ingest-panel.component.html'
})
export class IngestPanelComponent {
  isDragOver = signal(false);

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
    }
  }

  private handleFiles(files: FileList) {
    // Pour l'instant on log juste, le vrai traitement viendra avec le service d'upload
    console.log('Fichiers reçus :', Array.from(files).map(f => f.name));
  }
}
