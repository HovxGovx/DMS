import { Component, input, model, output } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DocumentItem } from '../document.model';

@Component({
  selector: 'app-document-table',
  standalone: true,
  imports: [TableModule, TagModule],
  templateUrl: './document-table.component.html',
  host: {
    class: 'flex flex-col h-full min-h-0'
  }

})
export class DocumentTableComponent {
  documents = input.required<DocumentItem[]>();
  selectedDocs = model<DocumentItem[]>([]);
  rowClick = output<string>();
}