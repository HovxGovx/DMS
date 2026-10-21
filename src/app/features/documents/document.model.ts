import { DocumentStatus } from '../validation/lifecycle-document.model';
import { RelevanceLevel } from '../search/search-result.model';

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
  /** Libellé court tiré de l'extension (PDF, DOCX…), ou « FICHIER » sans extension. */
  format: string;
  icon: string;
  iconColor: string;
  category: string;
  categorySeverity: DocTag['severity'];
  tags: DocTag[];
  modified: string;
  /** Absent pour un document de dossier ou de recherche (toujours publié). */
  status?: DocumentStatus;
  /** Visible seulement par la personne qui l'a importé et par les validateurs. */
  confidential?: boolean;
  importDate?: string;
  author?: string | null;
  typeLabel?: string | null;
  domainLabel?: string | null;
  /** Emplacement par domaine puis par type (ex : ['Finance', 'Facture fournisseur']), ou ['Non classés']. */
  location: string[];
  statusLabel?: string | null;
  /** Retrait et changement de confidentialité permis (en plus du rôle VALIDATOR). */
  manageable?: boolean;
  /** Pertinence d'un résultat de recherche par mots-clés (absente hors recherche ou sans mots-clés). */
  relevance?: RelevanceLevel | null;
}

export interface MetadataItem {
  label: string;
  value: string;
  dotColor?: string;
}

export interface DocumentDetail {
  name: string;
  docId: string;
  confidential: boolean;
  manageable: boolean;
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
    confidential: !!item.confidential,
    manageable: !!item.manageable,
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
      { label: 'Statut', value: item.statusLabel ?? '' },
      { label: 'Accès', value: item.confidential ? 'Confidentiel' : 'Public' }
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
}
