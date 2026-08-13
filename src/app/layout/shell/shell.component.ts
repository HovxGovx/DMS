import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { IngestPanelComponent } from '../../features/upload/ingest-panel/ingest-panel.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { DocumentDetailPanelComponent } from '../../features/documents/document-detail/document-detail-panel/document-detail-panel.component';
import { DocumentDetail } from '../../features/documents/document.model';
import { ValidationViewComponent } from '../../features/validation/validation-view/validation-view.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet, TopbarComponent, IngestPanelComponent,
    SidebarComponent, DocumentDetailPanelComponent, ValidationViewComponent
  ],
  templateUrl: './shell.component.html'
})
export class ShellComponent {
  currentView = signal<'documents' | 'validation'>('documents');

  toggleView() {
    this.currentView.update(v => v === 'documents' ? 'validation' : 'documents');
  }
  selectedDocument: DocumentDetail = {
    name: 'Q4_Supplier_Invoices.xlsx',
    docId: 'DOC-2025-0987',
    icon: 'pi pi-file-excel',
    iconColor: 'text-green-600',
    tags: [
      { label: 'Spreadsheet', severity: 'info' },
      { label: 'Verified', severity: 'success' },
      { label: 'Contract', severity: 'secondary' }
    ],
    systemMetadata: [
      { label: 'Auteur', value: 'Sofia Anders' },
      { label: 'Créé le', value: '2025-12-28' },
      { label: 'Modifié le', value: 'Hier' },
      { label: 'Taille', value: '1.4 MB' },
      { label: 'Format', value: 'XLSX' }
    ],
    businessMetadata: [
      { label: 'Département', value: 'Finance' },
      { label: "Date d'expiration", value: 'N/A' },
    ],
    aiSummary: 'Synthèse et consolidation de toutes les factures fournisseurs pour le quatrième trimestre 2025. Inclut les écarts de change.'
  };
}