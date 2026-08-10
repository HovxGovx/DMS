import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { DocumentItem } from '../models/document-item.model';

@Component({
  selector: 'app-document-list',
  standalone: true,
  imports: [CommonModule, TableModule, TagModule, ButtonModule, CheckboxModule, BreadcrumbModule, FormsModule],
  templateUrl: './document-list.component.html',
})
export class DocumentListComponent {
  breadcrumbItems: MenuItem[] = [
    { label: 'Corporate' },
    { label: 'Departments' },
    { label: 'Finance' },
    { label: 'Invoices' },
  ];

  selectedDocs = signal<DocumentItem[]>([]);

  documents = signal<DocumentItem[]>([
    {
      id: '1',
      name: 'INV-2026-0042_Acme_Corp.pdf',
      icon: 'pi-file-pdf',
      iconColor: 'text-red-500',
      tags: [
        { label: 'Invoice', severity: 'invoice' },
        { label: 'Verified', severity: 'verified' },
      ],
      modifiedLabel: '2h ago',
      sizeLabel: '184 KB',
    },
    {
      id: '2',
      name: 'Q4_Supplier_Invoices.xlsx',
      icon: 'pi-file-excel',
      iconColor: 'text-emerald-600',
      tags: [
        { label: 'Spreadsheet', severity: 'spreadsheet' },
        { label: 'Verified', severity: 'verified' },
        { label: 'Contract', severity: 'contract' },
      ],
      modifiedLabel: 'Yesterday',
      sizeLabel: '1.4 MB',
    },
    {
      id: '3',
      name: 'Tax_Computation_Support.xlsx',
      icon: 'pi-file-excel',
      iconColor: 'text-emerald-600',
      tags: [
        { label: 'Spreadsheet', severity: 'spreadsheet' },
        { label: 'Verified', severity: 'verified' },
        { label: 'Confidential', severity: 'confidential' },
      ],
      modifiedLabel: '3 days ago',
      sizeLabel: '482 KB',
      restricted: true,
    },
    {
      id: '4',
      name: 'Payment_Receipt_1042.pdf',
      icon: 'pi-file-pdf',
      iconColor: 'text-red-500',
      tags: [
        { label: 'Receipt', severity: 'receipt' },
        { label: 'Verified', severity: 'verified' },
      ],
      modifiedLabel: '4 days ago',
      sizeLabel: '58 KB',
    },
    {
      id: '5',
      name: 'Vendor_Master_List.xlsx',
      icon: 'pi-file-excel',
      iconColor: 'text-emerald-600',
      tags: [
        { label: 'Master Data', severity: 'master-data' },
        { label: 'Verified', severity: 'verified' },
      ],
      modifiedLabel: '1 wk ago',
      sizeLabel: '2.1 MB',
    },
  ]);

  get verifiedCount(): number {
    return this.documents().filter(d => d.tags.some(t => t.severity === 'verified')).length;
  }

  get restrictedCount(): number {
    return this.documents().filter(d => d.restricted).length;
  }

  tagClass(severity: string): string {
    const map: Record<string, string> = {
      invoice: 'bg-orange-50 text-orange-600',
      spreadsheet: 'bg-blue-50 text-blue-600',
      contract: 'bg-blue-50 text-blue-600',
      confidential: 'bg-blue-50 text-blue-700',
      receipt: 'bg-purple-50 text-purple-600',
      'master-data': 'bg-blue-50 text-blue-700',
      verified: 'bg-emerald-50 text-emerald-600',
    };
    return map[severity] ?? 'bg-prussian-blue-50 text-prussian-blue-500';
  }
}