import { Component, input } from '@angular/core';
import { PendingImport } from '../validation.model';

@Component({
  selector: 'app-import-preview-card',
  standalone: true,
  templateUrl: './import-preview-card.component.html'
})
export class ImportPreviewCardComponent {
  document = input.required<PendingImport>();
}