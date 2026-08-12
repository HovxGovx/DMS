import { Component, signal } from '@angular/core';
import { BreadcrumbComponent } from '../../../shared/breadcrumb/breadcrumb.component';
import { DocumentToolbarComponent } from '../document-toolbar/document-toolbar.component';
import { DocumentFiltersComponent } from '../document-filters/document-filters.component';
import { DocumentTableComponent } from '../document-table/document-table.component';
import { DocumentRow, TagFilterOption } from '../document.model';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [BreadcrumbComponent, DocumentToolbarComponent, DocumentTableComponent, DocumentFiltersComponent],
  templateUrl: './document-list.component.html'
})
export class DocumentListComponent {
  breadcrumb = ['Corporate', 'Departments', 'Finance', 'Reports'];
  viewMode = signal<'list' | 'grid'>('list');
  activeTagFilters = signal<string[]>([]);

  tagFilterOptions: TagFilterOption[] = [
    { label: 'Verified', dotColor: 'bg-emerald-500', textColor: 'text-emerald-600', borderColor: 'border-emerald-300', bgActive: 'bg-emerald-50' },
    { label: 'Pending', dotColor: 'bg-orange-500', textColor: 'text-orange-600', borderColor: 'border-orange-300', bgActive: 'bg-orange-50' },
    { label: 'Contract', dotColor: 'bg-prussian-blue-500', textColor: 'text-prussian-blue-600', borderColor: 'border-prussian-blue-300', bgActive: 'bg-prussian-blue-50' }
  ];
  documents = signal<DocumentRow[]>([
    {
      id: '1',
      name: 'FY2025_Annual_Report.pdf',
      icon: 'pi pi-file-pdf',
      iconColor: 'text-red-500',
      locked: true,
      tags: [
        { label: 'Report', severity: 'secondary' },
        { label: 'Verified', severity: 'success' },
        { label: 'Confidential', severity: 'info' }
      ],
      modified: '6h ago',
      modifiedDotColor: 'bg-prussian-blue-500',
      size: '4.8 MB'
    },
    {
      id: '2',
      name: 'Q4_Cashflow_Analysis.xlsx',
      icon: 'pi pi-file-excel',
      iconColor: 'text-green-600',
      tags: [
        { label: 'Report', severity: 'secondary' },
        { label: 'Verified', severity: 'success' }
      ],
      modified: 'Yesterday',
      modifiedDotColor: 'bg-prussian-blue-500',
      size: '892 KB'
    },
    {
      id: '3',
      name: 'Board_Summary_Jan2026.docx',
      icon: 'pi pi-file-word',
      iconColor: 'text-blue-600',
      tags: [
        { label: 'Memo', severity: 'secondary' },
        { label: 'Pending', severity: 'warn' }
      ],
      modified: '2 days ago',
      modifiedDotColor: 'bg-prussian-blue-200',
      size: '142 KB'
    }
  ]);

  onBreadcrumbClick(segment: string) {
    console.log('Navigate to:', segment);
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
