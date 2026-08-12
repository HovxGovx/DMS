import { Component, input } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { DocTag } from '../../document.model';

@Component({
  selector: 'app-document-info-card',
  standalone: true,
  imports: [TagModule],
  templateUrl: './document-info-card.component.html'
})
export class DocumentInfoCardComponent {
  name = input.required<string>();
  docId = input.required<string>();
  icon = input.required<string>();
  iconColor = input.required<string>();
  tags = input.required<DocTag[]>();
}