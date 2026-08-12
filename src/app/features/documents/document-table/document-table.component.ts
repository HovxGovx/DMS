import { Component, input, model } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DocumentRow } from '../document.model';

@Component({
  selector: 'app-document-table',
  standalone: true,
  imports: [TableModule, TagModule],
  templateUrl: './document-table.component.html'
})
export class DocumentTableComponent {
  documents = input.required<DocumentRow[]>();
  selectedDocs = model<DocumentRow[]>([]);
}