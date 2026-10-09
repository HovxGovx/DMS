/** Niveau de pertinence calculé par le backend, relatif au meilleur résultat de la même recherche. */
export type RelevanceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface SearchResult {
  id: string;
  originalFileName: string;
  title: string | null;
  author: string | null;
  format: string;
  /** Score Lucene brut : sert au tri côté backend, ne pas l'afficher (non borné, pas un pourcentage). */
  score: number;
  /** null quand la recherche n'a pas de mots-clés (filtres seuls). */
  relevance: RelevanceLevel | null;
  /** Classification validée ; null si le document n'est pas classé. */
  typeCode: string | null;
  typeLabel: string | null;
  domainCode: string | null;
  domainLabel: string | null;
  tags: string[];
  /** Date d'ajout dans la GED (ISO) ; null pour un document indexé avant l'ajout du champ. */
  uploadDate: string | null;
}

export const RELEVANCE_DISPLAY: Record<RelevanceLevel, { label: string; severity: 'success' | 'warn' | 'secondary' }> = {
  HIGH: { label: 'Très pertinent', severity: 'success' },
  MEDIUM: { label: 'Pertinent', severity: 'warn' },
  LOW: { label: 'Peu pertinent', severity: 'secondary' }
};
