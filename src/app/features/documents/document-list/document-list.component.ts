import { Component, inject, signal } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { DocumentToolbarComponent } from '../document-toolbar/document-toolbar.component';
import { DocumentFiltersComponent } from '../document-filters/document-filters.component';
import { DocumentTableComponent } from '../document-table/document-table.component';
import { DocumentStateService } from '../document-state.service';
import { TagFilterOption } from '../document.model';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [BreadcrumbComponent, DocumentToolbarComponent, DocumentFiltersComponent, DocumentTableComponent],
  templateUrl: './document-list.component.html'
})
export class DocumentListComponent {
  state = inject(DocumentStateService);

  viewMode = signal<'list' | 'grid'>('list');
  activeTagFilters = signal<string[]>([]);

  tagFilterOptions: TagFilterOption[] = [
    { label: 'Verified', dotColor: 'bg-emerald-500', textColor: 'text-emerald-600', borderColor: 'border-emerald-300', bgActive: 'bg-emerald-50' },
    { label: 'Pending', dotColor: 'bg-orange-500', textColor: 'text-orange-600', borderColor: 'border-orange-300', bgActive: 'bg-orange-50' },
    { label: 'Contract', dotColor: 'bg-prussian-blue-500', textColor: 'text-prussian-blue-600', borderColor: 'border-prussian-blue-300', bgActive: 'bg-prussian-blue-50' }
  ];

  onDocClick(id: string) {
    this.state.selectDocument(id);
  }

  onSort() {
    console.log('Sort clicked');
  }

  onNew() {
    console.log('New clicked');
  }

  onDateClick() {
    console.log('Date picker à ouvrir');
  }
}