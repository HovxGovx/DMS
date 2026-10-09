import { DocumentStatus, LifecycleDocument } from '../validation/lifecycle-document.model';
import { DocumentItem, DocumentDetail, locationOf } from './document.model';
import { DocMetadata } from './document-metadata.service';
import { RELEVANCE_DISPLAY, SearchResult } from '../search/search-result.model';
import { FolderDocument } from './smart-folder.model';
export interface FileTypeInfo {
  format: string;
  icon: string;
  iconColor: string;
}

/** Type MIME renvoyé par l'extraction des métadonnées → libellé court affiché dans l'UI. */
const MIME_FORMATS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'application/vnd.ms-powerpoint': 'PPT',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'application/vnd.oasis.opendocument.text': 'ODT',
  'application/rtf': 'RTF',
  'text/plain': 'TXT',
  'text/csv': 'CSV'
};

/** Libellé court (PDF, DOCX, TXT…) d'un type MIME, ou null s'il est inconnu. */
export function formatFromMime(mime: string | null): string | null {
  if (!mime) return null;
  // Ignore les paramètres éventuels, ex. "text/plain; charset=UTF-8"
  const type = mime.split(';')[0].trim().toLowerCase();
  return MIME_FORMATS[type] ?? null;
}

export function detectFileType(fileName: string): FileTypeInfo {
  // Sans point, il n'y a pas d'extension : ne pas prendre le nom entier pour un format
  const ext = fileName.includes('.') ? fileName.split('.').pop()!.toLowerCase() : '';

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

const STATUS_LABELS: Record<DocumentStatus, string> = {
  IMPORTED: 'Importé',
  PENDING_VALIDATION: 'En attente de validation',
  EXTRACTION_FAILED: "Échec de l'extraction",
  PUBLISHED: 'Publié',
  INDEXING_FAILED: "Échec de l'indexation"
};

/**
 * Convertit un document du backend (id, fileName, status, importDate, storageReference) en DocumentItem.
 * Les informations non fournies restent vides et ne sont pas affichées.
 */
export function fromLifecycleDocument(doc: LifecycleDocument): DocumentItem {
  const { format, icon, iconColor } = detectFileType(doc.originalFileName);

  return {
    id: doc.id,
    name: doc.originalFileName,
    originalFileName: doc.originalFileName,
    format: format as DocumentItem['format'],
    icon,
    iconColor,
    category: 'Document',
    categorySeverity: 'secondary',
    tags: [{ label: 'Publié', severity: 'success' }],
    modified: formatDate(doc.importDate),
    modifiedDotColor: 'bg-prussian-blue-500',
    importDate: doc.importDate,
    location: [],
    statusLabel: STATUS_LABELS[doc.status] ?? null
  };
}

/**
 * Complète le détail avec les vraies métadonnées système extraites du fichier, quand elles sont disponibles.
 * Une valeur absente côté backend laisse la ligne vide (elle sera masquée).
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
          // L'extension du fichier fait foi ; le type MIME ne sert que si elle est inconnue
          return {
            ...item,
            value: item.value && item.value !== 'FICHIER'
              ? item.value
              : formatFromMime(metadata.format) ?? item.value
          };
        default:
          return item;
      }
    })
  };
}

/**
 * Convertit un résultat de recherche en DocumentItem, avec le même affichage qu'un document de dossier
 * (titre, type, domaine, tags, date d'ajout) plus l'étiquette de pertinence et l'emplacement par domaine et par type.
 */
export function fromSearchResult(result: SearchResult): DocumentItem {
  const { format, icon, iconColor } = detectFileType(result.originalFileName);
  const relevance = result.relevance ? RELEVANCE_DISPLAY[result.relevance] : null;
  const relevanceTags = relevance ? [{ label: relevance.label, severity: relevance.severity }] : [];

  return {
    id: result.id,
    name: result.title?.trim() ? result.title : result.originalFileName,
    originalFileName: result.originalFileName,
    format: format as DocumentItem['format'],
    icon,
    iconColor,
    category: result.typeLabel ?? 'Non classé',
    categorySeverity: 'secondary',
    tags: [...relevanceTags, ...(result.tags ?? []).map(label => ({ label, severity: 'info' as const }))],
    modified: formatDateSafe(result.uploadDate) ?? '',
    modifiedDotColor: 'bg-prussian-blue-500',
    importDate: result.uploadDate ?? undefined,
    author: result.author,
    typeLabel: result.typeLabel,
    domainLabel: result.domainLabel,
    location: locationOf(result.domainLabel, result.typeLabel),
    statusLabel: STATUS_LABELS.PUBLISHED
  };
}

export function fromFolderDocument(doc: FolderDocument): DocumentItem {
  const base = fromLifecycleDocument(doc);
  return {
    ...base,
    name: doc.title?.trim() ? doc.title : base.name,
    category: doc.typeLabel ?? 'Non classé',
    typeLabel: doc.typeLabel,
    domainLabel: doc.domainLabel,
    location: locationOf(doc.domainLabel, doc.typeLabel),
    tags: doc.tags.map(label => ({ label, severity: 'info' as const }))
  };
}
