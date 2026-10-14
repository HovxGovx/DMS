import { Component, computed, input, output } from '@angular/core';
import { ValidationDetail } from '../validation-detail.model';
import { getDisplayName, getFileTypeInfo } from '../file-type.util';

@Component({
  selector: 'app-import-preview-card',
  standalone: true,
  templateUrl: './import-preview-card.component.html'
})
export class ImportPreviewCardComponent {
  document = input.required<ValidationDetail>();
  /** Demande d'affichage du document en pleine page. */
  view = output<void>();

  fileType = computed(() => getFileTypeInfo(this.document().fileName));
  displayName = computed(() => getDisplayName(this.document().fileName));

  importedAt = computed(() =>
    new Date(this.document().importDate).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    })
  );
}