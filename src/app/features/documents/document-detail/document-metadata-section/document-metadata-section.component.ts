import { Component, input } from '@angular/core';
import { MetadataItem } from '../../document.model';

@Component({
  selector: 'app-document-metadata-section',
  standalone: true,
  templateUrl: './document-metadata-section.component.html'
})
export class DocumentMetadataSectionComponent {
  title = input.required<string>();
  items = input.required<MetadataItem[]>();
}