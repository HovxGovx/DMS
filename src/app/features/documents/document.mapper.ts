import { LifecycleDocument } from '../validation/lifecycle-document.model';
import { DocumentItem, DocumentDetail } from './document.model';
import { DocMetadata } from './document-metadata.service';

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

function formatDateSafe(iso: string | null): string | null {
  if (!iso) return null;
  return formatDate(iso);
}

/**
 * Convertit un document du backend (minimal : id, fileName, status, importDate, storageReference)
 * en DocumentItem pour l'affichage. Les champs non fournis par le backend reçoivent une valeur
 * par défaut statique, en attendant que le backend les enrichisse.
 */
export function fromLifecycleDocument(doc: LifecycleDocument): DocumentItem {
  const { format, icon, iconColor } = detectFileType(doc.originalFileName);

  return {
    id: doc.id,
    name: doc.originalFileName,
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

/**
 * Fusionne un DocumentDetail (valeurs par défaut) avec les vraies métadonnées système
 * si elles sont disponibles. Ne remplace que les champs réellement fournis par le backend —
 * tout champ absent/null garde sa valeur par défaut existante.
 */
export function mergeWithRealMetadata(base: DocumentDetail, metadata: DocMetadata | null): DocumentDetail {
  if (!metadata) return base;

  return {
    ...base,
    systemMetadata: base.systemMetadata.map(item => {
      switch (item.label) {
        case 'Auteur':
          return { ...item, value: metadata.author ?? item.value };
        case 'Créé le':
          return { ...item, value: formatDateSafe(metadata.creationDate) ?? item.value };
        case 'Modifié le':
          return { ...item, value: formatDateSafe(metadata.modificationDate) ?? item.value };
        case 'Taille':
          return { ...item, value: metadata.fileSize ?? item.value };
        case 'Format':
          return { ...item, value: metadata.format ?? item.value };
        default:
          return item;
      }
    })
  };
}