import { DocumentItem } from './document.model';

export const DOCUMENTS_BY_FOLDER: Record<string, DocumentItem[]> = {
  finance_invoices: [
    {
      id: 'DOC-2026-0042', name: 'INV-2026-0042_Acme_Corp.pdf', format: 'PDF',
      icon: 'pi pi-file-pdf', iconColor: 'text-red-500',
      category: 'Invoice', categorySeverity: 'secondary',
      tags: [{ label: 'Verified', severity: 'success' }],
      modified: 'Il y a 2h', modifiedDotColor: 'bg-prussian-blue-500', size: '184 KB',
      owner: 'Elena Marquez', createdAt: '2026-01-15', department: 'Finance', expiry: '2027-01-15',
      aiSummary: "Facture trimestrielle pour les services d'intégration API et maintenance infrastructure Acme Corp Q1 2026. Paiement net 30."
    },
    {
      id: 'DOC-2026-0041', name: 'INV-2026-0041_Vertex_Ltd.pdf', format: 'PDF',
      icon: 'pi pi-file-pdf', iconColor: 'text-red-500',
      category: 'Invoice', categorySeverity: 'secondary',
      tags: [{ label: 'Pending', severity: 'warn' }],
      modified: 'Il y a 5h', modifiedDotColor: 'bg-prussian-blue-500', size: '212 KB',
      owner: 'Marcus Chen', createdAt: '2026-01-14', department: 'Finance', expiry: '2027-01-14',
      aiSummary: 'Facture mensuelle pour la location de licences logicielles Vertex Ltd. En attente de validation comptable.'
    },
    {
      id: 'DOC-2026-0043', name: 'INV-2026-0043_Vertex_Ltd.pdf', format: 'PDF',
      icon: 'pi pi-file-pdf', iconColor: 'text-red-500',
      category: 'Invoice', categorySeverity: 'secondary',
      tags: [{ label: 'Pending', severity: 'warn' }],
      modified: 'Il y a 5h', modifiedDotColor: 'bg-prussian-blue-500', size: '212 KB',
      owner: 'Marcus Chen', createdAt: '2026-01-14', department: 'Finance', expiry: '2027-01-14',
      aiSummary: 'Facture mensuelle pour la location de licences logicielles Vertex Ltd. En attente de validation comptable.'
    },
    {
      id: 'DOC-2026-0057', name: 'INV-2026-0057_Vertex_Ltd.pdf', format: 'PDF',
      icon: 'pi pi-file-pdf', iconColor: 'text-red-500',
      category: 'Invoice', categorySeverity: 'secondary',
      tags: [{ label: 'Pending', severity: 'warn' }],
      modified: 'Il y a 5h', modifiedDotColor: 'bg-prussian-blue-500', size: '212 KB',
      owner: 'Marcus Chen', createdAt: '2026-01-14', department: 'Finance', expiry: '2027-01-14',
      aiSummary: 'Facture mensuelle pour la location de licences logicielles Vertex Ltd. En attente de validation comptable.'
    },
    {
      id: 'DOC-2025-0987', name: 'Q4_Supplier_Invoices.xlsx', format: 'XLSX',
      icon: 'pi pi-file-excel', iconColor: 'text-green-600',
      category: 'Spreadsheet', categorySeverity: 'info',
      tags: [{ label: 'Verified', severity: 'success' }, { label: 'Contract', severity: 'secondary' }],
      modified: 'Hier', modifiedDotColor: 'bg-prussian-blue-500', size: '1.4 MB',
      owner: 'Sofia Anders', createdAt: '2025-12-28', department: 'Finance', expiry: 'N/A',
      aiSummary: 'Synthèse et consolidation de toutes les factures fournisseurs pour le quatrième trimestre 2025. Inclut les écarts de change.'
    },
    {
      id: 'DOC-2026-0011', name: 'Tax_Computation_Support.docx', format: 'DOCX',
      icon: 'pi pi-file-word', iconColor: 'text-blue-600',
      category: 'Memo', categorySeverity: 'secondary',
      tags: [{ label: 'Pending', severity: 'warn' }],
      modified: 'Il y a 3j', modifiedDotColor: 'bg-prussian-blue-200', size: '34 KB',
      locked: true,
      owner: 'James Okafor', createdAt: '2026-01-10', department: 'Finance', expiry: '2031-01-10',
      aiSummary: "Note interne détaillant les calculs de réévaluation fiscale des actifs immobilisés pour l'exercice 2025."
    }
  ],
  finance_reports: [
    {
      id: 'DOC-2025-1100', name: 'FY2025_Annual_Report.pdf', format: 'PDF',
      icon: 'pi pi-file-pdf', iconColor: 'text-red-500',
      category: 'Report', categorySeverity: 'secondary',
      tags: [{ label: 'Verified', severity: 'success' }, { label: 'Confidential', severity: 'info' }],
      modified: 'Il y a 6h', modifiedDotColor: 'bg-prussian-blue-500', size: '4.8 MB',
      locked: true,
      owner: 'James Okafor', createdAt: '2025-12-31', department: 'Finance', expiry: '2030-12-31',
      aiSummary: 'Rapport financier annuel complet incluant le compte de résultat, le bilan, et l\'annexe fiscale pour l\'exercice 2025.'
    }
  ],
  finance_budgets: [
    {
      id: 'DOC-2026-0002', name: 'FY2026_Operating_Budget.xlsx', format: 'XLSX',
      icon: 'pi pi-file-excel', iconColor: 'text-green-600',
      category: 'Budget', categorySeverity: 'info',
      tags: [{ label: 'Draft', severity: 'warn' }],
      modified: 'Il y a 3h', modifiedDotColor: 'bg-prussian-blue-500', size: '1.2 MB',
      owner: 'James Okafor', createdAt: '2026-01-05', department: 'Finance', expiry: '2026-12-31',
      aiSummary: "Prévisionnel budgétaire de fonctionnement pour l'année 2026 par département et par centre de coût."
    }
  ],
  legal_contracts: [
    {
      id: 'DOC-2026-0050', name: 'MSA_Acme_Corp_v3.pdf', format: 'PDF',
      icon: 'pi pi-file-pdf', iconColor: 'text-red-500',
      category: 'Contract', categorySeverity: 'warn',
      tags: [{ label: 'Contract', severity: 'secondary' }, { label: 'Verified', severity: 'success' }],
      modified: 'Il y a 1h', modifiedDotColor: 'bg-prussian-blue-500', size: '1.8 MB',
      locked: true,
      owner: 'Priya Singh', createdAt: '2026-01-16', department: 'Legal', expiry: '2028-01-16',
      aiSummary: 'Accord principal de services (MSA) entre DocuFlow et Acme Corp. Version 3 finalisée incluant les clauses de conformité GDPR.'
    }
  ],
  hr_policies: [
    {
      id: 'DOC-2025-0800', name: 'Remote_Work_Policy_v2.pdf', format: 'PDF',
      icon: 'pi pi-file-pdf', iconColor: 'text-red-500',
      category: 'Policy', categorySeverity: 'secondary',
      tags: [{ label: 'Verified', severity: 'success' }],
      modified: 'Il y a 2j', modifiedDotColor: 'bg-prussian-blue-200', size: '124 KB',
      owner: 'Amelia Ross', createdAt: '2025-11-01', department: 'HR', expiry: 'N/A',
      aiSummary: "Politique interne sur le travail à distance. Définit les conditions d'éligibilité, les remboursements et la sécurité informatique."
    }
  ],
  client_acme: [
    {
      id: 'DOC-2026-0045', name: 'Acme_SOW_2026.pdf', format: 'PDF',
      icon: 'pi pi-file-pdf', iconColor: 'text-red-500',
      category: 'Contract', categorySeverity: 'warn',
      tags: [{ label: 'Contract', severity: 'secondary' }, { label: 'Verified', severity: 'success' }],
      modified: 'Il y a 3h', modifiedDotColor: 'bg-prussian-blue-500', size: '246 KB',
      locked: true,
      owner: 'Priya Singh', createdAt: '2026-01-12', department: 'Legal', expiry: '2026-12-31',
      aiSummary: "Déclaration de travail (SOW) pour la migration de l'infrastructure cloud d'Acme Corp vers AWS en 2026."
    }
  ],
  operations: [],
  atlas_migration: [],
  phoenix_launch: []
};