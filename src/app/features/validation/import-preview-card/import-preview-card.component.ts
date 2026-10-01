import { Component, computed, input } from '@angular/core';
import { ValidationDetail } from '../validation-detail.model';
import { getFileTypeInfo } from '../file-type.util';

@Component({
  selector: 'app-import-preview-card',
  standalone: true,
  templateUrl: './import-preview-card.component.html'
})
export class ImportPreviewCardComponent {
  document = input.required<ValidationDetail>();

  fileType = computed(() => getFileTypeInfo(this.document().fileName));

  importedAt = computed(() =>
    new Date(this.document().importDate).toLocaleString('fr-FR', {
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
    })
  );
}