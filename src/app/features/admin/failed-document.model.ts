export type FailedStatus = 'EXTRACTION_FAILED' | 'INDEXING_FAILED';

/** Document dont l'extraction ou l'indexation a échoué. */
export interface FailedDocument {
  id: string;
  fileName: string;
  title: string | null;
  status: FailedStatus;
  importDate: string;
  /** Dernière modification du document, c'est-à-dire le moment de l'échec. */
  failedAt: string | null;
  /** Null pour un ancien import dont l'auteur n'est pas connu. */
  ownerName: string | null;
}

/** Réponse d'une relance : le nouveau statut du document. */
export interface RetryResult {
  id: string;
  status: string;
}
