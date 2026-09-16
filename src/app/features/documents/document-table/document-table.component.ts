import { Component, input, model, output, inject } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { DocumentItem } from '../document.model';
import { Router } from '@angular/router';

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
  private router = inject(Router);
  documents = input.required<DocumentItem[]>();
  selectedDocs = model<DocumentItem[]>([]);

  rowClick = output<string>();
  editMetadata = output<string>();
  openFile(id: string) {
    this.router.navigate(['/documents', id, 'editor']);
  }
}