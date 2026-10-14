import { Component, ElementRef, effect, inject, OnInit } from '@angular/core';
import { ValidationStateService } from '../validation-state.service';
import { getDisplayName, getFileTypeInfo } from '../file-type.util';
@Component({
  selector: 'app-import-queue-list',
  standalone: true,
  templateUrl: './import-queue-list.component.html',
  host: {
    class: 'flex flex-col flex-1 min-h-0 h-full'
  }
})
export class ImportQueueListComponent implements OnInit {
  state = inject(ValidationStateService);
  private elementRef = inject(ElementRef<HTMLElement>);

  constructor() {
    // Garde le document sélectionné visible (navigation clavier, passage au suivant après publication)
    effect(() => {
      const id = this.state.selectedImportId();
      if (!id) return;
      queueMicrotask(() => {
        const row = (this.elementRef.nativeElement as HTMLElement).querySelector(`[data-id="${id}"]`);
        row?.scrollIntoView({ block: 'nearest' });
      });
    });
  }

  ngOnInit() {
    this.state.loadPendingImports();
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    });
  }
  fileIcon(fileName: string): string {
    return getFileTypeInfo(fileName).icon;
  }

  displayName(fileName: string): string {
    return getDisplayName(fileName);
  }
  fileColor(fileName: string): string {
    return getFileTypeInfo(fileName).color;
  }
}
