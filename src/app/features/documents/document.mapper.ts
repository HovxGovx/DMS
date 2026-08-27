import { LifecycleDocument } from '../validation/lifecycle-document.model';
import { DocumentItem } from './document.model';

interface FileTypeInfo {
  format: string;
  icon: string;
  iconColor: string;
}

function detectFileType(fileName: string): FileTypeInfo {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';

  switch (ext) {
    case 'pdf':
      return { format: 'PDF', icon: 'pi pi-file-pdf', iconColor: 'text-red-500' };
    case 'xlsx':
    case 'xls':
      return { format: ext.toUpperCase(), icon: 'pi pi-file-excel', iconColor: 'text-green-600' };
    case 'docx':
    case 'doc':
      return { format: ext.toUpperCase(), icon: 'pi pi-file-word', iconColor: 'text-blue-600' };
    default:
      return { format: ext.toUpperCase() || 'FICHIER', icon: 'pi pi-file', iconColor: 'text-prussian-blue-400' };
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
}

/**
 * Convertit un document du backend (minimal : id, fileName, status, importDate, storageReference)
 * en DocumentItem pour l'affichage. Les champs non fournis par le backend reçoivent une valeur
 * par défaut statique, en attendant que le backend les enrichisse (métadonnées métier, résumé IA...).
 */
export function fromLifecycleDocument(doc: LifecycleDocument): DocumentItem {
  const { format, icon, iconColor } = detectFileType(doc.fileName);

  return {
    name: doc.fileName,
    id: doc.id,
    format: format as DocumentItem['format'],
    icon,
    iconColor,
    category: 'Document',
    categorySeverity: 'secondary',
    tags: [{ label: 'Publié', severity: 'success' }],
    modified: formatDate(doc.importDate),
    modifiedDotColor: 'bg-prussian-blue-500',
    size: '—',
    owner: '—',
    createdAt: formatDate(doc.importDate),
    department: '—',
    expiry: 'N/A',
    aiSummary: "Résumé automatique non disponible pour le moment."
  };
}