import { Injectable, signal, computed } from '@angular/core';
import { PendingImport } from './validation.model';

@Injectable({ providedIn: 'root' })
export class ValidationStateService {

  pendingImports = signal<PendingImport[]>([
    {
      id: '1',
      fileName: 'Facture_Fournisseur_Acme_012...',
      fileIcon: 'pi pi-file-pdf',
      fileIconColor: 'text-red-500',
      suggestedType: 'Facture',
      typeConfidence: 98,
      importedAt: '10:42',
      fileFormat: 'PDF',
      fileSize: '184 KB',
      suggestedTitle: 'Facture Fournisseur - Acme Corp',
      documentType: 'Facture',
      documentTypeConfidence: 98,
      confidentiality: 'Interne',
      confidentialityConfidence: 90,
      tags: [
        { label: 'Facture', status: 'accepted' },
        { label: 'Acme', status: 'accepted' }
      ],
      metadataFields: [
        { key: 'issuer', label: 'Émetteur', value: 'Acme Corp' },
        { key: 'dueDate', label: "Date d'échéance", value: '2026-02-15' },
        { key: 'reference', label: 'Référence', value: 'INV-2026-0042' }
      ],
      suggestedPath: ['Corporate', 'Finance', 'Invoices']
    },
    {
      id: '2',
      fileName: 'Contrat_Service_Vertex_v3.docx',
      fileIcon: 'pi pi-file-word',
      fileIconColor: 'text-blue-600',
      suggestedType: 'Contrat',
      typeConfidence: 85,
      importedAt: '10:41',
      fileFormat: 'DOCX',
      fileSize: '142 KB',
      pageCount: 8,
      suggestedTitle: 'Contrat de Maintenance Applicative - Vertex Ltd',
      documentType: 'Contrat',
      documentTypeConfidence: 85,
      confidentiality: 'Confidentiel',
      confidentialityConfidence: 92,
      tags: [
        { label: 'Contrat', status: 'accepted' },
        { label: 'Maintenance', status: 'accepted' },
        { label: 'IT', status: 'rejected' },
        { label: 'SLA', status: 'accepted' },
        { label: 'Vertex', status: 'accepted' }
      ],
      metadataFields: [
        { key: 'issuer', label: 'Émetteur', value: 'Vertex Ltd' },
        { key: 'effectiveDate', label: "Date d'effet", value: '2026-01-01' },
        { key: 'reference', label: 'Référence', value: 'VMS-2026-001' }
      ],
      suggestedPath: ['Corporate', 'Legal', 'Contracts', 'Clients']
    },
    {
      id: '3',
      fileName: 'Budget_Previsionnel_2026.xlsx',
      fileIcon: 'pi pi-file-excel',
      fileIconColor: 'text-green-600',
      suggestedType: 'Budget',
      typeConfidence: 99,
      importedAt: '10:39',
      fileFormat: 'XLSX',
      fileSize: '89 KB',
      suggestedTitle: 'Budget Prévisionnel 2026',
      documentType: 'Budget',
      documentTypeConfidence: 99,
      confidentiality: 'Interne',
      confidentialityConfidence: 88,
      tags: [
        { label: 'Budget', status: 'accepted' },
        { label: '2026', status: 'accepted' }
      ],
      metadataFields: [
        { key: 'department', label: 'Département', value: 'Finance' },
        { key: 'fiscalYear', label: 'Exercice fiscal', value: '2026' }
      ],
      suggestedPath: ['Corporate', 'Finance', 'Budgets']
    },
    {
      id: '4',
      fileName: 'Note_de_frais_S.Anders_Janv.pdf',
      fileIcon: 'pi pi-file-pdf',
      fileIconColor: 'text-red-500',
      suggestedType: 'Note de frais',
      typeConfidence: 72,
      importedAt: '10:35',
      fileFormat: 'PDF',
      fileSize: '56 KB',
      suggestedTitle: 'Note de frais - Sofia Anders - Janvier 2026',
      documentType: 'Note de frais',
      documentTypeConfidence: 72,
      confidentiality: 'Interne',
      confidentialityConfidence: 75,
      tags: [
        { label: 'Note de frais', status: 'accepted' },
        { label: 'Janvier', status: 'pending' }
      ],
      metadataFields: [
        { key: 'employee', label: 'Employé', value: 'Sofia Anders' },
        { key: 'period', label: 'Période', value: 'Janvier 2026' }
      ],
      suggestedPath: ['Corporate', 'HR', 'Expenses']
    }
  ]);

  selectedImportId = signal<string | null>('2');

  selectedImport = computed(() =>
    this.pendingImports().find(i => i.id === this.selectedImportId()) ?? null
  );

  remainingCount = computed(() => this.pendingImports().length);

  selectImport(id: string) {
    this.selectedImportId.set(id);
  }
}