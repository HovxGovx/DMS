export interface DocTag {
  label: string;
  severity: 'success' | 'info' | 'warn' | 'secondary' | 'danger';
}

/**
 * Document affiché dans le tableau, quelle que soit sa provenance (dossier ou recherche).
 * Règles communes : nom = titre validé sinon nom du fichier, date = date d'ajout, mêmes tags.
 * Un champ inconnu reste vide (null / '') : il n'est simplement pas affiché.
 */
export interface DocumentItem {
  id: string;
  name: string;
  originalFileName: string;
  format: 'PDF' | 'XLSX' | 'DOCX';
  icon: string;
  iconColor: string;
  category: string;
  categorySeverity: DocTag['severity'];
  tags: DocTag[];
  modified: string;
  modifiedDotColor: string;
  locked?: boolean;
  importDate?: string;
  author?: string | null;
  typeLabel?: string | null;
  domainLabel?: string | null;
  /** Emplacement par domaine puis par type (ex : ['Finance', 'Facture fournisseur']), ou ['Non classés']. */
  location: string[];
  statusLabel?: string | null;
}

export interface MetadataItem {
  label: string;
  value: string;
  dotColor?: string;
}

export interface DocumentDetail {
  name: string;
  docId: string;
  icon: string;
  iconColor: string;
  tags: DocTag[];
  location: string[];
  systemMetadata: MetadataItem[];
  businessMetadata: MetadataItem[];
}

export const UNCLASSIFIED_LOCATION = 'Non classés';

/** Emplacement par domaine et par type, tel qu'affiché à l'utilisateur. */
export function locationOf(domainLabel: string | null | undefined, typeLabel: string | null | undefined): string[] {
  if (!typeLabel) return [UNCLASSIFIED_LOCATION];
  return domainLabel ? [domainLabel, typeLabel] : [typeLabel];
}

/**
 * Les valeurs système (auteur, dates du fichier, taille, format MIME) sont complétées ensuite
 * par mergeWithRealMetadata ; les lignes restées vides sont retirées par withoutEmptyValues.
 */
export function toDocumentDetail(item: DocumentItem): DocumentDetail {
  return {
    name: item.name,
    docId: item.id,
    icon: item.icon,
    iconColor: item.iconColor,
    tags: [{ label: item.category, severity: item.categorySeverity }, ...item.tags],
    location: item.location,
    systemMetadata: [
      { label: "Fichier d'origine", value: item.originalFileName },
      { label: 'Auteur', value: item.author ?? '' },
      { label: 'Ajouté le', value: item.modified },
      { label: 'Créé le', value: '' },
      { label: 'Modifié le', value: '' },
      { label: 'Taille', value: '' },
      { label: 'Format', value: item.format }
    ],
    businessMetadata: [
      { label: 'Domaine', value: item.domainLabel ?? '' },
      { label: 'Type', value: item.typeLabel ?? '' },
      { label: 'Statut', value: item.statusLabel ?? '' }
    ]
  };
}

export function withoutEmptyValues(detail: DocumentDetail): DocumentDetail {
  const filled = (items: MetadataItem[]) => items.filter(item => item.value?.trim() && item.value !== '—');
  return {
    ...detail,
    systemMetadata: filled(detail.systemMetadata),
    businessMetadata: filled(detail.businessMetadata)
  };
}

export interface TagFilterOption {
  label: string;
  dotColor: string;
  textColor: string;
  borderColor: string;
  bgActive: string;
}

export const SEVERITY_FILTER_COLORS: Record<DocTag['severity'], Omit<TagFilterOption, 'label'>> = {
  success: { dotColor: 'bg-emerald-500', textColor: 'text-emerald-600', borderColor: 'border-emerald-300', bgActive: 'bg-emerald-50' },
  warn: { dotColor: 'bg-orange-500', textColor: 'text-orange-600', borderColor: 'border-orange-300', bgActive: 'bg-orange-50' },
  info: { dotColor: 'bg-blue-500', textColor: 'text-blue-600', borderColor: 'border-blue-300', bgActive: 'bg-blue-50' },
  secondary: { dotColor: 'bg-prussian-blue-500', textColor: 'text-prussian-blue-600', borderColor: 'border-prussian-blue-300', bgActive: 'bg-prussian-blue-50' },
  danger: { dotColor: 'bg-red-500', textColor: 'text-red-600', borderColor: 'border-red-300', bgActive: 'bg-red-50' }
};
